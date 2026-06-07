import React from 'react';
import { motion } from 'framer-motion';
import type { OTTProviderId } from '../../types';

interface OTTBadgeProps {
  provider: OTTProviderId;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// ─── Brand-accurate colors & SVG icons for all 15 providers ───────────────────
const PROVIDERS: Record<OTTProviderId, { label: string; bg: string; fg: string; icon: React.ReactNode }> = {
  netflix: {
    label: 'Netflix',
    bg: '#E50914',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 111 30" fill="white" width="100%" height="100%">
        <path d="M105.06 14.28L111 30c-1.75-.25-3.5-.56-5.28-.85l-3.34-8.68-3.44 7.97c-1.69-.28-3.34-.38-5.03-.6l6.03-13.75L94.47 0h5.06l3.06 7.87L105.88 0h5.12l-5.94 14.28zM90.47 0h-4.59v27.25c1.5.09 3.06.16 4.59.34V0zm-8.94 26.94c-4.19-.28-8.38-.53-12.66-.63V0h4.69v22.5c2.66.09 5.37.31 7.97.53v3.91zM64.38 10.66v3.94H57.47v11.59c-1.56 0-3.09 0-4.59.06V0h13.5v3.94h-8.91v6.72h6.91zM44.19 0H39.5v26.56c1.5 0 3.06-.06 4.69-.06V0zm-8.13 0h-4.69v22.97c1.53-.06 3.09-.13 4.69-.13V0zM22.63 19.88L16.25 0h-5.19v27.41c1.5.25 2.94.5 4.44.75V9.31l6.69 19.44c1.87.31 3.66.72 5.47 1.09V0H23v19.88zM0 0v28.25c1.5.28 3.06.5 4.59.75V18.5H10.5v-3.94H4.59V3.94h6.47V0H0z"/>
      </svg>
    ),
  },
  prime: {
    label: 'Prime Video',
    bg: '#00A8E1',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M13.96 10.09c0 1.23.03 2.26-.59 3.35-.5.89-1.3 1.44-2.19 1.44-1.21 0-1.92-.92-1.92-2.29 0-2.69 2.41-3.18 4.7-3.18v.68zm3.19 7.71a.66.66 0 01-.77.07c-1.08-.9-1.28-1.32-1.87-2.18-1.79 1.82-3.05 2.37-5.37 2.37-2.74 0-4.87-1.69-4.87-5.07 0-2.65 1.43-4.45 3.48-5.33 1.77-.77 4.25-.91 6.14-1.12V6.35c0-.77.06-1.68-.39-2.35-.4-.6-1.16-.85-1.83-.85-1.24 0-2.35.64-2.62 1.96-.06.29-.27.58-.57.6l-3.17-.34c-.27-.06-.56-.28-.49-.68C5.56 1.38 9.03.22 12.14.22c1.59 0 3.67.42 4.93 1.63 1.59 1.48 1.44 3.46 1.44 5.62v5.09c0 1.53.63 2.2 1.23 3.02.21.3.26.65-.01.87l-2.57 2.2z"/>
        <path d="M21.5 19.5a17 17 0 01-5.25 2.24 17.6 17.6 0 01-9.83-.28c-.35-.12-.51.22-.19.45A13.5 13.5 0 0012.5 24c3.3 0 6.34-1.35 8.52-3.54.3-.32.02-.7-.52-.96z"/>
      </svg>
    ),
  },
  disney: {
    label: 'Disney+',
    bg: '#113CCF',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M4.14 7.33C2.38 8.18 1 9.77 1 11.72c0 2.84 2.56 4.47 5.63 4.47 1.17 0 2.26-.28 3.19-.78L12 16.5l2.18-1.09A6.45 6.45 0 0017.37 16c3.07 0 5.63-1.63 5.63-4.47 0-1.95-1.38-3.54-3.14-4.39C19.25 4.49 16.97 3 12 3s-7.25 1.49-7.86 4.33zm7.86 5.84c-2.56 0-4.63-1.24-4.63-2.78s2.07-2.78 4.63-2.78 4.63 1.24 4.63 2.78-2.07 2.78-4.63 2.78z"/>
      </svg>
    ),
  },
  jiohotstar: {
    label: 'JioHotstar',
    bg: '#1E2BC2',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>
    ),
  },
  sonyliv: {
    label: 'SonyLIV',
    bg: '#0F2BCF',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
        <path d="M7 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
      </svg>
    ),
  },
  zee5: {
    label: 'Zee5',
    bg: '#7B2D8B',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M5 3h14l-9 9 9 9H5l9-9z"/>
      </svg>
    ),
  },
  appletv: {
    label: 'Apple TV+',
    bg: '#000000',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  mxplayer: {
    label: 'MX Player',
    bg: '#262626',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M8 5v14l11-7z"/>
        <circle cx="8" cy="12" r="2" fill="rgba(255,255,255,0.4)"/>
      </svg>
    ),
  },
  youtube: {
    label: 'YouTube',
    bg: '#FF0000',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14C4.5 20.45 12 20.45 12 20.45s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
      </svg>
    ),
  },
  hulu: {
    label: 'Hulu',
    bg: '#1CE783',
    fg: '#000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="black" width="100%" height="100%">
        <path d="M3 3h4v7.5c0 .83.67 1.5 1.5 1.5S10 11.33 10 10.5V3h4v7.5C14 13.43 12.43 15 10.5 15S7 13.43 7 11.45V11H3V3zm11 0h4v7.5c0 .83.67 1.5 1.5 1.5S21 11.33 21 10.5V3h-7V3z"/>
        <path d="M3 16h18v5H3z"/>
      </svg>
    ),
  },
  max: {
    label: 'Max',
    bg: '#002BE7',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M2 6l5 12h2L14 6h-2.5l-3 8-3-8H2zM16 6l3 5 3-5h-2l-1.5 2.5L17 6h-1zm-1 6l-1.5 6H16l3-6h-2l-1 4-1-4h-1z"/>
      </svg>
    ),
  },
  paramount: {
    label: 'Paramount+',
    bg: '#0064FF',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M12 2L3 9.5v.5h2v10h14V10h2v-.5L12 2zm0 2.5l6 4.5v.5H6V9l6-4.5zM8 11h8v7H8v-7z"/>
      </svg>
    ),
  },
  peacock: {
    label: 'Peacock',
    bg: '#000000',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <circle cx="12" cy="8" r="2"/>
        <path d="M12 10c-4.4 0-8 2.4-8 5.4 0 1.8 1 3.3 2.6 4.2L12 22l5.4-2.4c1.6-.9 2.6-2.4 2.6-4.2C20 12.4 16.4 10 12 10z" opacity=".6"/>
        <path d="M12 10c0-3.3-2.7-6-6-6s-6 2.7-6 6v.6C2.4 9 5 8 8 8s5.6 1 7.4 2.5c.4-.8.6-1.6.6-2.5z" opacity=".8"/>
        <path d="M12 10c0-3.3 2.7-6 6-6s6 2.7 6 6v.6c-1.6-1.6-4.2-2.6-7.4-2.6-.6 0-1.1 0-1.6.1C14.4 8.8 14 9.4 14 10h-2z" opacity=".9"/>
      </svg>
    ),
  },
  crunchyroll: {
    label: 'Crunchyroll',
    bg: '#F47521',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="5" fill="#F47521"/>
        <circle cx="12" cy="12" r="2" fill="white"/>
        <path d="M12 4a8 8 0 010 16 6.5 6.5 0 01-4.6-1.9A8 8 0 0012 4z" fill="rgba(255,255,255,0.15)"/>
      </svg>
    ),
  },
  lionsgate: {
    label: 'Lionsgate Play',
    bg: '#FF6B00',
    fg: '#FFFFFF',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="100%" height="100%">
        <path d="M4 4h6v14H4V4zm10 0l6 7-6 7V4z"/>
      </svg>
    ),
  },
};

