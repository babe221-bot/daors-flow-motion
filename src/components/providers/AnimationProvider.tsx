import React, { createContext, useContext, ReactNode } from 'react';
import { useAnimations } from '@/hooks/useAnimations';

interface AnimationProviderProps {
  children: ReactNode;
}

const AnimationContext = createContext<ReturnType<typeof useAnimations> | undefined>(undefined);

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const animations = useAnimations();

  return (
    <AnimationContext.Provider value={animations}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
};
