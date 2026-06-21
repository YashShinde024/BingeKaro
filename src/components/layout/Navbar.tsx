"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Home, Compass, Bookmark, User, LogIn, LogOut, Settings, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '../../context/AuthContext';

const NAV_CENTER = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/blog', label: 'Blog' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Dune: Part Two is now streaming!', type: 'release', time: '2h ago' },
  { id: 2, text: 'Your Taste DNA Scan is ready to review.', type: 'recommendation', time: '5h ago' },
  { id: 3, text: 'JioHotstar added new free releases', type: 'free', time: '1d ago' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, openLoginModal, logout } = useAuth();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Click-away listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll logic
  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      setScrolled(currentScrollY > 10);
      if (totalScroll > 0) {
        setScrollProgress((currentScrollY / totalScroll) * 100);
      }

      if (currentScrollY > 70) {
        setVisible(currentScrollY < lastScrollY);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleProtectedClick = (e: React.MouseEvent, to: string) => {
    const isProtected = ['/watchlist', '/profile', '/settings'].some(route => to.startsWith(route));
    if (isProtected && !user) {
      e.preventDefault();
      openLoginModal();
    }
  };

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="absolute top-0 left-0 h-[3px] bg-accent transition-all duration-100" style={{ width: `${scrollProgress}%` }} />

      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="BingeKaro Logo" className="w-8.5 h-8.5 object-contain group-hover:scale-105 transition-transform" />
          <span className="text-[15px] font-black text-foreground tracking-tight">
            Binge<span className="text-accent">Karo</span>
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_CENTER.map(item => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                onClick={(e) => handleProtectedClick(e, item.to)}
                className={`relative px-4 py-1.5 rounded-full text-[12.5px] font-bold tracking-wide transition-all ${
                  active 
                    ? 'text-accent' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-accent/10 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* CMD+K shortcut hint */}
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-muted/10 hover:bg-muted/20 border border-border/40 rounded-xl text-[11px] font-bold text-muted-foreground transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="text-[9px] font-mono opacity-60">Ctrl+K</kbd>
          </button>

          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted/15 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          )}

          {/* Notifications */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 hover:bg-muted/15 rounded-xl text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-80 bg-card border border-border rounded-2xl p-4 shadow-xl z-50 space-y-3"
                  >
                    <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Alerts</h4>
                    <div className="space-y-2">
                      {MOCK_NOTIFICATIONS.map(notif => (
                        <div key={notif.id} className="p-2.5 rounded-xl hover:bg-muted/5 transition-colors border border-border/40">
                          <p className="text-xs text-foreground font-semibold leading-normal">{notif.text}</p>
                          <span className="text-[9px] text-muted-foreground block mt-1">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-black text-sm border border-white/10 hover:scale-105 transition-all overflow-hidden"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-52 bg-card border border-border rounded-2xl p-2.5 shadow-xl z-50 space-y-1"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors"
                    >
                      <User className="w-4 h-4 text-accent" /> Profile & DNA
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-accent" /> Settings
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-white font-bold text-[11.5px] px-4.5 py-2 rounded-xl transition-all shadow-[0_4px_12px_rgba(249,115,22,0.2)]"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user, openLoginModal } = useAuth();

  const handleProtectedClick = (e: React.MouseEvent, to: string) => {
    const isProtected = ['/watchlist', '/profile', '/settings'].some(route => to.startsWith(route));
    if (isProtected && !user) {
      e.preventDefault();
      openLoginModal();
    }
  };

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  const MOBILE_TABS = [
    { to: '/', label: 'Home', Icon: Home },
    { to: '/discover', label: 'Discover', Icon: Compass },
    { to: '/watchlist', label: 'Watchlist', Icon: Bookmark },
    { to: '/profile', label: 'Profile', Icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed bottom-4 inset-x-4 z-50 md:hidden"
    >
      <div className="bg-background/80 backdrop-blur-2xl border border-border/80 shadow-[0_12px_32px_rgba(0,0,0,0.15)] rounded-2xl">
        <div className="flex items-center h-16 px-4">
          {MOBILE_TABS.map(({ to, label, Icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} href={to} onClick={(e) => handleProtectedClick(e, to)} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 py-1"
                >
                  <div className={`relative flex items-center justify-center w-12 h-8 rounded-xl transition-all duration-300 ${
                    active ? 'bg-accent/10 border border-accent/20' : 'bg-transparent'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${
                      active ? 'text-accent' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-300 ${
                    active ? 'text-accent font-bold' : 'text-muted-foreground/60'
                  }`}>
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* Search Trigger */}
          <button 
            className="flex-1" 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          >
            <div className="flex flex-col items-center gap-1 py-1">
              <div className="flex items-center justify-center w-12 h-8 rounded-xl bg-transparent">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-[10px] font-semibold tracking-wide text-muted-foreground/60">Search</span>
            </div>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
