"use client";

import React, { useState, Suspense } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs/legacy';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '../../context/ToastContext';

function VerifyOtpContent() {
  const { signIn, isLoaded: isSignInLoaded, setActive: setSignInActive } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded, setActive: setSignUpActive } = useSignUp();

  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const type = searchParams.get('type') || 'signin'; // 'signin' or 'signup'
  const identifier = searchParams.get('identifier') || '';
  const method = searchParams.get('method') || 'email'; // 'email' or 'phone'

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;

    setLoading(true);
    setError('');

    try {
      if (type === 'signin') {
        if (!isSignInLoaded) return;
        const result = await signIn.attemptFirstFactor({
          strategy: method === 'email' ? 'email_code' : 'phone_code',
          code,
        });

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          setSuccess(true);
          showToast('Sign in successful!', 'success');
          setTimeout(() => {
            router.push('/profile');
          }, 2000);
        } else {
          console.error(result);
          setError('Sign in status incomplete. Please try again.');
        }
      } else {
        // signup
        if (!isSignUpLoaded) return;
        const result = method === 'email'
          ? await signUp.attemptEmailAddressVerification({ code })
          : await signUp.attemptPhoneNumberVerification({ code });

        if (result.status === 'complete') {
          await setSignUpActive({ session: result.createdSessionId });
          setSuccess(true);
          showToast('Account verified successfully!', 'success');
          setTimeout(() => {
            router.push('/onboarding');
          }, 2000);
        } else {
          console.error(result);
          setError('Sign up status incomplete. Please check verification code.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative z-10 w-full max-w-[440px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-8 rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.06)] space-y-6"
    >
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="verify-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8B5CF6] mx-auto shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Verify Code</h2>
              <p className="text-[12.5px] text-muted-foreground max-w-[280px] mx-auto">
                We've sent a 6-digit confirmation code to <span className="text-white font-semibold">{identifier || 'your device'}</span>.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex gap-2.5 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-13 text-center text-lg font-bold rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
                  />
                ))}
              </div>

              {error && <p className="text-[11px] text-[#FF3B30] font-semibold text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.some(d => !d)}
                className="w-full h-11 rounded-[14px] text-[13.5px] font-bold text-white flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 shadow-[0_4px_20px_rgba(139,92,246,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
              </button>
            </form>

            <div className="flex items-center justify-between text-[12px]">
              <button
                onClick={() => router.push(type === 'signin' ? '/sign-in' : '/sign-up')}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button className="text-[#8B5CF6] hover:text-white transition-colors font-semibold">
                Resend Code
              </button>
            </div>
          </motion.div>
        ) : (
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
              <h3 className="text-lg font-bold text-white">Verification Successful!</h3>
              <p className="text-[12.5px] text-muted-foreground mt-1">
                Navigating to your destination…
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 pt-24 pb-20">
      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#8B5CF6]/15 filter blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#FF3B30]/10 filter blur-[80px]" />
      </div>

      <Suspense fallback={
        <div className="relative z-10 flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
          <span className="text-[13px]">Loading OTP interface…</span>
        </div>
      }>
        <VerifyOtpContent />
      </Suspense>
    </div>
  );
}
