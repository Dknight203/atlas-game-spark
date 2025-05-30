
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding
      const completed = localStorage.getItem(`onboarding_completed_${user.id}`);
      const hasCompletedBefore = completed === 'true';
      
      setHasCompletedOnboarding(hasCompletedBefore);
      
      // Show onboarding for new users who haven't completed it
      if (!hasCompletedBefore) {
        // Small delay to ensure the UI is ready
        setTimeout(() => setShowOnboarding(true), 500);
      }
    }
  }, [user]);

  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      setHasCompletedOnboarding(true);
      setShowOnboarding(false);
    }
  };

  const skipOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      setHasCompletedOnboarding(true);
      setShowOnboarding(false);
    }
  };

  const resetOnboarding = () => {
    if (user) {
      localStorage.removeItem(`onboarding_completed_${user.id}`);
      setHasCompletedOnboarding(false);
      setShowOnboarding(true);
    }
  };

  return {
    showOnboarding,
    hasCompletedOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
};
