'use client';

import { ScrollContainer } from '@/components/ScrollPage';
import { HomeHero } from '@/components/pages/HomeHero';
import { BusinessShowcase } from '@/components/pages/BusinessShowcase';
import { EnvironmentShowcase } from '@/components/pages/EnvironmentShowcase';
import { AboutShowcase } from '@/components/pages/AboutShowcase';
import { CultureShowcase } from '@/components/pages/CultureShowcase';
import { ContactShowcase } from '@/components/pages/ContactShowcase';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';

export default function Page() {
  const pages = [
    <HomeHero key="home" />,
    <BusinessShowcase key="business" />,
    <EnvironmentShowcase key="environment" />,
    <AboutShowcase key="about" />,
    <CultureShowcase key="culture" />,
    <ContactShowcase key="contact" />,
  ];

  return (
    <>
      <Navbar />
      <ScrollContainer>{pages}</ScrollContainer>
      <ScrollProgress />
    </>
  );
}
