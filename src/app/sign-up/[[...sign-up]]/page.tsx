"use client";

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs/legacy';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, ShieldCheck, Film, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../context/ToastContext';
import Link from 'next/link';

const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

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
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  if (!isLoaded) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'email') {
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
      } else {
        await signUp.create({
          phoneNumber: phone,
          password,
          firstName: name || 'Cinephile',
        });
        await signUp.preparePhoneNumberVerification({
          strategy: 'phone_code',
        });
        showToast('Verification SMS code sent!', 'success');
        router.push(`/verify-otp?type=signup&identifier=${encodeURIComponent(phone)}&method=phone`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Registration failed. Check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'oauth_google' | 'oauth_facebook') => {
    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/onboarding',
      });
    } catch (err: any) {
      console.error(err);
      showToast('Social signup failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 pt-24 pb-20">
      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#8B5CF6]/15 filter blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#FF3B30]/10 filter blur-[80px]" />
      </div>

      {/* Modal Card */}
      <div className="relative w-full max-w-[820px] min-h-[550px] bg-[#050505] border border-white/[0.08] rounded-[32px] overflow-hidden flex shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.08)] z-10">
        
        {/* LEFT — Cinematic Branding Side Panel */}
        <div className="hidden md:flex flex-col justify-between w-[42%] p-8 relative overflow-hidden bg-gradient-to-br from-[#8B5CF6]/15 via-[#0A0A0A] to-[#050505] border-r border-white/[0.06]">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-[#8B5CF6]/25 filter blur-[80px]" />
          <div className="absolute bottom-10 -left-10 w-40 h-40 rounded-full bg-[#FF3B30]/15 filter blur-[60px]" />

          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-[10px] bg-[#8B5CF6] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-black text-white tracking-tight">
              Binge<span className="text-[#8B5CF6]">Karo</span>
            </span>
          </div>

          <div className="space-y-3 relative z-10">
            <h2 className="text-2xl font-black text-white tracking-[-0.03em] leading-tight">
              Find Your Next Obsession.
            </h2>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
              Your AI-powered companion for discovering movies and shows you'll actually love.
            </p>
          </div>

          <div className="space-y-3 relative z-10">
            {[
              'Sync watchlists across all devices',
              'Curated AI recommendations instantly',
              'Set language & OTT provider preferences',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span className="text-[11.5px] text-white/75 font-semibold">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Authentication Forms */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-10 bg-[#050505] overflow-y-auto">
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Create Account</h3>
              <p className="text-[12.5px] text-muted-foreground mt-1">
                Join BingeKaro to unlock personalized recommendations.
              </p>
            </div>

            {/* Email / Phone Tabs */}
            <div className="flex rounded-[14px] bg-white/[0.03] p-1 border border-white/[0.06]">
              {(['email', 'phone'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] text-[12.5px] font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'text-muted-foreground hover:text-white/85'
                  }`}
                >
                  {tab === 'email' ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                  {tab === 'email' ? 'Email' : 'Phone'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yash Shinde"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
                />
              </div>

              {/* Email / Phone Inputs */}
              {activeTab === 'email' ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
                  />
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-3.5 pr-10 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
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

              {error && <p className="text-[11px] text-[#FF3B30] font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-[14px] text-[13.5px] font-bold text-white flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 shadow-[0_4px_20px_rgba(139,92,246,0.25)] border-0 transition-all disabled:opacity-50"
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

            {/* Toggle Sign In */}
            <p className="text-center text-[12px] text-muted-foreground">
              Already have an account?{' '}
              <Link href="/sign-in">
                <span className="text-[#8B5CF6] hover:text-white font-bold transition-colors">Sign In</span>
              </Link>
            </p>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-0 h-[1px] bg-white/[0.06]" />
              <span className="relative z-10 px-3 bg-[#050505] text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Or continue with
              </span>
            </div>

            {/* Social signup */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialSignUp('oauth_google')}
                className="h-10 rounded-[12px] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 text-[12px] font-bold text-white flex items-center justify-center gap-2 transition-all"
              >
                <GoogleIcon />
                Google
              </button>
              <button
                onClick={() => handleSocialSignUp('oauth_facebook')}
                className="h-10 rounded-[12px] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 text-[12px] font-bold text-white flex items-center justify-center gap-2 transition-all"
              >
                <FacebookIcon />
                Facebook
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
