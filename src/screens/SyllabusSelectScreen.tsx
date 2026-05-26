import { useEffect, useState } from 'react';
import { gameStore, SYLLABI } from '../game/gameStore';
import type { SyllabusData } from '../game/gameStore';

const SYLLABUS_COLORS: Record<string, string> = {
  cbse: '#FF6B35',
  icse: '#4CAF50',
  state: '#2196F3',
  ib: '#9C27B0',
};

const SYLLABUS_ICONS: Record<string, string> = {
  cbse: '📖',
  icse: '📚',
  state: '🏛️',
  ib: '🌍',
};

export default function SyllabusSelectScreen() {
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedGrade = gameStore.selectedGrade;

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (syllabus: SyllabusData) => {
    if (!syllabus.enabled) return;
    setSelectedId(syllabus.id);
    setTimeout(() => gameStore.selectSyllabus(syllabus.id), 300);
  };

  return (
    <div className={`screen ${fadeIn ? 'fade-in' : ''}`}>
      <button className="btn-back" onClick={() => gameStore.goToGrade()} style={{ position: 'absolute', top: 20, left: 20, zIndex: 20 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>

      <div className="screen-header">
        <div className="floating-icon" style={{ fontSize: 42 }}>🎓</div>
        <h1 className="screen-title" style={{ fontSize: '1.8rem' }}>Select Syllabus</h1>
        <p className="screen-subtitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ background: '#FF6B3520', color: '#FF6B35', padding: '2px 10px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
            {selectedGrade?.label || '5th Standard'}
          </span>
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '0 20px',
        maxWidth: 480,
        margin: '0 auto',
        marginTop: 24,
      }}>
        {SYLLABI.map((syllabus) => {
          const isEnabled = syllabus.enabled;
          const isSelected = selectedId === syllabus.id;
          const color = SYLLABUS_COLORS[syllabus.id];
          return (
            <button
              key={syllabus.id}
              onClick={() => handleSelect(syllabus)}
              disabled={!isEnabled}
              className={`syllabus-card ${isEnabled ? 'syllabus-enabled' : 'syllabus-disabled'} ${isSelected ? 'syllabus-selected' : ''}`}
              style={{
                borderRadius: 18,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: isEnabled ? 'pointer' : 'not-allowed',
                border: isSelected ? `3px solid ${color}` : isEnabled ? `2px solid ${color}40` : '2px solid #333',
                background: isEnabled
                  ? isSelected
                    ? `${color}20`
                    : `linear-gradient(145deg, ${color}12, ${color}05)`
                  : '#1a1a2e',
                opacity: isEnabled ? 1 : 0.5,
                transition: 'all 0.25s ease',
                textAlign: 'left',
                position: 'relative',
              }}
            >
              {/* Syllabus Icon */}
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isEnabled ? `${color}20` : '#222',
                border: isEnabled ? `2px solid ${color}40` : '2px solid #333',
                fontSize: 28,
                flexShrink: 0,
              }}>
                {SYLLABUS_ICONS[syllabus.id]}
              </div>

              {/* Syllabus Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: isEnabled ? '#fff' : '#555',
                  }}>
                    {syllabus.name}
                  </span>
                  {!isEnabled && (
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#666',
                      background: '#222',
                      padding: '2px 8px',
                      borderRadius: 10,
                      letterSpacing: 0.5,
                    }}>
                      COMING SOON
                    </span>
                  )}
                  {isEnabled && (
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: color,
                      background: `${color}15`,
                      padding: '2px 8px',
                      borderRadius: 10,
                      letterSpacing: 0.5,
                    }}>
                      AVAILABLE
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 12,
                  color: isEnabled ? '#aaa' : '#444',
                  lineHeight: 1.3,
                }}>
                  {syllabus.label}
                </span>
              </div>

              {/* Arrow for enabled */}
              {isEnabled && (
                <span style={{ fontSize: 20, color: `${color}80`, flexShrink: 0 }}>›</span>
              )}
            </button>
          );
        })}
      </div>

      <p style={{
        textAlign: 'center',
        color: '#888',
        fontSize: 12,
        marginTop: 24,
        fontStyle: 'italic',
      }}>
        More syllabi coming soon! Currently only CBSE is available.
      </p>
    </div>
  );
}
