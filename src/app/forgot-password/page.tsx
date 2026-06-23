"use client";

import React, { useState } from 'react';
import { useSignIn } from '@clerk/nextjs/legacy';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, ArrowRight, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  if (!isLoaded) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
      });
      const factor = signInAttempt.supportedFirstFactors?.find(
        (f: any) => f.strategy === 'reset_password_email_code'
      );
      if (factor && 'emailAddressId' in factor) {
        await signIn.prepareFirstFactor({
          strategy: 'reset_password_email_code',
          emailAddressId: (factor as any).emailAddressId,
        });
        setStep('reset');
        showToast('Reset code sent to your email!', 'success');
      } else {
        setError('Reset password method not supported or email address ID not found.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Failed to send reset code. Make sure the email is correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword) return;
    setLoading(true);
    setError('');

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setStep('success');
        showToast('Password reset successfully!', 'success');
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        console.error(result);
        setError('Verification incomplete. Try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Verification failed. Double check the code and password requirements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-24 pb-20">
      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-accent/15 filter blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#FF3B30]/10 filter blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-8 rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.06)] space-y-6"
      >
        <AnimatePresence mode="wait">
          {step === 'request' && (
            <motion.div
              key="request"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-accent mx-auto">
                  <KeyRound className="w-5.5 h-5.5" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Forgot Password?</h2>
                <p className="text-[12.5px] text-muted-foreground max-w-[280px] mx-auto">
                  Enter your email address and we'll send you a code to reset your password.
                </p>
              </div>

              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                {error && <p className="text-[11px] text-[#FF3B30] font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-[14px] text-[13.5px] font-bold text-white flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 shadow-[0_4px_20px_rgba(139,92,246,0.25)] transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Code'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-accent mx-auto">
                  <KeyRound className="w-5.5 h-5.5 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
                <p className="text-[12.5px] text-muted-foreground max-w-[280px] mx-auto">
                  Enter the verification code sent to your email and your new password.
                </p>
              </div>

              <form onSubmit={handleCompleteReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Verification Code</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-11 px-4 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13.5px] text-center font-bold tracking-widest text-white focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
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
                  className="w-full h-11 rounded-[14px] text-[13.5px] font-bold text-white flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 shadow-[0_4px_20px_rgba(139,92,246,0.25)] transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Reset'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Password Reset!</h3>
                <p className="text-[12.5px] text-muted-foreground mt-1">
                  You've successfully reset your password. Signing you in…
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
