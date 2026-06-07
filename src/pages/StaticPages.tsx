import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Film, Sparkles, MapPin, Mail } from 'lucide-react';

export const About: React.FC = () => (
  <div className="min-h-screen bg-bg pt-24 pb-24 md:pb-12">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 mb-5">
          <Film className="w-3.5 h-3.5 text-accent-light" />
          <span className="text-xs font-medium text-accent-light">Our Story</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
          We built the tool<br />we always wanted.
        </h1>
        <p className="text-muted text-lg leading-relaxed">
          KyaDekhu started from a simple frustration — spending 45 minutes looking for something to watch,
          only to give up and rewatch something. We knew there was a better way.
        </p>
      </motion.div>

      {/* Mission / Vision */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {[
          {
            label: 'Mission',
            text: 'Help every user find something worth watching in under 30 seconds, using AI that actually understands mood and context.',
          },
          {
            label: 'Vision',
            text: 'Become the default starting point for entertainment discovery across India — combining taste, availability, and intelligence.',
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <p className="text-xs text-accent-light font-bold uppercase tracking-widest mb-3">{item.label}</p>
            <p className="text-white/80 leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Roadmap */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Roadmap</h2>
        <div className="space-y-4">
          {[
            { phase: 'v1.0', label: 'AI Recommendations + OTT Discovery', status: 'Live', done: true },
            { phase: 'v1.5', label: 'Social Watchlist + Friends Activity', status: 'Q3 2025', done: false },
            { phase: 'v2.0', label: 'Personalized AI Model + Groq Integration', status: 'Q4 2025', done: false },
            { phase: 'v2.5', label: 'Mobile App (iOS + Android)', status: '2026', done: false },
            { phase: 'v3.0', label: 'Real-time OTT Availability via APIs', status: '2026', done: false },
          ].map((item, i) => (
            <motion.div
              key={item.phase}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="flex items-start gap-4"
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.done ? 'bg-accent' : 'bg-white/20'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${item.done ? 'text-white' : 'text-muted'}`}>{item.label}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.done ? 'bg-accent/20 text-accent-light border border-accent/30' : 'bg-white/5 text-muted border border-white/10'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-muted/60 mt-0.5">{item.phase}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nyxen */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-white/10 text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent-light" />
          <span className="text-sm font-bold text-white">Part of the Nyxen Ecosystem</span>
        </div>
        <p className="text-muted text-sm max-w-md mx-auto">
          KyaDekhu is built and maintained by Nyxen — a collective building intelligent, beautifully designed products.
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-4 text-sm text-muted">
        <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
          <Mail className="w-4 h-4" /> Contact
        </Link>
        <span className="text-white/20">·</span>
        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> India</span>
      </div>
    </div>
  </div>
);

export const Contact: React.FC = () => {
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-bg pt-24 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-black text-white mb-3">Get in touch</h1>
          <p className="text-muted">Questions, feedback, or partnerships — we read everything.</p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-10 border border-accent/20 text-center"
          >
            <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-accent-light" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message received!</h3>
            <p className="text-muted text-sm">We'll get back to you within 24 hours.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 border border-white/10 space-y-4"
          >
            {[
              { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-muted mb-1.5">{field.label}</label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white 
                             placeholder-muted/60 text-sm outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Message</label>
              <textarea
                placeholder="Tell us what's on your mind..."
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white 
                           placeholder-muted/60 text-sm outline-none focus:border-accent/50 transition-colors resize-none"
              />
            </div>
            <button type="submit" className="w-full btn-primary">
              Send Message
            </button>
          </motion.form>
        )}

        {/* FAQ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'Is KyaDekhu free to use?', a: 'Yes, completely free. We never charge for recommendations.' },
              { q: 'Does KyaDekhu have a mobile app?', a: 'A mobile app is on our roadmap for 2026.' },
              { q: 'How does the AI work?', a: 'We use Groq\'s inference API with TMDb data to match your mood to the best titles.' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/8">
                <p className="text-white font-medium text-sm mb-1">{item.q}</p>
                <p className="text-muted text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const LegalPage: React.FC<{ title: string; sections: { heading: string; content: string }[] }> = ({ title, sections }) => (
  <div className="min-h-screen bg-bg pt-24 pb-24 md:pb-12">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-white mb-2">{title}</h1>
        <p className="text-muted text-sm mb-10">Last updated: June 2025</p>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-white mb-3">{s.heading}</h2>
              <p className="text-muted leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 pt-6 border-t border-white/6">
          <p className="text-xs text-muted/40">Powered by <span className="text-muted/60">Nyxen</span></p>
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
