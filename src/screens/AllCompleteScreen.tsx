import { useState, useEffect } from 'react';
import { gameStore, WORLDS } from '../game/gameStore';

export default function AllCompleteScreen() {
  const [showContent, setShowContent] = useState(false);
  const state = gameStore.getState();

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  const totalStars = Object.values(state.progress.worldStars).reduce((a, b) => a + b, 0);
  const maxStars = WORLDS.length * 5;

  return (
    <div className="all-complete-screen">
      {showContent && (
        <>
          <img src="/assets/mascot.png" alt="Math Wizard" className="all-complete-mascot" />

          <h2 className="all-complete-title">You're a Math Master!</h2>

          <p className="all-complete-text">
            You completed all 10 worlds! You collected {totalStars} out of {maxStars} stars!
          </p>

          <div className="complete-stars" style={{ marginBottom: '24px' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <span
                key={s}
                className="complete-star earned"
                style={{ animationDelay: `${s * 0.15}s` }}
              >
                ★
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
            <button
              className="btn-play"
              onClick={() => gameStore.goToWorlds()}
              style={{ marginBottom: 0 }}
            >
              Play Again
            </button>
            <button
              className="btn-secondary"
              onClick={() => gameStore.goToMenu()}
            >
              Main Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
}
