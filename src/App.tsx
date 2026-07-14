import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { GamesPage } from './pages/GamesPage';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { KonbiniGame } from './games/konbini1000/KonbiniGame';
import { UniverseGame } from './games/universeScale/UniverseGame';
import { InfiniteButton } from './games/infiniteButton/InfiniteButton';
import { GravitySim } from './games/gravitySim/GravitySim';
import { ColorMixer } from './games/colorMixer/ColorMixer';
import { ParticlePlayground } from './games/particlePlayground/ParticlePlayground';
import { TokyoDistanceGame } from './games/tokyoDistance/TokyoDistanceGame';
import { BritishSarcasmGame } from './games/britishSarcasm/BritishSarcasmGame';
import { DorayakiBaibainGame } from './games/dorayakiBaibain/DorayakiBaibainGame';
import { KitetsuBladeLuckGame } from './games/kitetsuBladeLuck/KitetsuBladeLuckGame';
import { FlagQuizGame } from './games/flagQuiz/FlagQuizGame';
import { ElementQuizGame } from './games/elementQuiz/ElementQuizGame';
import { DartsTripGame } from './games/dartsTrip/DartsTripGame';
import { SushiTypingGame } from './games/sushiTyping/SushiTypingGame';
import { InfiniteJumperGame } from './games/infiniteJumper/InfiniteJumperGame';
import { PlantWidget } from './components/PlantWidget';
import { Analytics } from '@vercel/analytics/react';
import './styles/global.css';

const AppContent: React.FC = () => {
  const location = useLocation();

  const isGameScreen = () => {
    const path = location.pathname;
    if (!path.startsWith('/games/')) return false;
    const nonGamePaths = ['all', 'quick', 'simulation', 'education', 'arcade'];
    const sub = path.replace('/games/', '').split('/')[0];
    if (!sub || nonGamePaths.includes(sub)) return false;
    return true;
  };

  const gameMode = isGameScreen();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {gameMode ? (
        <div className="neal-game-topbar">
          <Link to="/games" className="neal-game-logo-pill" title="Return to Suzutaku Playground">
            Suzutaku Playground
            <span className="logo-dot"></span>
          </Link>
        </div>
      ) : (
        <Header />
      )}

      <main style={{ flexGrow: 1, padding: gameMode ? '0' : '0 0 20px 0', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/games" replace />} />
          <Route path="/games/:category?" element={<GamesPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/games/konbini-1000" element={<KonbiniGame />} />
          <Route path="/games/universe-scale" element={<UniverseGame />} />
          <Route path="/games/infinite-button" element={<InfiniteButton />} />
          <Route path="/games/gravity-sim" element={<GravitySim />} />
          <Route path="/games/color-mixer" element={<ColorMixer />} />
          <Route path="/games/particle-playground" element={<ParticlePlayground />} />
          <Route path="/games/tokyo-distance" element={<TokyoDistanceGame />} />
          <Route path="/games/british-sarcasm" element={<BritishSarcasmGame />} />
          <Route path="/games/dorayaki-baibain" element={<DorayakiBaibainGame />} />
          <Route path="/games/kitetsu-blade-luck" element={<KitetsuBladeLuckGame />} />
          <Route path="/games/flag-quiz" element={<FlagQuizGame />} />
          <Route path="/games/element-quiz" element={<ElementQuizGame />} />
          <Route path="/games/darts-trip" element={<DartsTripGame />} />
          <Route path="/games/sushi-typing" element={<SushiTypingGame />} />
          <Route path="/games/infinite-runner" element={<InfiniteJumperGame />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!gameMode && <Footer />}
      <PlantWidget />
      <Analytics />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
