"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Home, Compass, Bookmark, User, LogIn, LogOut, Settings } from 'lucide-react';
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
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [scrollDepth, setScrollDepth] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { user, openLoginModal, logout } = useAuth();

  const scrolled = scrollDepth > 10;

  React.useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDepth(currentScrollY);
      if (currentScrollY > 70) {
        if (currentScrollY > lastScrollY) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

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
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  React.useEffect(() => {
    setNotifOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50 left-0 right-0 top-0 w-full px-4 sm:px-6 lg:px-10 transition-all duration-300"
      >
        <div 
          className="w-full mx-auto max-w-[1400px] rounded-2xl transition-all duration-300 px-6 h-16 mt-4 flex items-center justify-between border relative"
          style={{
            backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'rgba(5, 5, 5, 0.35)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderColor: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            boxShadow: scrolled ? '0 16px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.02)' : 'none',
          }}
        >
          {/* LEFT — Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2.5"
            >
              <div className="relative w-8 h-8 rounded-[10px] bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M15 10L19.553 7.724A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold text-white tracking-tight">
                  Binge<span className="text-accent-light">Karo</span>
                </span>
                <span className="text-[9px] text-muted/40 font-semibold tracking-widest mt-0.5 uppercase hidden sm:block">
                  by Nyxen
                </span>
              </div>
            </motion.div>
          </Link>

          {/* CENTER — Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
            {NAV_CENTER.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <Link key={to} href={to} className="relative px-4 py-2 rounded-xl transition-all duration-200">
                  <span className={`relative z-10 text-[13.5px] font-semibold tracking-wide transition-colors duration-300 ${
                    active ? 'text-white' : 'text-muted hover:text-white/95'
                  }`}>
                    {label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {active && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-light"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.1)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-between gap-2.5 h-9 w-36 lg:w-48 px-3 rounded-xl border border-white/[0.06] text-muted hover:text-white transition-all duration-200 bg-white/[0.015]"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium tracking-wider">SEARCH</span>
              </div>
              <kbd className="hidden lg:inline-block text-[8px] px-1.5 py-0.5 rounded bg-white/10 text-muted/60 font-mono border border-white/[0.05]">Ctrl+K</kbd>
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/[0.05] ${
                  notifOpen ? 'bg-white/10 text-white border-white/10' : 'bg-white/[0.02] text-muted hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-4"
                    style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(30px)' }}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-2">
                      <h4 className="text-[12px] font-bold text-white uppercase tracking-widest">Recent Alerts</h4>
                      <span className="text-[9px] bg-accent/20 text-accent-light px-2 py-0.5 rounded-full font-bold">New</span>
                    </div>
                    <div className="space-y-1.5">
                      {MOCK_NOTIFICATIONS.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-2.5 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.04] transition-all cursor-pointer group flex flex-col gap-1"
                        >
                          <p className="text-[12px] text-white/80 group-hover:text-white leading-normal">
                            {notif.text}
                          </p>
                          <span className="text-[9px] text-muted/50 font-semibold">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            {user ? (
              <div className="relative">
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 0 3px rgba(139,92,246,0.3), 0 4px 15px rgba(139,92,246,0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotifOpen(false);
                  }}
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center cursor-pointer border overflow-hidden transition-all ${
                    profileOpen ? 'border-white/40 shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'border-white/10'
                  }`}
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white select-none">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </motion.div>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="absolute right-0 mt-3 w-60 rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)] overflow-hidden z-50 p-2"
                      style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(30px)' }}
                    >
                      <div className="px-3.5 py-3 border-b border-white/[0.06] mb-1.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden font-bold text-white text-xs">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-[13px] font-bold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-muted/60 truncate">{user.email}</p>
                        </div>
                      </div>

                      {[
                        { label: 'My Profile', to: '/profile', icon: User },
                        { label: 'Watchlist', to: '/watchlist', icon: Bookmark },
                        { label: 'Settings', to: '/settings', icon: Settings },
                      ].map((item) => (
                        <Link key={item.to} href={item.to}>
                          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] text-muted hover:text-white hover:bg-white/[0.04] transition-all text-left">
                            <item.icon className="w-3.5 h-3.5" />
                            {item.label}
                          </button>
                        </Link>
                      ))}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left mt-1.5 border-t border-white/[0.05] pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-white/[0.08] text-[12.5px] font-semibold text-white transition-all bg-white/[0.02]"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(139,92,246,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#8B5CF6] text-[12.5px] font-semibold text-white transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
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
  { to: '/watchlist', label: 'Saved', Icon: Bookmark },
  { to: '/profile', label: 'Profile', Icon: User },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed bottom-4 inset-x-4 z-50 md:hidden"
      >
        <div className="glass border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.7)] bg-black/75 backdrop-blur-2xl rounded-2xl">
          <div className="flex items-center h-16 px-4">
            {MOBILE_TABS.map(({ to, label, Icon }) => {
              const active = isActive(to);
              return (
                <Link key={to} href={to} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-1 py-1"
                  >
                    <div className={`relative flex items-center justify-center w-12 h-8 rounded-xl transition-all duration-300 ${
                      active ? 'bg-accent/15 border border-accent/20' : 'bg-transparent'
                    }`}>
                      <Icon className={`w-5 h-5 transition-colors duration-300 ${
                        active ? 'text-accent-light' : 'text-muted/70'
                      }`} />
                    </div>
                    <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-300 ${
                      active ? 'text-accent-light font-bold' : 'text-muted/50'
                    }`}>
                      {label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Search Tab */}
            <button className="flex-1" onClick={() => setSearchOpen(true)}>
              <div className="flex flex-col items-center gap-1 py-1">
                <div className="flex items-center justify-center w-12 h-8 rounded-xl bg-transparent">
                  <Search className="w-5 h-5 text-muted/70" />
                </div>
                <span className="text-[10px] font-semibold tracking-wide text-muted/50">Search</span>
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
