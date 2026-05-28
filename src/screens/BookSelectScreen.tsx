import { gameStore } from '../game/gameStore';

export default function BookSelectScreen() {
  const state = gameStore.getState();
  const subject = state.currentSubject!;

  return (
    <div className="book-screen">
      <button className="btn-back" onClick={() => gameStore.goToSubjects()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div className="book-content">
        {/* Header */}
        <div className="book-header">
          <h2 className="book-title">{subject.name}</h2>
        </div>

        <p className="book-subtitle">Choose a book:</p>

        {/* Book List */}
        <div className="book-list">
          {subject.books.map(book => {
            const isDisabled = book.disabled;
            const stars = getBookStars(subject.id, book.id);
            const totalWorlds = book.worlds.length;

            return (
              <div
                key={book.id}
                className={`book-card ${isDisabled ? 'disabled' : ''}`}
                onClick={() => { if (!isDisabled) gameStore.selectBook(book.id); }}
                style={isDisabled ? {} : { borderColor: subject.color + '40', background: subject.color + '08' }}
              >
                <div className="book-icon" style={{ background: isDisabled ? '#eee' : subject.color + '15' }}>
                  <img src={subject.icon} alt={subject.name} className="book-icon-img" />
                </div>
                <div className="book-info">
                  <div className="book-name">{book.name}</div>
                  {!isDisabled && totalWorlds > 0 && (
                    <div className="book-worlds">{totalWorlds} worlds to explore</div>
                  )}
                  {isDisabled && (
                    <div className="book-coming-soon">Coming Soon</div>
                  )}
                  {!isDisabled && stars > 0 && (
                    <div className="book-stars">
                      {'★'.repeat(Math.min(Math.floor(stars / totalWorlds) || 0, 5))}
                      {'☆'.repeat(5 - Math.min(Math.floor(stars / totalWorlds) || 0, 5))}
                    </div>
                  )}
                </div>
                {isDisabled && <span className="book-lock">🔒</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getBookStars(subjectId: string, bookId: number): number {
  const p = gameStore.getState().progress.subjectProgress[subjectId]?.[bookId];
  if (!p) return 0;
  return Object.values(p).reduce((a: number, b: number) => a + b, 0);
}
