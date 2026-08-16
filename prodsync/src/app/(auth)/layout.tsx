import React from 'react';
import '@/app/neumorphism.css';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="neu-page-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '130px',
          paddingBottom: '5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '560px' }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
