import { useEffect, useState } from 'react';
import { gameStore, type GameScreen } from './game/gameStore';
import MenuScreen from './screens/MenuScreen';
import NameInputScreen from './screens/NameInputScreen';
import GradeSelectScreen from './screens/GradeSelectScreen';
import SyllabusSelectScreen from './screens/SyllabusSelectScreen';
import SubjectSelectScreen from './screens/SubjectSelectScreen';
import BookSelectScreen from './screens/BookSelectScreen';
import WorldSelectScreen from './screens/WorldSelectScreen';
import QuestionScreen from './screens/QuestionScreen';
import WorldCompleteScreen from './screens/WorldCompleteScreen';
import AllCompleteScreen from './screens/AllCompleteScreen';
import './game.css';

function App() {
  const [screen, setScreen] = useState<GameScreen>(gameStore.screen);
  const [transition, setTransition] = useState<'in' | 'out'>('in');

  useEffect(() => {
    return gameStore.subscribe(() => {
      setTransition('out');
      setTimeout(() => {
        setScreen(gameStore.screen);
        setTransition('in');
      }, 200);
    });
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'menu': return <MenuScreen />;
      case 'nameInput': return <NameInputScreen />;
      case 'grade': return <GradeSelectScreen />;
      case 'syllabus': return <SyllabusSelectScreen />;
      case 'subjects': return <SubjectSelectScreen />;
      case 'books': return <BookSelectScreen />;
      case 'worlds': return <WorldSelectScreen />;
      case 'question': return <QuestionScreen />;
      case 'worldComplete': return <WorldCompleteScreen />;
      case 'allComplete': return <AllCompleteScreen />;
      default: return <MenuScreen />;
    }
  };

  return (
    <div className="game-container">
      <div className={`screen-wrapper ${transition === 'in' ? 'screen-in' : 'screen-out'}`}>
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
