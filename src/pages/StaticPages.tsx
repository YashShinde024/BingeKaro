import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Film, Sparkles, MapPin, Mail, CheckCircle2, ArrowRight, Zap, Globe, Rocket, Smartphone } from 'lucide-react';

/* ─── Shared fade-in stagger wrapper ─── */
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── About ─── */
export const About: React.FC = () => (
  <div className="min-h-screen bg-[#080808] pt-24 pb-24 md:pb-16 relative overflow-hidden">

    {/* Ambient background */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="aurora-orb aurora-orb-1" style={{ left: '-15%', top: '-10%', opacity: 0.5 }} />
      <div className="aurora-orb aurora-orb-3" style={{ right: '-10%', bottom: '-10%', opacity: 0.4 }} />
    </div>

    <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">

      {/* Hero */}
      <FadeIn className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 mb-5">
          <Film className="w-3.5 h-3.5 text-accent-light" />
          <span className="text-[11px] font-semibold text-accent-light uppercase tracking-wider">Our Story</span>
        </div>
        <h1 className="text-[40px] sm:text-[52px] font-black text-white mb-5 leading-[1.08] tracking-[-0.025em]">
          We built the tool<br />we always wanted.
        </h1>
        <p className="text-white/55 text-[17px] leading-relaxed max-w-xl">
          KyaDekhu started from a simple frustration — spending 45 minutes looking for something to watch,
          only to give up and rewatch something. We knew there was a better way.
        </p>
      </FadeIn>

      {/* Mission / Vision */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
        {[
          {
            label: 'Mission',
            icon: Zap,
            text: 'Help every user find something worth watching in under 30 seconds, using AI that actually understands mood and context.',
          },
          {
            label: 'Vision',
            icon: Globe,
            text: 'Become the default starting point for entertainment discovery across India — combining taste, availability, and intelligence.',
          },
        ].map((item, i) => (
          <FadeIn key={item.label} delay={0.1 + i * 0.08}>
            <div className="glass rounded-2xl p-6 border border-white/[0.07] h-full hover:border-accent/20 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-accent/15 rounded-lg flex items-center justify-center border border-accent/20">
                  <item.icon className="w-3.5 h-3.5 text-accent-light" />
                </div>
                <p className="text-[11px] text-accent-light font-bold uppercase tracking-widest">{item.label}</p>
              </div>
              <p className="text-white/70 text-[14px] leading-relaxed">{item.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Why we exist callout */}
      <FadeIn delay={0.2} className="mb-14">
        <div
          className="rounded-2xl p-7 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(109,40,217,0.06) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[13px] font-semibold text-accent-light uppercase tracking-widest mb-2">The Problem</p>
          <p className="text-white text-[17px] font-semibold leading-relaxed">
            "Netflix paradox" is real — more content, less satisfaction. We're solving decision fatigue for 500M+ Indian OTT subscribers.
          </p>
        </div>
      </FadeIn>

      {/* Roadmap */}
      <FadeIn delay={0.25} className="mb-14">
        <h2 className="text-[22px] font-bold text-white mb-7 tracking-[-0.015em]">Roadmap</h2>
        <div className="space-y-1">
          {[
            { phase: 'v1.0', label: 'AI Recommendations + OTT Discovery', status: 'Live', done: true, icon: CheckCircle2 },
            { phase: 'v1.5', label: 'Social Watchlist + Friends Activity', status: 'Q3 2025', done: false, icon: Rocket },
            { phase: 'v2.0', label: 'Personalized AI Model + Groq Integration', status: 'Q4 2025', done: false, icon: Sparkles },
            { phase: 'v2.5', label: 'Mobile App (iOS + Android)', status: '2026', done: false, icon: Smartphone },
            { phase: 'v3.0', label: 'Real-time OTT Availability via APIs', status: '2026', done: false, icon: Globe },
          ].map((item, i) => (
            <motion.div
              key={item.phase}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${
                item.done
                  ? 'bg-accent/8 border border-accent/15'
                  : 'hover:bg-white/[0.025] border border-transparent hover:border-white/[0.05]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.done ? 'bg-accent/20 border border-accent/30' : 'bg-white/5 border border-white/[0.07]'
              }`}>
                <item.icon className={`w-4 h-4 ${item.done ? 'text-accent-light' : 'text-muted/50'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-[14px] font-semibold truncate ${item.done ? 'text-white' : 'text-white/60'}`}>
                    {item.label}
                  </p>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                    item.done
                      ? 'bg-accent/20 text-accent-light border border-accent/30'
                      : 'bg-white/5 text-muted border border-white/[0.07]'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted/40 mt-0.5">{item.phase}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </FadeIn>

      {/* Nyxen */}
      <FadeIn delay={0.5}>
        <div className="glass rounded-2xl p-7 border border-white/[0.07] text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent-light" />
            <span className="text-[14px] font-bold text-white">Part of the Nyxen Ecosystem</span>
          </div>
          <p className="text-white/50 text-[13px] max-w-md mx-auto leading-relaxed">
            KyaDekhu is built and maintained by Nyxen — a collective building intelligent, beautifully designed products.
          </p>
        </div>
      </FadeIn>

      <div className="flex items-center justify-center gap-6 text-[13px] text-muted">
        <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5 group">
          <Mail className="w-4 h-4 group-hover:text-accent-light transition-colors" />
          Contact
        </Link>
        <span className="text-white/10">·</span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          India
        </span>
        <span className="text-white/10">·</span>
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        <span className="text-white/10">·</span>
        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
      </div>
    </div>
  </div>
);

/* ─── Contact ─── */
export const Contact: React.FC = () => {
  const [sent, setSent] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-24 md:pb-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora-orb aurora-orb-2" style={{ right: '0%', top: '-20%', opacity: 0.4 }} />
      </div>

      <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
        <FadeIn className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 mb-5">
            <Mail className="w-3.5 h-3.5 text-accent-light" />
            <span className="text-[11px] font-semibold text-accent-light uppercase tracking-wider">Get in Touch</span>
          </div>
          <h1 className="text-[40px] sm:text-[48px] font-black text-white mb-3 tracking-[-0.025em]">
            Let's talk.
          </h1>
          <p className="text-white/50 text-[16px]">Questions, feedback, or partnerships — we read everything.</p>
        </FadeIn>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-3xl p-12 border border-accent/20 text-center"
              style={{ boxShadow: '0 0 60px rgba(139,92,246,0.08)' }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-accent/30"
              >
                <CheckCircle2 className="w-8 h-8 text-accent-light" />
              </motion.div>
              <h3 className="text-[22px] font-black text-white mb-2">Message received!</h3>
              <p className="text-white/50 text-[14px] mb-7">We'll get back to you within 24 hours.</p>
              <button
                onClick={() => setSent(false)}
                className="inline-flex items-center gap-2 text-[13px] text-accent-light hover:text-white transition-colors font-medium"
              >
                Send another <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <form
                onSubmit={handleSubmit}
                className="glass rounded-3xl p-7 border border-white/[0.07] space-y-4 mb-8"
              >
                {[
                  { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                ].map(field => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-[12px] font-semibold text-muted/80 uppercase tracking-wider mb-2">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white
                                 placeholder-muted/40 text-[14px] outline-none transition-all duration-200"
                      style={{
                        borderColor: focusedField === field.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)',
                        boxShadow: focusedField === field.id ? '0 0 0 3px rgba(139,92,246,0.08)' : 'none',
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[12px] font-semibold text-muted/80 uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    placeholder="Tell us what's on your mind..."
                    required
                    rows={4}
                    onFocus={() => setFocusedField('msg')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-white
                               placeholder-muted/40 text-[14px] outline-none transition-all duration-200 resize-none"
                    style={{
                      borderColor: focusedField === 'msg' ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)',
                      boxShadow: focusedField === 'msg' ? '0 0 0 3px rgba(139,92,246,0.08)' : 'none',
                    }}
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-white font-bold py-4 rounded-xl text-[14px]"
                  style={{ boxShadow: '0 6px 24px rgba(139,92,246,0.4)' }}
                >
                  <Mail className="w-4 h-4" />
                  Send Message
                </motion.button>
              </form>

              {/* FAQ */}
              <div>
                <h2 className="text-[18px] font-bold text-white mb-4">Frequently Asked</h2>
                <div className="space-y-2">
                  {[
                    { q: 'Is KyaDekhu free to use?', a: 'Yes, completely free. We never charge for recommendations.' },
                    { q: 'Does KyaDekhu have a mobile app?', a: 'A mobile app is on our roadmap for 2026.' },
                    { q: 'How does the AI work?', a: "We use Groq's inference API with TMDb data to match your mood to the best titles." },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="glass rounded-xl p-4 border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                    >
                      <p className="text-white font-semibold text-[13px] mb-1">{item.q}</p>
                      <p className="text-muted text-[13px] leading-relaxed">{item.a}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─── Shared Legal Page ─── */
const LegalPage: React.FC<{ title: string; sections: { heading: string; content: string }[] }> = ({ title, sections }) => (
  <div className="min-h-screen bg-[#080808] pt-24 pb-24 md:pb-16">
    <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-[40px] font-black text-white mb-2 tracking-[-0.025em]">{title}</h1>
        <p className="text-muted/50 text-[13px] mb-12">Last updated: June 2025</p>
        <div className="space-y-10">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-[16px] font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center text-[9px] font-black text-accent-light flex-shrink-0">
                  {i + 1}
                </span>
                {s.heading}
              </h2>
              <p className="text-white/55 leading-relaxed text-[14px] pl-7">{s.content}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-14 pt-6 border-t border-white/[0.05]">
          <p className="text-[11px] text-muted/30">
            Powered by <span className="text-muted/50 font-semibold">Nyxen</span>
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

export const Privacy: React.FC = () => (
  <LegalPage
    title="Privacy Policy"
    sections={[
      {
        heading: 'Data We Collect',
        content: 'KyaDekhu collects minimal data: your watch preferences, saved titles, and recommendation history. We do not sell your data to third parties under any circumstances.',
      },
      {
        heading: 'How We Use Your Data',
        content: 'Your preferences are used solely to improve recommendations and personalize your experience. All AI inference is done server-side using Groq API with anonymized inputs.',
      },
      {
        heading: 'Cookies',
        content: 'We use session cookies for authentication and preference storage. No third-party tracking cookies are set.',
      },
      {
        heading: 'Third-Party Services',
        content: 'We use TMDb for movie metadata, Groq for AI inference, Clerk for authentication, and Firestore for data storage. Each service has its own privacy policy.',
      },
      {
        heading: 'Your Rights',
        content: 'You may request deletion of your account and all associated data at any time by contacting us. We will process deletion within 30 days.',
      },
    ]}
  />
);

export const Terms: React.FC = () => (
  <LegalPage
    title="Terms of Service"
    sections={[
      {
        heading: 'Acceptance of Terms',
        content: 'By using KyaDekhu, you agree to these terms. If you do not agree, please do not use the service.',
      },
      {
        heading: 'Service Description',
        content: 'KyaDekhu provides AI-powered entertainment discovery and OTT streaming availability information. We do not host, stream, or distribute any content.',
      },
      {
        heading: 'User Conduct',
        content: 'You agree not to misuse the service, attempt to reverse engineer the recommendation engine, or use automated means to scrape content.',
      },
      {
        heading: 'Content Accuracy',
        content: 'Streaming availability information is provided on a best-effort basis. OTT availability changes frequently and we cannot guarantee accuracy at all times.',
      },
      {
        heading: 'Limitation of Liability',
        content: 'KyaDekhu and Nyxen are not liable for any direct or indirect damages arising from use of the service. The service is provided as-is.',
      },
    ]}
  />
);
