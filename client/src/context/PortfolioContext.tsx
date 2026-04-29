import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { IProfile, IStudy, IExperience, IProject } from '../types';

interface PortfolioContextType {
  profile: IProfile | null;
  studies: IStudy[];
  experiences: IExperience[];
  projects: IProject[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [studies, setStudies] = useState<IStudy[]>([]);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [profileRes, studyRes, expRes, projRes] = await Promise.all([
        api.get('/profile'),
        api.get('/study'),
        api.get('/experience'),
        api.get('/projects'),
      ]);

      const newData = {
        profile: profileRes.data,
        studies: studyRes.data,
        experiences: expRes.data,
        projects: projRes.data
      };

      setProfile(newData.profile);
      setStudies(newData.studies);
      setExperiences(newData.experiences);
      setProjects(newData.projects);
      
      localStorage.setItem('portfolio_cache', JSON.stringify(newData));
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cachedData = localStorage.getItem('portfolio_cache');
    if (cachedData) {
      try {
        const { profile, studies, experiences, projects } = JSON.parse(cachedData);
        setProfile(profile);
        setStudies(studies);
        setExperiences(experiences);
        setProjects(projects);
        setLoading(false);
        // Refresh in background
        fetchData(false);
      } catch (e) {
        fetchData(true);
      }
    } else {
      fetchData(true);
    }
  }, [fetchData]);

  return (
    <PortfolioContext.Provider value={{ profile, studies, experiences, projects, loading, error, refresh: () => fetchData(true) }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
