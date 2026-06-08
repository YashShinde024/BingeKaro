import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.some(r => location.pathname.startsWith(r));

  return (
    <>
      {!isFullScreen && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/discover" element={<PageTransition><Discover /></PageTransition>} />
          <Route path="/discover/loading" element={<RecommendationLoading />} />
          <Route path="/discover/result" element={<RecommendationReveal />} />
          <Route path="/movie/:id" element={<PageTransition><MovieDetails /></PageTransition>} />
          <Route path="/watchlist" element={<PageTransition><Watchlist /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
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

