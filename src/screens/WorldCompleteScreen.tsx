import { useEffect, useState, useMemo } from 'react';
import { gameStore, WORLDS } from '../game/gameStore';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

const CONFETTI_COLORS = ['#FFC107', '#4CAF50', '#2196F3', '#E91E63', '#FF5722', '#9C27B0', '#00BCD4'];

function Confetti() {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
    }));
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function WorldCompleteScreen() {
  const state = gameStore.getState();
  const world = state.currentWorld!;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  const earnedStars = state.correctCount;
  const starMessages = [
    'Keep practicing!',
    'Good effort!',
    'Nice work!',
    'Great job!',
    'Amazing!',
  ];

  return (
    <div className="complete-screen">
      <Confetti />

      {showContent && (
        <>
          <img src="/assets/trophy.png" alt="Trophy" className="complete-trophy" />

          <h2 className="complete-title">World Complete!</h2>
          <p className="complete-world">{world.name}</p>

          <div className="complete-stars">
            {[1, 2, 3, 4, 5].map(s => (
              <span
                key={s}
                className={`complete-star ${s <= earnedStars ? 'earned' : 'empty'}`}
              >
                {s <= earnedStars ? '★' : '☆'}
              </span>
            ))}
          </div>

          <p className="complete-score">
            {earnedStars}/5 stars — {starMessages[earnedStars]}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
            {world.id < 10 && (
              <button
                className="btn-play"
                onClick={() => gameStore.startWorld(world.id + 1)}
                style={{ marginBottom: 0, background: `linear-gradient(135deg, ${WORLDS[world.id].color}, ${world.color})` }}
              >
                Next World →
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={() => gameStore.goToWorlds()}
            >
              World Map
            </button>
          </div>
        </>
      )}
    </div>
  );
}
