import { useState, useEffect, useRef, useCallback } from 'react';
import { gameStore } from '../game/gameStore';

function ParticleBurst({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    return { id: i, tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, size: 4 + Math.random() * 6, delay: Math.random() * 0.1 };
  });
  return (
    <div className="particle-burst" style={{ left: x, top: y }}>
      {particles.map(p => (
        <div key={p.id} className="particle-dot" style={{ width: p.size, height: p.size, background: color, '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, animationDelay: `${p.delay}s` } as React.CSSProperties} />
      ))}
    </div>
  );
}

const getCorrectMessages = (name: string) => [`${name}, you are amazing!`, `Brilliant work, ${name}!`, `Super star, ${name}!`, `Excellent thinking, ${name}!`, `${name}, you are a whiz!`, `Outstanding, ${name}!`, `Way to go, ${name}!`, `Crushed it, ${name}!`, `So proud of you, ${name}!`, `Genius move, ${name}!`, `Fantastic, ${name}!`, `You make it look easy, ${name}!`];
const getEncouragingMessages = (name: string) => [`Keep trying, ${name}! You will get it!`, `Good effort, ${name}! Learning is fun!`, `Almost there, ${name}! Try again!`, `Nice try, ${name}! Mistakes help us learn!`, `Don't give up, ${name}! You are getting better!`, `Great try, ${name}! Every attempt counts!`, `Learning moment, ${name}! Now you know!`, `That's okay, ${name}! Keep practicing!`];

export default function QuestionScreen() {
  const [, forceUpdate] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const prevQuestionRef = useRef(0);

  useEffect(() => {
    return gameStore.subscribe(() => {
      const s = gameStore.getState();
      if (s.currentQuestionIndex !== prevQuestionRef.current) {
        prevQuestionRef.current = s.currentQuestionIndex;
        setHasAnswered(false);
      }
      forceUpdate(n => n + 1);
    });
  }, []);

  const state = gameStore.getState();
  const subject = state.currentSubject!;
  const book = state.currentBook!;
  const world = state.currentWorld!;
  const currentQ = state.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex) / state.questions.length) * 100;
  const isLocked = hasAnswered || state.showResult;
  const playerName = state.progress.playerName || 'Explorer';
  const appreciationMsg = state.isCorrect
    ? (state.isRetry ? `Good recovery, ${playerName}! (Half star)` : getCorrectMessages(playerName)[state.currentQuestionIndex % 12])
    : getEncouragingMessages(playerName)[state.currentQuestionIndex % 8];

  const handleAnswer = useCallback((index: number, event: React.MouseEvent) => {
    if (hasAnswered || state.showResult) return;
    setHasAnswered(true);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const isCorrect = index === currentQ.correctIndex;
    gameStore.selectAnswer(index);
    setParticles(prev => [...prev, { id: Date.now(), x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color: isCorrect ? '#4CAF50' : '#F44336' }]);
    setTimeout(() => setParticles(prev => prev.slice(1)), 1000);
  }, [hasAnswered, state.showResult, currentQ.correctIndex]);

  const handleRetry = () => { gameStore.retryQuestion(); setHasAnswered(false); };
  const handleNext = () => { setHasAnswered(false); gameStore.nextQuestion(); };
  const handleBack = () => {
    if (state.currentQuestionIndex > 0 || state.correctCount > 0 || state.wrongCount > 0) setShowBackConfirm(true);
    else doGoBack();
  };
  const doGoBack = () => { setHasAnswered(false); setShowBackConfirm(false); gameStore.goToWorlds(); };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => { e.preventDefault(); handleBack(); window.history.pushState({ page: 'question' }, ''); };
    window.history.pushState({ page: 'question' }, '');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const earnedStars = state.correctCount;
  const getBtnClass = (index: number): string => {
    let c = 'answer-btn';
    if (!isLocked) return c;
    if (state.isCorrect && index === currentQ.correctIndex) c += ' revealed-correct';
    if (!state.isCorrect && index === state.selectedAnswer) c += ' wrong';
    return c;
  };

  return (
    <div className="question-screen" style={{ background: `linear-gradient(180deg, ${world.color} 0%, #1a1a2e 60%)` }}>
      {particles.map(p => <ParticleBurst key={p.id} x={p.x} y={p.y} color={p.color} />)}

      {showBackConfirm && (
        <div className="modal-overlay" onClick={() => setShowBackConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Leave World?</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>Your progress in this world will be saved. Are you sure?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="modal-close" style={{ background: '#666' }} onClick={() => setShowBackConfirm(false)}>Keep Playing</button>
              <button className="modal-close" onClick={doGoBack}>Leave</button>
            </div>
          </div>
        </div>
      )}

      <button className="btn-back" onClick={handleBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <div className="question-header">
        <div className="question-progress">
          <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${world.color}, #81C784)` }} /></div>
          <div className="progress-text">Q{state.currentQuestionIndex + 1} of {state.questions.length}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', justifyContent: 'flex-end', maxWidth: 90 }}>
          {Array.from({ length: state.questions.length }, (_, i) => i + 1).map(s => {
            if (s <= earnedStars) return <span key={s} style={{ fontSize: 8, color: '#FF8C42', lineHeight: 1 }}>★</span>;
            return <span key={s} style={{ fontSize: 8, color: '#ddd', lineHeight: 1 }}>☆</span>;
          })}
        </div>
      </div>

      <div className="question-body">
        <div className="question-card" key={`${state.currentQuestionIndex}-${state.isRetry}`}>
          <div className="question-label">{subject.name} — {world.topic} {state.isRetry && <span style={{ color: '#FF6B35' }}>(Retry)</span>}</div>
          {currentQ.image && <img src={currentQ.image} alt="Question" className="question-image" />}
          <div className="question-text">{currentQ.question}</div>
        </div>

        <div className="answers-grid">
          {currentQ.options.map((option, index) => (
            <button key={`${state.currentQuestionIndex}-${index}-${state.isRetry}`} className={getBtnClass(index)} onClick={(e) => handleAnswer(index, e)} disabled={isLocked} data-testid={`answer-btn-${index}`}>{option}</button>
          ))}
        </div>

        {state.showResult && state.isCorrect && (
          <div className="explanation-box">
            <div className="appreciation-text" data-testid="appreciation-message">{appreciationMsg}</div>
            <div className="explanation-title">{['Great job!', 'Excellent!', 'Amazing!', 'Brilliant!', 'Perfect!', 'Outstanding!', 'Super!', 'Fantastic!', 'Wonderful!', 'Awesome!'][state.currentQuestionIndex % 10]}</div>
            <div className="explanation-text">{currentQ.explanation}</div>
          </div>
        )}

        {state.showResult && !state.isCorrect && (
          <div className="explanation-box" style={{ background: '#FFF3E0', borderLeftColor: '#FF9800' }}>
            <div className="appreciation-text" style={{ color: '#E65100' }} data-testid="appreciation-message">{appreciationMsg}</div>
            <div className="explanation-title" style={{ color: '#E65100' }}>Try Again!</div>
            <div className="explanation-text" style={{ color: '#BF360C' }}>You can do it! Take another shot at this question.</div>
          </div>
        )}

        {state.showResult && state.isCorrect && (
          <button className="next-btn" onClick={handleNext} data-testid="next-btn">
            {state.currentQuestionIndex < state.questions.length - 1 ? 'Next Question →' : 'See Results!'}
          </button>
        )}

        {state.showResult && !state.isCorrect && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '14px', animation: 'slideUpFade 0.3s ease' }}>
            <button className="next-btn" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8E53)', fontSize: '18px' }} onClick={handleRetry} data-testid="retry-btn">
              Try Again! ↻
            </button>
            <button className="next-btn" style={{ background: '#666', fontSize: '18px' }} onClick={handleNext} data-testid="skip-btn">
              Skip →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
