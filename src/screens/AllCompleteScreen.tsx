import { useState, useEffect } from 'react';
import { gameStore } from '../game/gameStore';

export default function AllCompleteScreen() {
  const [showContent, setShowContent] = useState(false);
  const state = gameStore.getState();
  useEffect(() => { const t = setTimeout(() => setShowContent(true), 300); return () => clearTimeout(t); }, []);

  const playerName = state.progress.playerName || 'Explorer';
  const allProgress = state.progress.subjectProgress;
  let totalStars = 0, maxStars = 0;
  Object.entries(allProgress).forEach(([_, books]) => {
    Object.entries(books).forEach(([_, worlds]) => {
      Object.values(worlds as Record<number, number>).forEach(s => { totalStars += s; });
    });
  });

  return (
    <div className="all-complete-screen">
      {showContent && <>
        <img src="/assets/mascot.png" alt="Mascot" className="all-complete-mascot" />
        <h2 className="all-complete-title">{playerName}, you are a Scholar!</h2>
        <p className="all-complete-text">{playerName}, you have explored all the worlds! You collected {totalStars} stars across all subjects!</p>
        <div className="complete-stars" style={{ marginBottom: '24px' }}>
          {[1, 2, 3, 4, 5].map(s => <span key={s} className="complete-star earned" style={{ animationDelay: `${s * 0.15}s` }}>★</span>)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
          <button className="btn-play" style={{ marginBottom: 0 }} onClick={() => gameStore.goToSubjects()}>Explore More Subjects</button>
          <button className="btn-secondary" onClick={() => gameStore.goToMenu()}>Main Menu</button>
        </div>
      </>}
    </div>
  );
}
