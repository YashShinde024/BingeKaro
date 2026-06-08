import React from 'react';
import type { OTTProviderId } from '../../types';
import { ProviderBadge, ProviderPill } from './ProviderLogo';

interface OTTBadgeProps {
  provider: OTTProviderId;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'badge' | 'pill';
}

export const OTTBadge: React.FC<OTTBadgeProps> = ({ 
  provider, 
  size = 'sm', 
  showLabel = false,
  variant = 'badge'
}) => {
  if (variant === 'pill') {
    return <ProviderPill provider={provider} size={size === 'xs' ? 'sm' : 'md'} />;
  }
  return <ProviderBadge provider={provider} size={size} showLabel={showLabel} />;
};

interface OTTBadgeListProps {
  providers: OTTProviderId[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  max?: number;
  variant?: 'badge' | 'pill';
  showLabel?: boolean;
}

export const OTTBadgeList: React.FC<OTTBadgeListProps> = ({ 
  providers, 
  size = 'sm', 
  max = 3, 
  variant = 'badge',
  showLabel
}) => {
  const visible = providers.slice(0, max);
  const overflow = providers.length - max;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map(p => (
        <OTTBadge 
          key={p} 
          provider={p} 
          size={size} 
          variant={variant}
          showLabel={showLabel ?? (size === 'lg' || size === 'md')} 
        />
      ))}
      {overflow > 0 && (
        <span className="text-[10px] font-bold text-muted bg-white/[0.04] border border-white/[0.08] px-2 py-1 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          +{overflow}
        </span>
      )}
    </div>
  );
};
