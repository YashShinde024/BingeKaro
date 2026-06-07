import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, ArrowRight, ShieldCheck, Film } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'email' && !email) return;
    if (activeTab === 'phone' && !phone) return;
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock verify
    await login(name || 'Yash Shinde', email || `${phone}@kyadekhu.com`);
    setIsSubmitting(false);
    // Reset state
    setStep('details');
    setEmail('');
    setPhone('');
    setName('');
    setOtp(['', '', '', '']);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-[840px] h-[540px] bg-[#0c0c0c] border border-white/[0.08] rounded-[24px] overflow-hidden flex shadow-[0_24px_64px_rgba(0,0,0,0.8)] z-10"
        >
          {/* Close button */}
          <button
            onClick={closeLoginModal}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 text-muted hover:text-white border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* LEFT — Cinematic Branding Side Panel */}
          <div className="hidden md:flex flex-col justify-between w-[45%] p-8 relative overflow-hidden bg-gradient-to-br from-accent-dark via-[#120f24] to-[#0c0c0c]">
            {/* Background decorative glow */}
            <div className="absolute top-1/4 left-1/4 w-44 h-44 rounded-full bg-accent/20 filter blur-[80px]" />
            <div className="absolute bottom-10 -left-10 w-40 h-40 rounded-full bg-violet-600/10 filter blur-[60px]" />

            {/* Top brand logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-accent flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-[14px] font-bold text-white tracking-tight">
                Kya<span className="text-accent-light">Dekhu</span>
              </span>
            </div>

            {/* Core message */}
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-white tracking-[-0.02em] leading-tight">
                Your ultimate companion to escape the scroll loop.
              </h2>
              <p className="text-[12.5px] text-muted leading-relaxed">
                Unlock personalized dashboards, sync your watchlists across devices, and get curated recommendations tailored to your exact mood.
              </p>
            </div>

            {/* Bullet features */}
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
          <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 bg-[#0c0c0c]">
            {step === 'details' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Welcome to KyaDekhu</h3>
                  <p className="text-[12.5px] text-muted mt-1">Sign in to save movies and view history.</p>
                </div>

                {/* Tabs */}
                <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.05]">
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12.5px] font-semibold transition-all ${
                      activeTab === 'email'
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-muted hover:text-white/80'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </button>
                  <button
                    onClick={() => setActiveTab('phone')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12.5px] font-semibold transition-all ${
                      activeTab === 'phone'
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-muted hover:text-white/80'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Phone
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-muted uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Yash Shinde"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all"
                    />
                  </div>

                  {activeTab === 'email' ? (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="name@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-accent hover:bg-accent-light text-[13.5px] font-semibold text-white flex items-center justify-center gap-2 group transition-all glow-accent-sm hover:scale-[1.01]"
                  >
                    Send One-Time Code
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-x-0 h-[1px] bg-white/[0.06]" />
                  <span className="relative z-10 px-3 bg-[#0c0c0c] text-[10px] uppercase font-semibold text-muted tracking-wider">
                    Or login with
                  </span>
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => login(name || 'Yash Shinde', email || 'yash@nyxen.in')}
                    className="h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 text-[12.5px] font-medium text-white/90 flex items-center justify-center gap-2 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    onClick={closeLoginModal}
                    className="h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 text-[12.5px] font-medium text-white/90 flex items-center justify-center gap-2 transition-all"
                  >
                    Guest User
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight font-display">Verify Code</h3>
                  <p className="text-[12.5px] text-muted mt-1">
                    Enter the 4-digit code sent to {activeTab === 'email' ? email : phone}
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        required
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-accent/50 focus:bg-white/[0.06] transition-all"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-accent hover:bg-accent-light disabled:opacity-50 text-[13.5px] font-semibold text-white flex items-center justify-center gap-2 transition-all glow-accent-sm"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                </form>

                <div className="text-center">
                  <button
                    onClick={() => setStep('details')}
                    className="text-[12px] text-muted hover:text-white transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
