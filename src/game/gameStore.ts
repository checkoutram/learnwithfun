import { QuestionGenerator } from './QuestionGenerator';
import type { MathQuestion } from './QuestionGenerator';
import { SUBJECTS } from './subjects';
import type { SubjectData, BookData, WorldData } from './subjects';

export type GameScreen = 'menu' | 'nameInput' | 'grade' | 'syllabus' | 'subjects' | 'books' | 'worlds' | 'question' | 'worldComplete' | 'allComplete';

export interface GradeData { id: number; name: string; label: string; enabled: boolean; }
export interface SyllabusData { id: string; name: string; label: string; enabled: boolean; }

export const GRADES: GradeData[] = [
  { id: 1, name: '1st', label: '1st Standard', enabled: false },
  { id: 2, name: '2nd', label: '2nd Standard', enabled: false },
  { id: 3, name: '3rd', label: '3rd Standard', enabled: false },
  { id: 4, name: '4th', label: '4th Standard', enabled: false },
  { id: 5, name: '5th', label: '5th Standard', enabled: true },
  { id: 6, name: '6th', label: '6th Standard', enabled: false },
  { id: 7, name: '7th', label: '7th Standard', enabled: false },
  { id: 8, name: '8th', label: '8th Standard', enabled: false },
  { id: 9, name: '9th', label: '9th Standard', enabled: false },
  { id: 10, name: '10th', label: '10th Standard', enabled: false },
  { id: 11, name: '11th', label: '11th Standard', enabled: false },
  { id: 12, name: '12th', label: '12th Standard', enabled: false },
];

export const SYLLABI: SyllabusData[] = [
  { id: 'cbse', name: 'CBSE', label: 'Central Board of Secondary Education', enabled: true },
  { id: 'icse', name: 'ICSE', label: 'Indian Certificate of Secondary Education', enabled: false },
  { id: 'state', name: 'State Board', label: 'State Board (TN / Other)', enabled: false },
  { id: 'ib', name: 'IB / Cambridge Intl', label: 'International Baccalaureate', enabled: false },
];

export interface QuestionAttempt {
  retries: number;
  gotCorrect: boolean;
}

export interface GameProgress {
  playerName: string;
  subjectProgress: Record<string, Record<number, Record<number, number>>>; // stars (can be 0.5)
}

function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem('subjectsOfFun_v1');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { playerName: '', subjectProgress: {} };
}

function saveProgress(p: GameProgress) {
  localStorage.setItem('subjectsOfFun_v1', JSON.stringify(p));
}

type Listener = () => void;

class GameStore {
  private listeners: Listener[] = [];

  screen: GameScreen = 'menu';
  selectedGrade: GradeData | null = null;
  selectedSyllabus: SyllabusData | null = null;
  currentSubject: SubjectData | null = null;
  currentBook: BookData | null = null;
  currentWorld: WorldData | null = null;
  questions: MathQuestion[] = [];
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  selectedAnswer: number | null = null;
  showResult = false;
  isCorrect = false;
  isRetry = false;
  retryCount = 0;
  questionAttempts: QuestionAttempt[] = [];
  progress: GameProgress = loadProgress();

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify() { this.listeners.forEach(l => l()); }

  setScreen(screen: GameScreen) { this.screen = screen; this.notify(); }

  setPlayerName(name: string) {
    this.progress.playerName = name.trim();
    saveProgress(this.progress);
    this.notify();
  }

  selectGrade(gradeId: number) {
    const grade = GRADES.find(g => g.id === gradeId);
    if (!grade || !grade.enabled) return;
    this.selectedGrade = grade;
    this.selectedSyllabus = null;
    this.currentSubject = null;
    this.currentBook = null;
    this.currentWorld = null;
    this.screen = 'syllabus';
    this.notify();
  }

  selectSyllabus(syllabusId: string) {
    const syllabus = SYLLABI.find(s => s.id === syllabusId);
    if (!syllabus || !syllabus.enabled) return;
    this.selectedSyllabus = syllabus;
    this.currentSubject = null;
    this.currentBook = null;
    this.currentWorld = null;
    this.screen = 'subjects';
    this.notify();
  }

