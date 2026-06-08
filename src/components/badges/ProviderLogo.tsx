import React from 'react';
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
  sm: 'h-5.5',
  md: 'h-7',
  lg: 'h-9',
};

export const ProviderLogo: React.FC<ProviderLogoProps> = ({ 
  provider, 
  className = '', 
  size = 'sm' 
}) => {
  const p = PROVIDER_REGISTRY[provider];
  if (!p) return null;
  
  return (
    <div className={`inline-flex items-center justify-center shrink-0 select-none ${LOGO_HEIGHT_MAP[size]} ${className}`}>
      <img 
        src={p.logo} 
        alt={p.name} 
        className="h-full w-auto object-contain max-w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
      />
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
  subscription: 'Subscription',
  rent: 'Rent',
  buy: 'Buy',
};

const TYPE_COLORS = {
  free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]',
  subscription: 'bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_12px_rgba(139,92,246,0.05)]',
  rent: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]',
  buy: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.05)]',
};

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ 
  provider, 
  showLabel = true, 
  size = 'sm',
  className = ''
}) => {
  const p = PROVIDER_REGISTRY[provider];
  if (!p) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.07] cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 ${className}`}
    >
      <ProviderLogo provider={provider} size={size} />
      
      {showLabel && (
        <span className="text-[12px] font-semibold text-white/90 tracking-wide">
          {p.name}
        </span>
      )}

      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${TYPE_COLORS[p.type]}`}>
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

export const ProviderPill: React.FC<ProviderPillProps> = ({ 
  provider, 
  size = 'sm',
  className = ''
}) => {
  const p = PROVIDER_REGISTRY[provider];
  if (!p) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -1, boxShadow: '0 4px 15px rgba(255,255,255,0.03)' }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200 ${className}`}
    >
      <ProviderLogo provider={provider} size={size === 'md' ? 'md' : 'xs'} />
      <span className="text-[11px] font-medium text-white/85">
        {p.name}
      </span>
      <span className="text-[10px] text-white/40">•</span>
      <span className={`text-[10px] font-semibold tracking-wider capitalize ${
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