// ─── Size maps ────────────────────────────────────────────────────────────────
const SIZE = {
  xs: { wrap: 'w-4 h-4', radius: 'rounded', pad: 'p-0.5' },
  sm: { wrap: 'w-5 h-5', radius: 'rounded-md', pad: 'p-[3px]' },
  md: { wrap: 'w-7 h-7', radius: 'rounded-lg', pad: 'p-1' },
  lg: { wrap: 'w-9 h-9', radius: 'rounded-xl', pad: 'p-1.5' },
};

// ─── Single badge ─────────────────────────────────────────────────────────────
export const OTTBadge: React.FC<OTTBadgeProps> = ({ provider, size = 'sm', showLabel = false }) => {
  const p = PROVIDERS[provider];
  const s = SIZE[size];
  if (!p) return null;

  return (
    <div className="group relative inline-flex items-center gap-1.5 flex-shrink-0" title={p.label}>
      <motion.div
        whileHover={{ scale: 1.15, y: -1 }}
        transition={{ duration: 0.15 }}
        className={`${s.wrap} ${s.radius} ${s.pad} flex items-center justify-center flex-shrink-0 ring-1 ring-black/20`}
        style={{ backgroundColor: p.bg, color: p.fg }}
      >
        {p.icon}
      </motion.div>
      {showLabel && (
        <span className="text-xs font-medium text-white/70 whitespace-nowrap">{p.label}</span>
      )}
      {/* Tooltip (when no label shown) */}
      {!showLabel && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 z-50
                        bg-[#1a1a1a] border border-white/10 rounded-lg text-[11px] font-medium text-white
                        whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
                        transition-all duration-150 shadow-xl translate-y-1 group-hover:translate-y-0">
          {p.label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4
                          border-l-transparent border-r-transparent border-t-[#1a1a1a]" />
        </div>
      )}
    </div>
  );
};

// ─── Badge list ───────────────────────────────────────────────────────────────
interface OTTBadgeListProps {
  providers: OTTProviderId[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  max?: number;
}

export const OTTBadgeList: React.FC<OTTBadgeListProps> = ({ providers, size = 'sm', max = 3 }) => {
  const visible = providers.slice(0, max);
  const overflow = providers.length - max;

  return (
    <div className="flex items-center gap-1">
      {visible.map(p => (
        <OTTBadge key={p} provider={p} size={size} />
      ))}
      {overflow > 0 && (
        <span className="text-[10px] font-semibold text-muted bg-white/[0.06] px-1.5 py-0.5 rounded-md border border-white/[0.08]">
          +{overflow}
        </span>
      )}
    </div>
  );
};

// Export provider data for use elsewhere
export { PROVIDERS as OTT_PROVIDER_DATA };
