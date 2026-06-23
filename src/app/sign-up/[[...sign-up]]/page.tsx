"use client";

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs/legacy';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../context/ToastContext';
import Link from 'next/link';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function SignUpPage() {
  const { signUp, isLoaded } = useSignUp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  if (!isLoaded) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name || 'Cinephile',
      });
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      showToast('Verification email code sent!', 'success');
      router.push(`/verify-otp?type=signup&identifier=${encodeURIComponent(email)}&method=email`);
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Registration failed. Check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/onboarding',
      });
    } catch (err: any) {
      console.error(err);
      showToast('Social signup failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-24 pb-20">
      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-accent/15 filter blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#FF3B30]/10 filter blur-[80px]" />
      </div>

      {/* Centered Auth Card */}
      <div className="relative w-full max-w-[440px] bg-background border border-white/[0.08] p-8 rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.06)] z-10 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Binge<span className="text-accent">Karo</span>
          </h2>
          <p className="text-[12px] text-muted-foreground uppercase tracking-widest font-bold">
            Find Your Next Obsession
          </p>
        </div>

        {/* Google Authentication */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full h-11 rounded-[14px] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/15 text-[13px] font-bold text-white flex items-center justify-center gap-2.5 transition-all shadow-sm"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-x-0 h-[1px] bg-white/[0.06]" />
          <span className="relative z-10 px-3 bg-background text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            ──────── OR ────────
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Yash Shinde"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 pr-10 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
            />
          </div>

          {error && <p className="text-[11px] text-[#FF3B30] font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-[14px] text-[13.5px] font-bold text-white flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 shadow-[0_4px_20px_rgba(139,92,246,0.25)] transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Toggle */}
        <div className="flex items-center justify-center gap-1 pt-2 text-[12px] text-muted-foreground border-t border-white/[0.04]">
          <span>Already have an account?</span>
          <Link href="/sign-in">
            <span className="text-accent hover:text-white font-bold transition-colors cursor-pointer">Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
