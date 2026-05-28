import { useState } from 'react';
import { gameStore, SYLLABI } from '../game/gameStore';
import type { SyllabusData } from '../game/gameStore';

const SYLLABUS_COLORS: Record<string, string> = {
  cbse: '#4A90D9',
  icse: '#5CB85C',
  state: '#FF8C42',
  ib: '#9B59B6',
};

const SYLLABUS_ICONS: Record<string, string> = {
  cbse: '📖',
  icse: '📚',
  state: '🏛️',
  ib: '🌍',
};

export default function SyllabusSelectScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedGrade = gameStore.selectedGrade;

  const handleSelect = (syllabus: SyllabusData) => {
    if (!syllabus.enabled) return;
    setSelectedId(syllabus.id);
    setTimeout(() => gameStore.selectSyllabus(syllabus.id), 300);
  };

  return (
    <div className="syllabus-screen">
      <button className="btn-back" onClick={() => gameStore.goToGrade()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>

      <div className="syllabus-content">
        <div className="screen-header">
          <div style={{ fontSize: 42 }}>🎓</div>
          <h1 className="screen-title">Select Syllabus</h1>
          <p className="screen-subtitle">
            <span style={{ background: '#4A90D915', color: '#4A90D9', padding: '3px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
              {selectedGrade?.label || '5th Standard'}
            </span>
          </p>
        </div>

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
              style={{ borderColor: isEnabled ? color : undefined }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isEnabled ? `${color}15` : '#eee',
                border: `2px solid ${isEnabled ? `${color}30` : '#ddd'}`,
                fontSize: 28, flexShrink: 0,
              }}>
                {SYLLABUS_ICONS[syllabus.id]}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: isEnabled ? '#333' : '#999' }}>
                    {syllabus.name}
                  </span>
                  {!isEnabled && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#999', background: '#eee', padding: '2px 8px', borderRadius: 10 }}>
                      COMING SOON
                    </span>
                  )}
                  {isEnabled && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: color, background: `${color}10`, padding: '2px 8px', borderRadius: 10 }}>
                      AVAILABLE
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: isEnabled ? '#888' : '#bbb', lineHeight: 1.3 }}>
                  {syllabus.label}
                </span>
              </div>

              {isEnabled && (
                <span style={{ fontSize: 20, color: `${color}60`, flexShrink: 0, fontWeight: 300 }}>›</span>
              )}
            </button>
          );
        })}

        <p style={{ textAlign: 'center', color: '#999', fontSize: 13, marginTop: 10 }}>
          More syllabi coming soon! Currently only CBSE is available.
        </p>
      </div>
    </div>
  );
}
