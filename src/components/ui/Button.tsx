import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:opacity-50 disabled:pointer-events-none",
        {
          // Variants
          "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25": variant === 'primary',
          "bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.08]": variant === 'secondary',
          "hover:bg-white/[0.05] text-white/80 hover:text-white": variant === 'ghost',
          "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30": variant === 'danger',
          
          // Sizes
          "px-3 py-1.5 text-[11px]": size === 'sm',
          "px-5 py-3 text-[12.5px]": size === 'md',
          "px-7 py-4 text-[14px]": size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
