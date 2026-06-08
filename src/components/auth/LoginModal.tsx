import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, ArrowRight, ShieldCheck, Film, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type AuthStep = 'signin' | 'signup' | 'otp' | 'forgot' | 'success';

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

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [step, setStep] = useState<AuthStep>('signin');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isLoginModalOpen) return null;

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone = (v: string) => v.replace(/\D/g, '').length >= 10;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (step === 'signup' && !name.trim()) errs.name = 'Name is required';
    if (activeTab === 'email' && !validateEmail(email)) errs.email = 'Enter a valid email';
    if (activeTab === 'phone' && !validatePhone(phone)) errs.phone = 'Enter a valid phone number';
    if (step === 'signup' && password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    await login(name || 'Yash Shinde', email || `${phone}@kyadekhu.com`);
    setIsSubmitting(false);
    setStep('success');
    setTimeout(() => {
      resetState();
    }, 2500);
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider);
    await new Promise(r => setTimeout(r, 1200));
    await login(name || 'Yash Shinde', email || 'yash@nyxen.in');
    setSocialLoading(null);
    setStep('success');
    setTimeout(() => resetState(), 2500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'email' && !validateEmail(email)) {
      setErrors({ email: 'Enter a valid email' });
      return;
    }
    setStep('forgot');
  };

  const resetState = () => {
    setStep('signin');
    setEmail('');
    setPhone('');
    setName('');
    setPassword('');
    setOtp(['', '', '', '', '', '']);
    setErrors({});
    setSocialLoading(null);
    setShowPassword(false);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { closeLoginModal(); resetState(); }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-[840px] h-[560px] bg-[#0c0c0c] border border-white/[0.08] rounded-card overflow-hidden flex shadow-[0_24px_64px_rgba(0,0,0,0.8)] z-10"
        >
          {/* Close button */}
          <button
            onClick={() => { closeLoginModal(); resetState(); }}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 text-muted hover:text-white border border-white/[0.06] hover:bg-white/[0.06] transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          {/* LEFT — Cinematic Branding Side Panel */}
          <div className="hidden md:flex flex-col justify-between w-[45%] p-8 relative overflow-hidden bg-gradient-to-br from-accent-dark via-[#120f24] to-[#0c0c0c]">
            <div className="absolute top-1/4 left-1/4 w-44 h-44 rounded-full bg-accent/20 filter blur-[80px]" />
            <div className="absolute bottom-10 -left-10 w-40 h-40 rounded-full bg-violet-600/10 filter blur-[60px]" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-accent flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-[14px] font-bold text-white tracking-tight">
                Kya<span className="text-accent-light">Dekhu</span>
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-white tracking-[-0.02em] leading-tight">
                Your ultimate companion to escape the scroll loop.
              </h2>
              <p className="text-[12.5px] text-muted leading-relaxed">
                Unlock personalized dashboards, sync your watchlists across devices, and get curated recommendations tailored to your exact mood.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                'Sync watchlists across all devices',
                'Curated AI recommendations in < 30s',
                'Set language & OTT provider preferences',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-light shrink-0" />
                  <span className="text-[11px] text-white/70 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Authentication Forms */}
          <div className="flex-1 flex flex-col justify-center p-8 sm:p-10 bg-[#0c0c0c] overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* ── SUCCESS SCREEN ── */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mb-5"
                  >
                    <Check className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Welcome back!</h3>
                  <p className="text-[13px] text-muted/60">You're signed in. Redirecting…</p>
                </motion.div>
              )}

              {/* ── FORGOT PASSWORD ── */}
              {step === 'forgot' && (
                <motion.div
                  key="forgot"
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-card bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-accent-light" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Check your inbox</h3>
                    <p className="text-[13px] text-muted mt-1.5 max-w-xs">
                      We've sent a password reset link to <span className="text-white font-semibold">{email || 'your email'}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('signin')}
                    className="w-full h-11 rounded-btn bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-[13px] font-semibold text-white transition-all"
                  >
                    ← Back to Sign In
                  </button>
                </motion.div>
              )}

              {/* ── OTP VERIFICATION ── */}
              {step === 'otp' && (
                <motion.div
                  key="otp"
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Verify Code</h3>
                    <p className="text-[12.5px] text-muted mt-1">
                      Enter the 6-digit code sent to {activeTab === 'email' ? email : phone}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="space-y-6">
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
                          className="w-11 h-13 text-center text-lg font-bold rounded-input bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || otp.some(d => !d)}
                      className="w-full h-11 rounded-btn text-[13.5px] font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden relative"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                        boxShadow: '0 4px 20px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                      }}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                      ) : (
                        'Verify & Sign In'
                      )}
                    </button>
                  </form>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setStep('signin')}
                      className="text-[12px] text-muted hover:text-white transition-colors"
                    >
                      ← Back to Sign In
                    </button>
                    <button className="text-[12px] text-accent-light hover:text-white transition-colors">
                      Resend Code
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── SIGN IN / SIGN UP ── */}
              {(step === 'signin' || step === 'signup') && (
                <motion.div
                  key="auth-form"
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {step === 'signin' ? 'Welcome to KyaDekhu' : 'Create Account'}
                    </h3>
                    <p className="text-[12.5px] text-muted mt-1">
                      {step === 'signin' ? 'Sign in to save movies and view history.' : 'Join to unlock personalized recommendations.'}
                    </p>
                  </div>

                  {/* Email / Phone Tabs */}
                  <div className="flex rounded-input bg-white/[0.04] p-1 border border-white/[0.05]">
                    {(['email', 'phone'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setErrors({}); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-btn text-[12.5px] font-semibold transition-all duration-200 ${
                          activeTab === tab
                            ? 'bg-white/[0.08] text-white shadow-sm'
                            : 'text-muted hover:text-white/80'
                        }`}
                      >
                        {tab === 'email' ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                        {tab === 'email' ? 'Email' : 'Phone'}
                      </button>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSendOTP} className="space-y-3.5">
                    {/* Name field (sign up only) */}
                    {step === 'signup' && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Yash Shinde"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: ''})); }}
                          className={`w-full h-11 px-3.5 rounded-input bg-white/[0.04] border text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all ${
                            errors.name ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/[0.08]'
                          }`}
                        />
                        {errors.name && <p className="text-[10px] text-rose-400 font-medium">{errors.name}</p>}
                      </div>
                    )}

                    {activeTab === 'email' ? (
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          placeholder="name@domain.com"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
                          className={`w-full h-11 px-3.5 rounded-input bg-white/[0.04] border text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all ${
                            errors.email ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/[0.08]'
                          }`}
                        />
                        {errors.email && <p className="text-[10px] text-rose-400 font-medium">{errors.email}</p>}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={phone}
                          onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({...prev, phone: ''})); }}
                          className={`w-full h-11 px-3.5 rounded-input bg-white/[0.04] border text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all ${
                            errors.phone ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/[0.08]'
                          }`}
                        />
                        {errors.phone && <p className="text-[10px] text-rose-400 font-medium">{errors.phone}</p>}
                      </div>
                    )}

                    {/* Password (sign up only) */}
                    {step === 'signup' && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted uppercase tracking-wider">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                            className={`w-full h-11 px-3.5 pr-10 rounded-input bg-white/[0.04] border text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all ${
                              errors.password ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/[0.08]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-[10px] text-rose-400 font-medium">{errors.password}</p>}
                      </div>
                    )}

                    {/* Remember Me + Forgot Password */}
                    {step === 'signin' && (
                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div
                            onClick={() => setRememberMe(!rememberMe)}
                            className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                              rememberMe ? 'bg-accent border-accent' : 'border-white/20 bg-white/5 group-hover:border-white/30'
                            }`}
                          >
                            {rememberMe && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[11.5px] text-muted/70 group-hover:text-muted transition-colors">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[11.5px] text-accent-light hover:text-white transition-colors font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full h-11 rounded-btn text-[13.5px] font-semibold text-white flex items-center justify-center gap-2 group transition-all overflow-hidden relative"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                        boxShadow: '0 4px 20px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                      }}
                    >
                      {step === 'signin' ? 'Send One-Time Code' : 'Create Account'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </form>

                  {/* Toggle sign in / sign up */}
                  <p className="text-center text-[12px] text-muted/60">
                    {step === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      onClick={() => { setStep(step === 'signin' ? 'signup' : 'signin'); setErrors({}); }}
                      className="text-accent-light hover:text-white font-semibold transition-colors"
                    >
                      {step === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-x-0 h-[1px] bg-white/[0.06]" />
                    <span className="relative z-10 px-3 bg-[#0c0c0c] text-[10px] uppercase font-semibold text-muted tracking-wider">
                      Or continue with
                    </span>
                  </div>

                  {/* Social logins */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      onClick={() => handleSocialLogin('google')}
                      disabled={!!socialLoading}
                      className="h-10 rounded-btn bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 text-[12px] font-medium text-white/90 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {socialLoading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
                      Google
                    </button>
                    <button
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={!!socialLoading}
                      className="h-10 rounded-btn bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 text-[12px] font-medium text-white/90 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {socialLoading === 'facebook' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FacebookIcon />}
                      Facebook
                    </button>
                    <button
                      onClick={() => { closeLoginModal(); resetState(); }}
                      className="h-10 rounded-btn bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 text-[12px] font-medium text-white/90 flex items-center justify-center gap-2 transition-all"
                    >
                      👤 Guest
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
