import { gameStore, WORLDS } from '../game/gameStore';
import { useState } from 'react';

export default function WorldSelectScreen() {
  const state = gameStore.getState();
  const [showReset, setShowReset] = useState(false);

  const completedCount = state.progress.completedWorlds.length;

  const handleWorldClick = (worldId: number) => {
    if (state.progress.unlockedWorlds.includes(worldId)) {
      gameStore.startWorld(worldId);
    }
  };

  return (
    <div className="worlds-screen">
      {/* Header */}
      <div className="worlds-header">
        <button className="btn-back" onClick={() => gameStore.goToMenu()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="worlds-title">Worlds</h2>
        <span className="worlds-progress">{completedCount}/10</span>
      </div>

      {/* World Grid */}
      <div className="worlds-grid">
        {WORLDS.map(world => {
          const isUnlocked = state.progress.unlockedWorlds.includes(world.id);
          const isCompleted = state.progress.completedWorlds.includes(world.id);
          const stars = state.progress.worldStars[world.id] || 0;

          return (
            <div
              key={world.id}
              className={`world-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
              onClick={() => handleWorldClick(world.id)}
              style={isUnlocked ? { borderColor: world.color + '40' } : {}}
            >
              <img
                src={world.icon}
                alt={world.name}
                className="world-icon"
                style={isUnlocked ? { boxShadow: `0 4px 16px ${world.color}40` } : {}}
              />
              <div className="world-info">
                <div className="world-name">{world.name}</div>
                <div className="world-topic">{world.topic}</div>
                {isUnlocked && (
                  <div className="world-stars">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`star-small ${s <= stars ? 'earned' : ''}`}>
                        {s <= stars ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {!isUnlocked && <span className="world-lock">🔒</span>}
            </div>
          );
        })}
      </div>

      {/* Reset button */}
      <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
        <button
          onClick={() => setShowReset(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          Reset Progress
        </button>
      </div>

      {/* Reset Confirm Modal */}
      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title" style={{ color: '#F44336' }}>Reset Progress?</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              This will erase all your stars and locked worlds. Are you sure?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="modal-close"
                style={{ background: '#666' }}
                onClick={() => setShowReset(false)}
              >
                Cancel
              </button>
              <button
                className="modal-close"
                onClick={() => {
                  gameStore.resetProgress();
                  setShowReset(false);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
