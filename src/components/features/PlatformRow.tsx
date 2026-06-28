"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PROVIDER_REGISTRY } from '../../lib/providers';

export const PlatformRow: React.FC = React.memo(() => {
  return (
    <div className="relative border-b border-border bg-surface/30 z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center gap-5 overflow-x-auto scroll-row">
          <span className="text-[10px] font-extrabold text-muted-foreground/50 uppercase tracking-widest shrink-0 flex items-center gap-1.5">
            Platforms:
          </span>
          <div className="flex items-center gap-3.5">
            {Object.values(PROVIDER_REGISTRY).map(prov => (
              <Link key={prov.id} href={`/discover?provider=${prov.id}`}>
                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-card border border-border hover:border-accent/40 hover:bg-card-hover transition-all duration-300 relative group shrink-0 cursor-pointer"
                >
                  <img src={prov.logo} alt={prov.name} className="w-6 h-6 object-contain" />
                  <span className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-background/95 backdrop-blur-md border border-border text-[9px] font-bold px-2 py-0.5 rounded text-foreground whitespace-nowrap transition-all duration-200 z-50 pointer-events-none">
                    {prov.name}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

PlatformRow.displayName = 'PlatformRow';
