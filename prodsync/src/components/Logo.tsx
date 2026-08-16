import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: '1rem' },
  md: { icon: 32, text: '1.25rem' },
  lg: { icon: 40, text: '1.5rem' },
};

export default function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const s = sizes[size];
  const textColor = variant === 'light' ? '#f8fafc' : '#0f172a';
  const subColor = variant === 'light' ? 'rgba(248,250,252,0.5)' : '#64748b';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* SVG Icon mark */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background square with rounded corners */}
        <rect width="40" height="40" rx="10" fill="#2563eb" />

        {/* Grid of data nodes */}
        <rect x="8" y="8" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
        <rect x="18" y="8" width="8" height="8" rx="2" fill="white" fillOpacity="0.6" />
        <rect x="28" y="8" width="4" height="8" rx="2" fill="white" fillOpacity="0.3" />

        {/* Center row — highlighted sync row */}
        <rect x="8" y="18" width="4" height="8" rx="2" fill="white" fillOpacity="0.3" />
        <rect x="14" y="18" width="12" height="8" rx="2" fill="white" fillOpacity="0.95" />
        <rect x="28" y="18" width="4" height="8" rx="2" fill="white" fillOpacity="0.3" />

        {/* Bottom row */}
        <rect x="8" y="28" width="4" height="4" rx="1.5" fill="white" fillOpacity="0.3" />
        <rect x="14" y="28" width="8" height="4" rx="1.5" fill="white" fillOpacity="0.6" />
        <rect x="24" y="28" width="8" height="4" rx="1.5" fill="white" fillOpacity="0.9" />

        {/* Sync arrows on center block */}
        <path
          d="M16.5 20.5 L19 23 L21.5 20.5"
          stroke="#2563eb"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M16.5 23 L19 20.5 L21.5 23"
          stroke="#2563eb"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Text mark */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontSize: s.text,
              fontWeight: 700,
              color: textColor,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ProdSync
          </span>
          {size === 'lg' && (
            <span
              style={{
                fontSize: '0.6875rem',
                color: subColor,
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '1px',
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