  selectSubject(subjectId: string) {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject) return;
    this.currentSubject = subject;
    const activeBooks = subject.books.filter(b => !b.disabled);
    if (activeBooks.length === 1) {
      this.currentBook = activeBooks[0];
      this.screen = 'worlds';
    } else {
      this.screen = 'books';
    }
    this.currentWorld = null;
    this.notify();
  }

  selectBook(bookId: number) {
    if (!this.currentSubject) return;
    const book = this.currentSubject.books.find(b => b.id === bookId);
    if (!book || book.disabled) return;
    this.currentBook = book;
    this.currentWorld = null;
    this.screen = 'worlds';
    this.notify();
  }

  startWorld(worldId: number) {
    if (!this.currentSubject || !this.currentBook) return;
    const world = this.currentBook.worlds.find(w => w.id === worldId);
    if (!world) return;
    this.currentWorld = world;
    this.questions = QuestionGenerator.getQuestions(this.currentSubject.id, this.currentBook.id, worldId, 10);
    this.currentQuestionIndex = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.selectedAnswer = null;
    this.showResult = false;
    this.isCorrect = false;
    this.isRetry = false;
    this.retryCount = 0;
    this.questionAttempts = this.questions.map(() => ({ retries: 0, gotCorrect: false }));
    this.screen = 'question';
    this.notify();
  }

  selectAnswer(index: number) {
    if (this.showResult) return;
    this.selectedAnswer = index;
    const currentQ = this.questions[this.currentQuestionIndex];
    this.isCorrect = index === currentQ.correctIndex;
    this.showResult = true;

    const attempt = this.questionAttempts[this.currentQuestionIndex];
    attempt.gotCorrect = this.isCorrect;

    if (this.isCorrect) {
      // First try = 1 star, Retry = 0.5 star
      const starsEarned = this.isRetry ? 0.5 : 1;
      this.correctCount += starsEarned;
    } else {
      this.wrongCount++;
    }

    this.notify();
  }

  retryQuestion() {
    // Reset for retry
    this.isRetry = true;
    this.retryCount++;
    this.selectedAnswer = null;
    this.showResult = false;
    this.isCorrect = false;
    // Remove wrong answer penalty
    if (this.wrongCount > 0) this.wrongCount--;
    this.questionAttempts[this.currentQuestionIndex].retries++;
    this.notify();
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      this.showResult = false;
      this.isCorrect = false;
      this.isRetry = false;
      this.notify();
    } else {
      this.completeWorld();
    }
  }

  private completeWorld() {
    if (!this.currentSubject || !this.currentBook || !this.currentWorld) return;
    const sid = this.currentSubject.id, bid = this.currentBook.id, wid = this.currentWorld.id;
    if (!this.progress.subjectProgress[sid]) this.progress.subjectProgress[sid] = {};
    if (!this.progress.subjectProgress[sid][bid]) this.progress.subjectProgress[sid][bid] = {};
    const prevStars = this.progress.subjectProgress[sid][bid][wid] || 0;
    this.progress.subjectProgress[sid][bid][wid] = Math.max(prevStars, this.correctCount);
    saveProgress(this.progress);
    this.screen = 'worldComplete';
    this.notify();
  }

  goToMenu() { this.screen = 'menu'; this.notify(); }
  goToGrade() { this.screen = 'grade'; this.currentSubject = null; this.currentBook = null; this.currentWorld = null; this.notify(); }
  goToSyllabus() { this.screen = 'syllabus'; this.currentSubject = null; this.currentBook = null; this.currentWorld = null; this.notify(); }
  goToSubjects() { this.screen = 'subjects'; this.currentBook = null; this.currentWorld = null; this.notify(); }
  goToBooks() { this.screen = 'books'; this.notify(); }
  goToWorlds() { this.screen = 'worlds'; this.notify(); }

  resetProgress() {
    this.progress = { playerName: this.progress.playerName, subjectProgress: {} };
    saveProgress(this.progress);
    this.notify();
  }

  getStarsForWorld(subjectId: string, bookId: number, worldId: number): number {
    return this.progress.subjectProgress[subjectId]?.[bookId]?.[worldId] || 0;
  }

  getState() {
    return {
      screen: this.screen,
      selectedGrade: this.selectedGrade,
      selectedSyllabus: this.selectedSyllabus,
      currentSubject: this.currentSubject,
      currentBook: this.currentBook,
      currentWorld: this.currentWorld,
      questions: this.questions,
      currentQuestionIndex: this.currentQuestionIndex,
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      selectedAnswer: this.selectedAnswer,
      showResult: this.showResult,
      isCorrect: this.isCorrect,
      isRetry: this.isRetry,
      retryCount: this.retryCount,
      questionAttempts: this.questionAttempts,
      progress: this.progress,
    };
  }
}

export const gameStore = new GameStore();
export { SUBJECTS };
export type { SubjectData, BookData, WorldData };
