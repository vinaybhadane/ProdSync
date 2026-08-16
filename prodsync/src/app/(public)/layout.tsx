import React from 'react';
import '@/app/neumorphism.css';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="neu-page-wrapper">
      <Navbar />
      <main style={{ paddingTop: '100px', minHeight: '80vh' }}>{children}</main>
      <Footer />
    </div>
  );
}
