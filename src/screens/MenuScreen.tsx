import { useState, useMemo } from 'react';
import { gameStore } from '../game/gameStore';

const FLOAT_SYMBOLS = ['+', '-', 'x', '/', '=', '%', 'A', 'B', 'C', 'S', 'E', 'F'];

export default function MenuScreen() {
  const [showHelp, setShowHelp] = useState(false);

  const floatingSymbols = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      symbol: FLOAT_SYMBOLS[i % FLOAT_SYMBOLS.length],
      left: Math.random() * 90 + 5,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 18 + Math.random() * 20,
    })),
    []
  );

  const handlePlay = () => {
    const state = gameStore.getState();
    if (state.progress.playerName) {
      gameStore.goToSubjects();
    } else {
      gameStore.setScreen('nameInput');
    }
  };

  return (
    <div className="menu-screen">
      <div className="menu-bg-overlay" />

      {floatingSymbols.map(s => (
        <div
          key={s.id}
          className="float-symbol"
          style={{
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          {s.symbol}
        </div>
      ))}

      <div className="menu-content">
        <div className="hero-container">
          <img src="/assets/hero_kids.png" alt="Subjects of Fun" className="hero-img" />
        </div>

        <h1 className="game-title">Subjects of Fun</h1>
        <p className="game-subtitle">Choose your Subject to play with.</p>

        <button className="btn-play" onClick={handlePlay}>
          PLAY NOW
        </button>

        <button className="btn-secondary" onClick={() => setShowHelp(true)}>
          How to Play
        </button>
      </div>

      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">How to Play</h2>
            <ul className="modal-list">
              <li><span className="modal-step">1</span>Choose a subject you love</li>
              <li><span className="modal-step">2</span>Pick a book and world to explore</li>
              <li><span className="modal-step">3</span>Answer 5 fun questions</li>
              <li><span className="modal-step">4</span>Tap the correct answer</li>
              <li><span className="modal-step">5</span>Collect stars and master all subjects!</li>
            </ul>
            <button className="modal-close" onClick={() => setShowHelp(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
