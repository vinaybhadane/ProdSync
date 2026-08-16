'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'full' | 'icon' | 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const sizes = {
  xs: { icon: 24, text: '0.9375rem', subtext: '0.5625rem' },
  sm: { icon: 30, text: '1.05rem', subtext: '0.625rem' },
  md: { icon: 36, text: '1.25rem', subtext: '0.6875rem' },
  lg: { icon: 44, text: '1.5rem', subtext: '0.75rem' },
  xl: { icon: 54, text: '1.875rem', subtext: '0.875rem' },
};

export default function Logo({ variant = 'full', size = 'md', className = '', showText }: LogoProps) {
  const s = sizes[size] || sizes.md;
  const isIconOnly = variant === 'icon' || showText === false;
  const textColor = variant === 'light' ? '#f8fafc' : '#0f172a';
  const subColor = variant === 'light' ? 'rgba(248,250,252,0.6)' : '#64748b';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon / Logo Mark */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105"
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src="/logo-icon.png"
          alt="ProdSync Logo"
          width={s.icon * 2}
          height={s.icon * 2}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Text mark */}
      {!isIconOnly && (
        <div className="flex flex-col leading-none select-none">
          <span
            style={{
              fontSize: s.text,
              fontWeight: 800,
              color: textColor,
              letterSpacing: '-0.025em',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            ProdSync
          </span>
          {size === 'lg' && (
            <span
              style={{
                fontSize: s.subtext,
                color: subColor,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              Product Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
}

