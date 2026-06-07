import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar, MobileNav } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { RecommendationLoading } from './pages/RecommendationLoading';
import { RecommendationReveal } from './pages/RecommendationReveal';
import { MovieDetails } from './pages/MovieDetails';
import { Watchlist } from './pages/Watchlist';
import { Profile } from './pages/Profile';
import { About, Contact, Privacy, Terms } from './pages/StaticPages';
import { NotFound } from './pages/NotFound';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { HistoryProvider } from './context/HistoryContext';
import { LoginModal } from './components/auth/LoginModal';

// Pages that don't use the standard layout
const FULL_SCREEN_ROUTES = ['/discover/loading', '/discover/result'];

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <>
      {!isFullScreen && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/discover/loading" element={<RecommendationLoading />} />
          <Route path="/discover/result" element={<RecommendationReveal />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      {!isFullScreen && <Footer />}
      {!isFullScreen && <MobileNav />}
      <LoginModal />
    </>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WatchlistProvider>
          <HistoryProvider>
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </HistoryProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

