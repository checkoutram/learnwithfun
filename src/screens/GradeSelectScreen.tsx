import { useEffect, useState } from 'react';
import { gameStore, GRADES } from '../game/gameStore';
import type { GradeData } from '../game/gameStore';

const GRADE_COLORS: Record<number, string> = {
  1: '#4A90D9', 2: '#5CB85C', 3: '#E74C3C', 4: '#FF8C42',
  5: '#FF6B35', 6: '#9B59B6', 7: '#E91E63', 8: '#00CED1',
  9: '#4A90D9', 10: '#5CB85C', 11: '#E74C3C', 12: '#FF8C42',
};

export default function GradeSelectScreen() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (grade: GradeData) => {
    if (!grade.enabled) return;
    setSelectedId(grade.id);
    setTimeout(() => gameStore.selectGrade(grade.id), 300);
  };

  return (
    <div className="grade-screen">
      <button className="btn-back" onClick={() => gameStore.goToMenu()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>

      <div className="grade-content">
        <div className="screen-header">
          <div style={{ fontSize: 42 }}>📚</div>
          <h1 className="screen-title">Select Your Grade</h1>
          <p className="screen-subtitle">Choose your standard to begin learning</p>
        </div>

        <div className="grade-grid">
          {GRADES.map((grade) => {
            const isEnabled = grade.enabled;
            const isSelected = selectedId === grade.id;
            const color = GRADE_COLORS[grade.id];
            return (
              <button
                key={grade.id}
                onClick={() => handleSelect(grade)}
                disabled={!isEnabled}
                className={`grade-card ${isEnabled ? 'grade-enabled' : 'grade-disabled'} ${isSelected ? 'grade-selected' : ''}`}
                style={{ borderColor: isEnabled ? color : undefined }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isEnabled ? `${color}15` : '#eee',
                  border: `2px solid ${isEnabled ? `${color}40` : '#ddd'}`,
                  fontSize: 18, fontWeight: 800,
                  color: isEnabled ? color : '#999',
                  flexShrink: 0,
                }}>
                  {grade.id}
                </div>

                <span style={{ fontSize: 12, fontWeight: 700, color: isEnabled ? '#333' : '#999' }}>
                  {grade.name} Std
                </span>

                {!isEnabled && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: '#999',
                    background: '#eee', padding: '2px 8px', borderRadius: 10,
                  }}>COMING SOON</span>
                )}
                {isEnabled && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: color,
                    background: `${color}10`, padding: '2px 8px', borderRadius: 10,
                  }}>AVAILABLE</span>
                )}
              </button>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', color: '#999', fontSize: 13, marginTop: 20 }}>
          More grades coming soon! Currently only 5th Standard is available.
        </p>
      </div>
    </div>
  );
}
