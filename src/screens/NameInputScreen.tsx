import { useState, useRef, useEffect } from 'react';
import { gameStore } from '../game/gameStore';

const FUN_TITLES = [
  'Super Star',
  'Brainy Hero',
  'Quiz Champion',
  'Smart Explorer',
  'Knowledge Ninja',
  'Learning Legend',
  'Subject Master',
  'Fun Seeker',
];

export default function NameInputScreen() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [titleWord] = useState(() =>
    FUN_TITLES[Math.floor(Math.random() * FUN_TITLES.length)]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) { setError('Please tell us your name!'); return; }
    if (trimmed.length < 2) { setError('Name must be at least 2 letters!'); return; }
    if (trimmed.length > 20) { setError('Name is too long! Max 20 letters.'); return; }
    if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) { setError('Use only letters, spaces, and hyphens!'); return; }

    setError('');
    gameStore.setPlayerName(trimmed);
    gameStore.goToGrade();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="name-screen">
      <div className="name-overlay" />

      <div className="name-content">
        <button className="btn-back" onClick={() => gameStore.goToMenu()} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 20 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>

        <img src="/assets/mascot.png" alt="Fun Mascot" className="name-mascot" />

        <h2 className="name-title">Hey, {titleWord}!</h2>
        <p className="name-subtitle">What should we call you?</p>

        <div className="name-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className={`name-input ${error ? 'name-input-error' : ''}`}
            placeholder="Type your name..."
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            maxLength={20}
            autoComplete="given-name"
            data-testid="name-input"
          />
          {error && <div className="name-error" data-testid="name-error">{error}</div>}
        </div>

        <button className="btn-play" onClick={handleSubmit} data-testid="name-submit">
          Let's Go!
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            gameStore.setPlayerName('Explorer');
            gameStore.goToGrade();
          }}
          data-testid="name-skip"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
