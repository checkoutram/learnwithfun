import { useEffect, useState } from 'react';
import { gameStore, GRADES } from '../game/gameStore';
import type { GradeData } from '../game/gameStore';

const GRADE_COLORS: Record<number, string> = {
  1: '#4CAF50', 2: '#8BC34A', 3: '#CDDC39', 4: '#FFEB3B',
  5: '#FF9800', 6: '#FF5722', 7: '#F44336', 8: '#E91E63',
  9: '#9C27B0', 10: '#673AB7', 11: '#3F51B5', 12: '#2196F3',
};

const GRADE_ICONS: Record<number, string> = {
  1: '1', 2: '2', 3: '3', 4: '4',
  5: '5', 6: '6', 7: '7', 8: '8',
  9: '9', 10: '10', 11: '11', 12: '12',
};

export default function GradeSelectScreen() {
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (grade: GradeData) => {
    if (!grade.enabled) return;
    setSelectedId(grade.id);
    setTimeout(() => gameStore.selectGrade(grade.id), 300);
  };

  return (
    <div className={`screen ${fadeIn ? 'fade-in' : ''}`}>
      <button className="btn-back" onClick={() => gameStore.goToMenu()} style={{ position: 'absolute', top: 20, left: 20, zIndex: 20 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>

      <div className="screen-header">
        <div className="floating-icon" style={{ fontSize: 42 }}>📚</div>
        <h1 className="screen-title" style={{ fontSize: '1.8rem' }}>Select Your Grade</h1>
        <p className="screen-subtitle">Choose your standard to begin learning</p>
      </div>

      <div className="grade-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        padding: '0 20px',
        maxWidth: 500,
        margin: '0 auto',
        marginTop: 16,
      }}>
        {GRADES.map((grade) => {
          const isEnabled = grade.enabled;
          const isSelected = selectedId === grade.id;
          return (
            <button
              key={grade.id}
              onClick={() => handleSelect(grade)}
              disabled={!isEnabled}
              className={`grade-card ${isEnabled ? 'grade-enabled' : 'grade-disabled'} ${isSelected ? 'grade-selected' : ''}`}
              style={{
                borderRadius: 18,
                padding: '14px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: isEnabled ? 'pointer' : 'not-allowed',
                border: isSelected ? `3px solid ${GRADE_COLORS[grade.id]}` : isEnabled ? `2px solid ${GRADE_COLORS[grade.id]}40` : '2px solid #333',
                background: isEnabled
                  ? isSelected
                    ? `${GRADE_COLORS[grade.id]}30`
                    : `linear-gradient(145deg, ${GRADE_COLORS[grade.id]}18, ${GRADE_COLORS[grade.id]}08)`
                  : '#1a1a2e',
                opacity: isEnabled ? 1 : 0.5,
                transition: 'all 0.25s ease',
                minHeight: 88,
                position: 'relative',
              }}
            >
              {/* Grade Number Circle */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isEnabled ? `${GRADE_COLORS[grade.id]}25` : '#222',
                border: isEnabled ? `2px solid ${GRADE_COLORS[grade.id]}50` : '2px solid #333',
                fontSize: 18,
                fontWeight: 800,
                color: isEnabled ? GRADE_COLORS[grade.id] : '#555',
                flexShrink: 0,
              }}>
                {GRADE_ICONS[grade.id]}
              </div>

              {/* Grade Label */}
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: isEnabled ? '#fff' : '#555',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {grade.name} Std
              </span>

              {/* Status Badge */}
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
                  color: GRADE_COLORS[grade.id],
                  background: `${GRADE_COLORS[grade.id]}15`,
                  padding: '2px 8px',
                  borderRadius: 10,
                  letterSpacing: 0.5,
                }}>
                  AVAILABLE
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p style={{
        textAlign: 'center',
        color: '#888',
        fontSize: 12,
        marginTop: 20,
        fontStyle: 'italic',
      }}>
        More grades coming soon! Currently only 5th Standard is available.
      </p>
    </div>
  );
}
