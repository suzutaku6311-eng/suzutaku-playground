import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { Analytics } from '@vercel/analytics/react';
import './styles/global.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flexGrow: 1, padding: '20px 0' }}>
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Analytics />
      </Router>
    </LanguageProvider>
  );
}

export default App;
