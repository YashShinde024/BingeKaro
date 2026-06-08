import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { OTTProviderId } from '../../types';
import { PROVIDER_REGISTRY } from '../../lib/providers';

interface ProviderLogoProps {
  provider: OTTProviderId;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const LOGO_HEIGHT_MAP = {
  xs: 'h-4',
  sm: 'h-5',
  md: 'h-6',
  lg: 'h-8',
};

const LOGO_TEXT_SIZE_MAP = {
  xs: 'text-[9px]',
  sm: 'text-[10px]',
  md: 'text-[11px]',
  lg: 'text-[13px]',
};

export const ProviderLogo: React.FC<ProviderLogoProps> = ({ 
  provider, 
  className = '', 
  size = 'sm' 
}) => {
  const p = PROVIDER_REGISTRY[provider];
  const [imgError, setImgError] = useState(false);

  if (!p) return null;

  return (
    <div className={`inline-flex items-center justify-center shrink-0 select-none ${LOGO_HEIGHT_MAP[size]} ${className}`}>
      {imgError ? (
        <span className={`font-semibold text-white/80 whitespace-nowrap ${LOGO_TEXT_SIZE_MAP[size]}`}>
          {p.name}
        </span>
      ) : (
        <img 
          src={p.logo} 
          alt={p.name} 
          draggable={false}
          className="h-full w-auto object-contain max-w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

interface ProviderBadgeProps {
  provider: OTTProviderId;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const TYPE_LABELS = {
  free: 'Free',
  subscription: 'Sub',
  rent: 'Rent',
  buy: 'Buy',
};

const TYPE_COLORS = {
  free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  subscription: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  rent: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  buy: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const BADGE_SIZE_MAP = {
  xs: { wrapper: 'gap-1.5 px-2 py-1', logo: 'xs' as const, label: 'text-[10px]', type: 'text-[8px] px-1.5 py-px' },
  sm: { wrapper: 'gap-2 px-2.5 py-1.5', logo: 'sm' as const, label: 'text-[11px]', type: 'text-[8.5px] px-1.5 py-0.5' },
  md: { wrapper: 'gap-2 px-3 py-1.5', logo: 'md' as const, label: 'text-[12px]', type: 'text-[9px] px-2 py-0.5' },
  lg: { wrapper: 'gap-2.5 px-3.5 py-2', logo: 'lg' as const, label: 'text-[13px]', type: 'text-[9.5px] px-2 py-0.5' },
};

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ 
  provider, 
  showLabel = true, 
  size = 'sm',
  className = ''
}) => {
  const p = PROVIDER_REGISTRY[provider];
  if (!p) return null;

  const s = BADGE_SIZE_MAP[size];

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center ${s.wrapper} rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-200 ${className}`}
    >
      <ProviderLogo provider={provider} size={s.logo} />
      
      {showLabel && (
        <span className={`${s.label} font-semibold text-white/90 tracking-wide`}>
          {p.name}
        </span>
      )}

      <span className={`font-bold ${s.type} rounded border uppercase tracking-widest ${TYPE_COLORS[p.type]}`}>
        {TYPE_LABELS[p.type]}
      </span>
    </motion.div>
  );
};

interface ProviderPillProps {
  provider: OTTProviderId;
  size?: 'sm' | 'md';
  className?: string;
}

const PILL_SIZE_MAP = {
  sm: { wrapper: 'gap-1.5 px-2.5 py-1', logo: 'xs' as const, label: 'text-[10.5px]', type: 'text-[9px]' },
  md: { wrapper: 'gap-2 px-3 py-1.5', logo: 'sm' as const, label: 'text-[11.5px]', type: 'text-[9.5px]' },
};

export const ProviderPill: React.FC<ProviderPillProps> = ({ 
  provider, 
  size = 'sm',
  className = ''
}) => {
  const p = PROVIDER_REGISTRY[provider];
  if (!p) return null;

  const s = PILL_SIZE_MAP[size];

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -1, boxShadow: '0 4px 15px rgba(255,255,255,0.03)' }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center ${s.wrapper} rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200 ${className}`}
    >
      <ProviderLogo provider={provider} size={s.logo} />
      <span className={`${s.label} font-medium text-white/85`}>
        {p.name}
      </span>
      <span className="text-[10px] text-white/40">•</span>
      <span className={`${s.type} font-semibold tracking-wider capitalize ${
        p.type === 'free' ? 'text-emerald-400' :
        p.type === 'subscription' ? 'text-violet-400' :
        p.type === 'rent' ? 'text-amber-400' : 'text-blue-400'
      }`}>
        {TYPE_LABELS[p.type]}
      </span>
    </motion.div>
  );
};

export const PROVIDER_INFO = PROVIDER_REGISTRY;
