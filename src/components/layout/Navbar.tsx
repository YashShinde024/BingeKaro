import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Home, Compass, BookmarkPlus, User, LogIn, LogOut, Bookmark } from 'lucide-react';
import { SearchOverlay } from '../search/SearchOverlay';
import { useAuth } from '../../context/AuthContext';

const NAV_CENTER = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/watchlist', label: 'Watchlist' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Dune: Part Two is now streaming on Prime Video!', type: 'release', time: '2h ago', movieId: 1 },
  { id: 2, text: 'Groq AI generated a hidden gem list for you', type: 'recommendation', time: '5h ago' },
  { id: 3, text: 'JioHotstar dropped 12th Fail (FREE to watch)', type: 'free', time: '1d ago', movieId: 6 },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { user, openLoginModal, logout } = useAuth();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K for search
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  // Close dropdowns on route changes
  React.useEffect(() => {
    setNotifOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-gradient-to-b from-[rgba(8,8,8,0.9)] to-transparent backdrop-blur-none'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between relative">
          {/* LEFT — Logo + Nyxen */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5"
            >
              {/* Logo mark */}
              <div className="relative w-8 h-8 rounded-[10px] bg-accent flex items-center justify-center glow-accent-sm">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M15 10L19.553 7.724A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold text-white tracking-[-0.01em]">
                  Kya<span className="text-accent-light">Dekhu</span>
                </span>
                <span className="text-[9px] text-muted/50 font-medium tracking-wide mt-0.5 hidden sm:block">
                  by Nyxen
                </span>
              </div>
            </motion.div>
          </Link>

          {/* CENTER — Nav links (desktop only) */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_CENTER.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <Link key={to} to={to} className="relative group px-4 py-2 rounded-xl">
                  <span className={`relative z-10 text-[13.5px] font-medium transition-colors duration-200 ${
                    active ? 'text-white' : 'text-muted group-hover:text-white/90'
                  }`}>
                    {label}
                  </span>
                  {/* Hover background */}
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-white/[0.06] opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.15 }}
                    style={{ opacity: active ? 0 : undefined }}
                  />
                  {/* Active background */}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/[0.08]"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  {/* Active underline */}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-accent rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-1.5 relative">
            {/* Search button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-9 px-3 rounded-xl text-muted hover:text-white hover:bg-white/[0.07] transition-all duration-150"
              aria-label="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:flex items-center gap-1.5 text-xs">
                Search
                <kbd className="text-[10px] px-1 py-0.5 rounded bg-white/10 text-muted/70 font-mono">⌘K</kbd>
              </span>
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className={`relative w-9 h-9 rounded-xl transition-all duration-150 flex items-center justify-center ${
                  notifOpen ? 'bg-white/10 text-white' : 'text-muted hover:text-white hover:bg-white/[0.07]'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {/* Notification dot */}
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent rounded-full" />
              </motion.button>

              {/* Notification Popover */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute right-0 mt-2.5 w-80 rounded-2xl glass-card border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.65)] overflow-hidden z-50 p-4"
                    style={{ background: 'rgba(12,12,12,0.92)' }}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.07] mb-2">
                      <h4 className="text-[12.5px] font-bold text-white uppercase tracking-wider">Recent Alerts</h4>
                      <span className="text-[10px] bg-accent/20 text-accent-light px-1.5 py-0.5 rounded font-bold">New</span>
                    </div>
                    <div className="space-y-1">
                      {MOCK_NOTIFICATIONS.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group flex flex-col gap-1"
                        >
                          <p className="text-[12px] text-white/80 group-hover:text-white leading-snug">
                            {notif.text}
                          </p>
                          <span className="text-[9px] text-muted">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar or Sign In Dropdown */}
            {user ? (
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotifOpen(false);
                  }}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-accent via-accent to-accent-light ring-1 flex items-center justify-center cursor-pointer ml-1 transition-shadow ${
                    profileOpen ? 'ring-white/40 shadow-glow-accent' : 'ring-white/10 hover:ring-white/20'
                  }`}
                >
                  <span className="text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </motion.div>

                {/* Profile User Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute right-0 mt-2.5 w-56 rounded-2xl glass-card border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.65)] overflow-hidden z-50 p-2"
                      style={{ background: 'rgba(12,12,12,0.92)' }}
                    >
                      <div className="px-3.5 py-3 border-b border-white/[0.07] mb-1">
                        <p className="text-[13px] font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-muted truncate mt-0.5">{user.email}</p>
                      </div>

                      {[
                        { label: 'My Profile', to: '/profile', icon: User },
                        { label: 'Watchlist', to: '/watchlist', icon: Bookmark },
                      ].map((item) => (
                        <Link key={item.to} to={item.to}>
                          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] text-muted hover:text-white hover:bg-white/[0.05] transition-all text-left">
                            <item.icon className="w-3.5 h-3.5" />
                            {item.label}
                          </button>
                        </Link>
                      ))}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left mt-1 border-t border-white/[0.05] pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={openLoginModal}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-accent text-[12px] font-semibold text-white ml-2 glow-accent-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

/* ─────────────────────────────────────────
   MOBILE BOTTOM NAV
   ───────────────────────────────────────── */
const MOBILE_TABS = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/discover', label: 'Discover', Icon: Compass },
  { to: '/watchlist', label: 'Saved', Icon: BookmarkPlus },
  { to: '/profile', label: 'Profile', Icon: User },
];

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = React.useState(false);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed bottom-0 inset-x-0 z-50 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Blur background */}
        <div className="glass border-t border-white/[0.07] shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center h-16 px-2">
            {MOBILE_TABS.map(({ to, label, Icon }) => {
              const active = isActive(to);
              return (
                <Link key={to} to={to} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className="flex flex-col items-center gap-1 py-2"
                  >
                    <div className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                      active ? 'bg-accent/20' : 'bg-transparent'
                    }`}>
                      <Icon className={`w-5 h-5 transition-colors duration-200 ${
                        active ? 'text-accent-light' : 'text-muted'
                      }`} />
                      {active && (
                        <motion.div
                          layoutId="mobile-indicator"
                          className="absolute inset-0 rounded-full bg-accent/15 ring-1 ring-accent/30"
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        />
                      )}
                    </div>
                    <span className={`text-[10px] font-medium transition-colors duration-200 ${
                      active ? 'text-accent-light' : 'text-muted/60'
                    }`}>
                      {label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Search tab */}
            <button className="flex-1" onClick={() => setSearchOpen(true)}>
              <div className="flex flex-col items-center gap-1 py-2">
                <div className="flex items-center justify-center w-10 h-7 rounded-full">
                  <Search className="w-5 h-5 text-muted" />
                </div>
                <span className="text-[10px] font-medium text-muted/60">Search</span>
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
