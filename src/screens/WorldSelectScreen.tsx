import { useState } from 'react';
import { gameStore } from '../game/gameStore';

export default function WorldSelectScreen() {
  const state = gameStore.getState();
  const [showReset, setShowReset] = useState(false);

  const subject = state.currentSubject!;
  const book = state.currentBook!;
  const progress = state.progress;
  const bookProgress = progress.subjectProgress[subject.id]?.[book.id] || {};

  const handleWorldClick = (worldId: number) => {
    gameStore.startWorld(worldId);
  };

  // Helper to render stars (supports half stars)
  const renderStars = (stars: number) => {
    const fullStars = Math.floor(stars);
    const hasHalf = stars - fullStars >= 0.5;
    const emptyStars = 10 - fullStars - (hasHalf ? 1 : 0);
    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => <span key={`f${i}`} className="star-small earned">★</span>)}
        {hasHalf && <span key="h" className="star-small earned"><span className="half-star-wrap"><span className="half-star-gold">★</span><span className="half-star-gray">★</span></span></span>}
        {Array.from({ length: emptyStars }, (_, i) => <span key={`e${i}`} className="star-small">☆</span>)}
      </>
    );
  };

  return (
    <div className="worlds-screen">
      <div className="worlds-header">
        <button className="btn-back" onClick={() => {
          const activeBooks = subject.books.filter(b => !b.disabled);
          if (activeBooks.length > 1) gameStore.goToBooks();
          else gameStore.goToSubjects();
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <h2 className="worlds-title">{book.name}</h2>
          <div style={{ fontSize: '11px', color: '#888' }}>{subject.name}</div>
        </div>
      </div>

      <div className="worlds-grid">
        {book.worlds.map(world => {
          const stars = bookProgress[world.id] || 0;

          return (
            <div
              key={world.id}
              className="world-card unlocked"
              onClick={() => handleWorldClick(world.id)}
              style={{ borderColor: world.color + '40' }}
            >
              <div className="world-icon-wrap" style={{ background: world.color + '18', border: `1.5px solid ${world.color}40` }}>
                <img src={world.icon} alt={world.name} className="world-icon-img" />
              </div>
              <div className="world-info">
                <div className="world-name">{world.name}</div>
                <div className="world-topic">{world.topic}</div>
                <div className="world-stars">
                  {renderStars(stars)}
                  <span style={{ fontSize: '11px', color: stars > 0 ? '#FF8C42' : '#ccc', marginLeft: '4px', fontWeight: 700 }}>
                    {stars > 0 ? `${stars}/5` : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
        <button onClick={() => setShowReset(true)} style={{ background: 'none', border: 'none', color: '#bbb', fontSize: '12px', cursor: 'pointer', padding: '8px' }}>
          Reset All Progress
        </button>
      </div>

      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title" style={{ color: '#F44336' }}>Reset Progress?</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>This will erase all stars across ALL subjects. Are you sure?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="modal-close" style={{ background: '#666' }} onClick={() => setShowReset(false)}>Cancel</button>
              <button className="modal-close" onClick={() => { gameStore.resetProgress(); setShowReset(false); }}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
