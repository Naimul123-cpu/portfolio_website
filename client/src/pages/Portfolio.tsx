import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import StudySection from '../components/sections/StudySection';
import ExperienceSection from '../components/sections/ExperienceSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import Footer from '../components/layout/Footer';
import { usePortfolioData } from '../hooks/usePortfolioData';

const Portfolio: React.FC = () => {
  const { profile, studies, experiences, projects, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-accent-primary font-mono animate-pulse">Initializing futuristic experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center text-accent-tertiary">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-bg-primary">
      <Header />
      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <StudySection studies={studies} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default Portfolio;
