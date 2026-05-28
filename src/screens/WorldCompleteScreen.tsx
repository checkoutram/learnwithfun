import { useState, useEffect, useMemo } from 'react';
import { gameStore } from '../game/gameStore';

interface ConfettiPiece { id: number; left: number; delay: number; duration: number; color: string; size: number; }
const CONFETTI_COLORS = ['#FFC107', '#4CAF50', '#2196F3', '#E91E63', '#FF5722', '#9C27B0', '#00BCD4'];

function Confetti() {
  const pieces = useMemo<ConfettiPiece[]>(() => Array.from({ length: 40 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 2, duration: 2 + Math.random() * 3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)], size: 6 + Math.random() * 8,
  })), []);
  return <div className="confetti-container">{pieces.map(p => <div key={p.id} className="confetti-piece" style={{ left: `${p.left}%`, width: `${p.size}px`, height: `${p.size * 1.5}px`, background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, borderRadius: '2px' }} />)}</div>;
}

export default function WorldCompleteScreen() {
  const state = gameStore.getState();
  const world = state.currentWorld!;
  const [showContent, setShowContent] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShowContent(true), 300); return () => clearTimeout(t); }, []);
  const earnedStars = state.correctCount;
  const totalQuestions = state.questions.length || 10;
  const playerName = state.progress.playerName || 'Explorer';
  const msgs = [`${playerName}, keep practicing!`, `Good effort, ${playerName}!`, `Nice work, ${playerName}!`, `Great job, ${playerName}!`, `${playerName}, you are amazing!`, `Well done, ${playerName}!`, `Super work, ${playerName}!`, `Fantastic, ${playerName}!`, `Excellent, ${playerName}!`, `Brilliant, ${playerName}!`, `Perfect score, ${playerName}!`];

  return (
    <div className="complete-screen">
      <Confetti />
      {showContent && <>
        <img src="/assets/trophy.png" alt="Trophy" className="complete-trophy" />
        <h2 className="complete-title">World Complete!</h2>
        <p className="complete-world">{world.name}</p>
        <div className="complete-stars">
          {Array.from({ length: Math.min(earnedStars, 5) }, (_, i) => <span key={`f${i}`} className="complete-star earned">★</span>)}
          {Array.from({ length: Math.max(0, 5 - earnedStars) }, (_, i) => <span key={`e${i}`} className="complete-star empty">☆</span>)}
        </div>
        <p className="complete-score">{earnedStars}/{totalQuestions} stars — {msgs[Math.min(Math.floor((earnedStars / totalQuestions) * 10), 10)]}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
          <button className="btn-play" style={{ marginBottom: 0 }} onClick={() => gameStore.goToWorlds()}>Back to Worlds</button>
        </div>
      </>}
    </div>
  );
}
