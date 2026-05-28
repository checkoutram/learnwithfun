import { gameStore, SUBJECTS } from '../game/gameStore';

export default function SubjectSelectScreen() {
  const state = gameStore.getState();
  const playerName = state.progress.playerName || 'Explorer';
  const gradeLabel = state.selectedGrade?.label || '5th Standard';
  const syllabusName = state.selectedSyllabus?.name || 'CBSE';

  return (
    <div className="subject-screen">
      <div className="subject-content">
        {/* Header */}
        <div className="subject-header">
          <button className="btn-back" onClick={() => gameStore.goToSyllabus()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="subject-title">Subjects</h2>
        </div>

        {/* Grade & Syllabus Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '3px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
            {syllabusName}
          </span>
          <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '3px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
            {gradeLabel}
          </span>
        </div>

        <p className="subject-greeting">Hi {playerName}! Pick a subject:</p>

        {/* Subject Grid */}
        <div className="subject-grid">
          {SUBJECTS.map(subject => {
            const stars = getSubjectStars(subject.id);
            const totalWorlds = subject.books.reduce((acc, b) => acc + (b.disabled ? 0 : b.worlds.length), 0);

            return (
              <div
                key={subject.id}
                className="subject-card"
                onClick={() => gameStore.selectSubject(subject.id)}
                style={{ borderColor: subject.color + '60', background: subject.color + '15' }}
              >
                <div className="subject-icon-wrapper">
                  <img src={subject.icon} alt={subject.name} className="subject-icon-img" />
                </div>
                <div className="subject-info">
                  <div className="subject-name">{subject.name}</div>
                  <div className="subject-books">
                    {subject.books.filter(b => !b.disabled).length} {subject.books.filter(b => !b.disabled).length === 1 ? 'book' : 'books'}
                  </div>
                  {stars > 0 && (
                    <div className="subject-stars">
                      {Array.from({ length: Math.min(Math.floor(stars), 5) }, (_, i) => <span key={`f${i}`} className="star-small earned">★</span>)}
                      {(stars - Math.floor(stars) >= 0.5) && <span key="h" className="star-small earned"><span className="half-star-wrap"><span className="half-star-gold">★</span><span className="half-star-gray">★</span></span></span>}
                      {Array.from({ length: Math.max(0, 5 - Math.ceil(stars)) }, (_, i) => <span key={`e${i}`} className="star-small">☆</span>)}
                      <span className="subject-star-count"> {stars}/{totalWorlds * 10}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getSubjectStars(subjectId: string): number {
  const p = gameStore.getState().progress.subjectProgress[subjectId];
  if (!p) return 0;
  let total = 0;
  Object.values(p).forEach(book => {
    Object.values(book).forEach(stars => total += stars as number);
  });
  return total;
}
