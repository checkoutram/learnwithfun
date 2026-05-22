// Game State Store - manages all game state with a simple pub-sub pattern
import { QuestionGenerator } from './QuestionGenerator';
import type { MathQuestion } from './QuestionGenerator';

export type GameScreen = 'menu' | 'worlds' | 'question' | 'worldComplete' | 'allComplete';

export interface WorldData {
  id: number;
  name: string;
  topic: string;
  color: string;
  icon: string;
}

export const WORLDS: WorldData[] = [
  { id: 1, name: 'Number Kingdom', topic: 'Place Value', color: '#4CAF50', icon: '/assets/world1.png' },
  { id: 2, name: 'Multiplication Forest', topic: 'Multiplication', color: '#2E7D32', icon: '/assets/world2.png' },
  { id: 3, name: 'Division Desert', topic: 'Division', color: '#FF8F00', icon: '/assets/world3.png' },
  { id: 4, name: 'Factor Farm', topic: 'Factors & Multiples', color: '#8BC34A', icon: '/assets/world4.png' },
  { id: 5, name: 'Lake Fraction', topic: 'Fractions', color: '#00ACC1', icon: '/assets/world5.png' },
  { id: 6, name: 'Decimal City', topic: 'Decimals', color: '#7B1FA2', icon: '/assets/world6.png' },
  { id: 7, name: 'Percentage Park', topic: 'Percentages', color: '#E91E63', icon: '/assets/world7.png' },
  { id: 8, name: 'Geometry Mountain', topic: 'Geometry', color: '#5D4037', icon: '/assets/world8.png' },
  { id: 9, name: 'Measurement Meadows', topic: 'Measurement', color: '#F9A825', icon: '/assets/world9.png' },
  { id: 10, name: 'Data Castle', topic: 'Data Handling', color: '#3F51B5', icon: '/assets/world10.png' },
];

export interface GameProgress {
  unlockedWorlds: number[];
  completedWorlds: number[];
  worldStars: Record<number, number>;
}

function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem('mathQuestProgress_v2');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { unlockedWorlds: [1], completedWorlds: [], worldStars: {} };
}

function saveProgress(p: GameProgress) {
  localStorage.setItem('mathQuestProgress_v2', JSON.stringify(p));
}

type Listener = () => void;

class GameStore {
  private listeners: Listener[] = [];
  
  screen: GameScreen = 'menu';
  currentWorld: WorldData | null = null;
  questions: MathQuestion[] = [];
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  selectedAnswer: number | null = null;
  showResult = false;
  isCorrect = false;
  progress: GameProgress = loadProgress();
  transitionDirection: 'in' | 'out' = 'in';

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  setScreen(screen: GameScreen) {
    this.screen = screen;
    this.notify();
  }

  startWorld(worldId: number) {
    const world = WORLDS.find(w => w.id === worldId);
    if (!world) return;
    
    this.currentWorld = world;
    this.questions = QuestionGenerator.getQuestionsForWorld(worldId, 5);
    this.currentQuestionIndex = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.selectedAnswer = null;
    this.showResult = false;
    this.isCorrect = false;
    this.screen = 'question';
    this.notify();
  }

  selectAnswer(index: number) {
    if (this.showResult) return;
    this.selectedAnswer = index;
    const currentQ = this.questions[this.currentQuestionIndex];
    this.isCorrect = index === currentQ.correctIndex;
    this.showResult = true;
    
    if (this.isCorrect) {
      this.correctCount++;
    } else {
      this.wrongCount++;
    }
    
    this.notify();
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      this.showResult = false;
      this.isCorrect = false;
      this.notify();
    } else {
      // World complete
      this.completeWorld();
    }
  }

  private completeWorld() {
    if (!this.currentWorld) return;
    
    const worldId = this.currentWorld.id;
    
    if (!this.progress.completedWorlds.includes(worldId)) {
      this.progress.completedWorlds.push(worldId);
    }
    
    this.progress.worldStars[worldId] = Math.max(
      this.progress.worldStars[worldId] || 0,
      this.correctCount
    );
    
    const nextWorldId = worldId + 1;
    if (nextWorldId <= 10 && !this.progress.unlockedWorlds.includes(nextWorldId)) {
      this.progress.unlockedWorlds.push(nextWorldId);
    }
    
    saveProgress(this.progress);
    
    if (worldId === 10) {
      this.screen = 'allComplete';
    } else {
      this.screen = 'worldComplete';
    }
    this.notify();
  }

  goToMenu() {
    this.screen = 'menu';
    this.currentWorld = null;
    this.notify();
  }

  goToWorlds() {
    this.screen = 'worlds';
    this.currentWorld = null;
    this.notify();
  }

  resetProgress() {
    this.progress = { unlockedWorlds: [1], completedWorlds: [], worldStars: {} };
    saveProgress(this.progress);
    this.notify();
  }

  getState() {
    return {
      screen: this.screen,
      currentWorld: this.currentWorld,
      questions: this.questions,
      currentQuestionIndex: this.currentQuestionIndex,
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      selectedAnswer: this.selectedAnswer,
      showResult: this.showResult,
      isCorrect: this.isCorrect,
      progress: this.progress,
    };
  }
}

export const gameStore = new GameStore();
