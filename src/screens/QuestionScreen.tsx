import { useState, useEffect, useCallback } from 'react';
import { gameStore } from '../game/gameStore';

function ParticleBurst({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    return {
      id: i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.1,
    };
  });

  return (
    <div className="particle-burst" style={{ left: x, top: y }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle-dot"
          style={{
            width: p.size,
            height: p.size,
            background: color,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function QuestionScreen() {
  const [, forceUpdate] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    return gameStore.subscribe(() => forceUpdate(n => n + 1));
  }, []);

  const state = gameStore.getState();
  const world = state.currentWorld!;
  const currentQ = state.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex) / state.questions.length) * 100;

  const handleAnswer = useCallback((index: number, event: React.MouseEvent) => {
    if (state.showResult) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    gameStore.selectAnswer(index);

    const isCorrect = index === currentQ.correctIndex;
    setParticles(prev => [...prev, {
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      color: isCorrect ? '#4CAF50' : '#F44336',
    }]);

    // Clean up particles
    setTimeout(() => {
      setParticles(prev => prev.slice(1));
    }, 1000);
  }, [state.showResult, currentQ]);

  const handleNext = () => {
    gameStore.nextQuestion();
  };

  // Compute earned stars so far
  const earnedStars = state.correctCount;

  return (
    <div className="question-screen" style={{ background: `linear-gradient(180deg, ${world.color} 0%, #1a1a2e 60%)` }}>
      {/* Particles */}
      {particles.map(p => (
        <ParticleBurst key={p.id} x={p.x} y={p.y} color={p.color} />
      ))}

      {/* Header */}
      <div className="question-header">
        <button className="btn-back" onClick={() => gameStore.goToWorlds()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="question-progress">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${world.color}, #81C784)`,
              }}
            />
          </div>
          <div className="progress-text">
            Q{state.currentQuestionIndex + 1} of {state.questions.length}
          </div>
        </div>

        <div className="question-stars">
          {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={`star-icon ${s <= earnedStars ? 'earned' : ''}`}>
              {s <= earnedStars ? '★' : '☆'}
            </span>
          ))}
        </div>
      </div>

      {/* Question Body */}
      <div className="question-body">
        {/* Question Card */}
        <div className="question-card" key={state.currentQuestionIndex}>
          <div className="question-label">{world.topic}</div>
          <div className="question-text">{currentQ.question}</div>
        </div>

        {/* Answer Buttons */}
        <div className="answers-grid">
          {currentQ.options.map((option, index) => {
            let className = 'answer-btn';
            if (state.showResult) {
              if (index === currentQ.correctIndex) {
                className += ' revealed-correct';
              }
              if (index === state.selectedAnswer && !state.isCorrect) {
                className += ' wrong';
              }
              if (index === state.selectedAnswer && state.isCorrect) {
                className += ' correct';
              }
            }

            return (
              <button
                key={`${state.currentQuestionIndex}-${index}`}
                className={className}
                onClick={(e) => handleAnswer(index, e)}
                disabled={state.showResult}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {state.showResult && state.isCorrect && (
          <div className="explanation-box">
            <div className="explanation-title">
              {['Great job!', 'Excellent!', 'Amazing!', 'Brilliant!', 'Perfect!'][state.currentQuestionIndex % 5]}
            </div>
            <div className="explanation-text">{currentQ.explanation}</div>
          </div>
        )}

        {state.showResult && !state.isCorrect && (
          <div className="explanation-box" style={{ background: '#FFEBEE', borderLeftColor: '#F44336' }}>
            <div className="explanation-title" style={{ color: '#C62828' }}>Not quite!</div>
            <div className="explanation-text" style={{ color: '#D32F2F' }}>
              The correct answer is: {currentQ.options[currentQ.correctIndex]}
            </div>
          </div>
        )}

        {/* Next Button */}
        {state.showResult && (
          <button className="next-btn" onClick={handleNext}>
            {state.currentQuestionIndex < state.questions.length - 1 ? 'Next Question →' : 'See Results!'}
          </button>
        )}
      </div>
    </div>
  );
}
