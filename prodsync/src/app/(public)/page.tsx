import type { Metadata } from 'next';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import AIIntelligenceSection from '@/components/landing/AIIntelligenceSection';
import ExplainableAISection from '@/components/landing/ExplainableAISection';
import CTASection from '@/components/landing/CTASection';

export const metadata: Metadata = {
  title: 'ProdSync — AI-Powered Product Intelligence for Industrial Commerce',
  description:
    'Transform scattered industrial product information into structured, validated, enriched, and commerce-ready product intelligence with AI.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <AIIntelligenceSection />
      <ExplainableAISection />
      <CTASection />
    </>
  );
}
