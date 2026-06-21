import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider",
        {
          "bg-white/[0.06] text-white/80 border border-white/[0.08]": variant === 'default',
          "bg-accent/15 text-accent-light border border-accent/25": variant === 'accent',
          "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20": variant === 'success',
          "bg-amber-500/10 text-amber-300 border border-amber-500/20": variant === 'warning',
          "border border-white/20 text-white/90": variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
