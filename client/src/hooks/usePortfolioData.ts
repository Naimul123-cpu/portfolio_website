import { useState, useEffect } from 'react';
import api from '../services/api';
import type { IProfile, IStudy, IExperience, IProject } from '../types';

export const usePortfolioData = () => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [studies, setStudies] = useState<IStudy[]>([]);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, studyRes, expRes, projRes] = await Promise.all([
        api.get('/profile'),
        api.get('/study'),
        api.get('/experience'),
        api.get('/projects'),
      ]);

      setProfile(profileRes.data);
      setStudies(studyRes.data);
      setExperiences(expRes.data);
      setProjects(projRes.data);
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { profile, studies, experiences, projects, loading, error, refresh: fetchData };
};
