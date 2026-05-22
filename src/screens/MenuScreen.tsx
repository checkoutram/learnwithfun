import { useState, useMemo } from 'react';
import { gameStore } from '../game/gameStore';

const FLOAT_SYMBOLS = ['+', '-', 'x', '/', '=', '%', '1', '2', '3', '7', '9', '0'];

export default function MenuScreen() {
  const [showHelp, setShowHelp] = useState(false);

  const floatingSymbols = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      symbol: FLOAT_SYMBOLS[i % FLOAT_SYMBOLS.length],
      left: Math.random() * 90 + 5,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 18 + Math.random() * 20,
    }));
  }, []);

  return (
    <div className="menu-screen">
      <div className="menu-bg" />
      
      {/* Floating math symbols */}
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
        {/* Mascot */}
        <div className="mascot-container">
          <img src="/assets/mascot.png" alt="Math Wizard" className="mascot-img" />
          <div className="mascot-glow" />
        </div>

        {/* Title */}
        <h1 className="game-title">MATH QUEST</h1>
        <p className="game-subtitle">Grade 5 Adventure</p>

        {/* Play Button */}
        <button className="btn-play" onClick={() => gameStore.goToWorlds()}>
          PLAY
        </button>

        {/* How to Play */}
        <button className="btn-secondary" onClick={() => setShowHelp(true)}>
          How to Play
        </button>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">How to Play</h2>
            <ul className="modal-list">
              <li><span className="modal-step">1</span>Choose a math world to explore</li>
              <li><span className="modal-step">2</span>Answer 5 math questions</li>
              <li><span className="modal-step">3</span>Tap the correct answer</li>
              <li><span className="modal-step">4</span>Wrong answers? Try again!</li>
              <li><span className="modal-step">5</span>Collect stars and unlock worlds</li>
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
