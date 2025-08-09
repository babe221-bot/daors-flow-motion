// Custom hook for managing anime.js animations
import { useRef, useCallback, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import type { AnimeInstance } from 'animejs';
import { AnimationConfig, AnimatedElementConfig, AnimationTrigger } from '@/types/animations';

interface UseAnimationsOptions {
  autoCleanup?: boolean;
  defaultConfig?: Partial<AnimationConfig>;
}

export const useAnimations = (options: UseAnimationsOptions = {}) => {
  const { autoCleanup = true, defaultConfig = {} } = options;
  const animationsRef = useRef<Map<string, AnimeInstance>>(new Map());
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());

  // Default animation configuration
  const defaultAnimationConfig: AnimationConfig = {
    duration: 300,
    easing: 'easeOutQuad',
    autoplay: true,
    ...defaultConfig,
  };

  // Create animation with unique ID
  const createAnimation = useCallback((
    id: string,
    targets: string | HTMLElement | NodeListOf<HTMLElement>,
    config: Partial<AnimationConfig> & Record<string, any>
  ): AnimeInstance => {
    // Stop existing animation with same ID
    const existingAnimation = animationsRef.current.get(id);
    if (existingAnimation) {
      existingAnimation.pause();
      animationsRef.current.delete(id);
    }

    const animation = anime({
      targets,
      ...defaultAnimationConfig,
      ...config,
    });

    animationsRef.current.set(id, animation);
    return animation;
  }, [defaultAnimationConfig]);

  // Play animation by ID
  const playAnimation = useCallback((id: string) => {
    const animation = animationsRef.current.get(id);
    if (animation) {
      animation.play();
    }
  }, []);

  // Pause animation by ID
  const pauseAnimation = useCallback((id: string) => {
    const animation = animationsRef.current.get(id);
    if (animation) {
      animation.pause();
    }
  }, []);

  // Stop animation by ID
  const stopAnimation = useCallback((id: string) => {
    const animation = animationsRef.current.get(id);
    if (animation) {
      animation.pause();
      animation.seek(0);
    }
  }, []);

  // Remove animation by ID
  const removeAnimation = useCallback((id: string) => {
    const animation = animationsRef.current.get(id);
    if (animation) {
      animation.pause();
      animationsRef.current.delete(id);
    }
  }, []);

  // Create hover animation
  const createHoverAnimation = useCallback((
    element: HTMLElement,
    enterConfig: Partial<AnimationConfig> & Record<string, any>,
    leaveConfig: Partial<AnimationConfig> & Record<string, any>
  ) => {
    const enterId = `hover-enter-${Date.now()}`;
    const leaveId = `hover-leave-${Date.now()}`;

    const handleMouseEnter = () => {
      removeAnimation(leaveId);
      createAnimation(enterId, element, {
        ...enterConfig,
        autoplay: true,
      });
    };

    const handleMouseLeave = () => {
      removeAnimation(enterId);
      createAnimation(leaveId, element, {
        ...leaveConfig,
        autoplay: true,
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      removeAnimation(enterId);
      removeAnimation(leaveId);
    };
  }, [createAnimation, removeAnimation]);

  // Create scroll-triggered animation
  const createScrollAnimation = useCallback((
    element: HTMLElement,
    config: AnimatedElementConfig,
    threshold: number = 0.1
  ) => {
    const animationId = `scroll-${Date.now()}`;
    let hasTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!hasTriggered || !config.once)) {
            createAnimation(animationId, element, {
              ...config.animation,
              autoplay: true,
            });
            hasTriggered = true;
          }
        });
      },
      { threshold }
    );

    observer.observe(element);
    observersRef.current.set(animationId, observer);

    return () => {
      observer.disconnect();
      observersRef.current.delete(animationId);
      removeAnimation(animationId);
    };
  }, [createAnimation, removeAnimation]);

  // Create staggered animation
  const createStaggeredAnimation = useCallback((
    elements: NodeListOf<HTMLElement> | HTMLElement[],
    config: Partial<AnimationConfig> & Record<string, any>,
    staggerDelay: number = 100
  ) => {
    const id = `stagger-${Date.now()}`;
    
    return createAnimation(id, elements, {
      ...config,
      delay: anime.stagger(staggerDelay),
    });
  }, [createAnimation]);

  // Create timeline animation
  const createTimeline = useCallback((config: Partial<AnimationConfig> = {}) => {
    const timeline = anime.timeline({
      ...defaultAnimationConfig,
      ...config,
    });

    const timelineId = `timeline-${Date.now()}`;
    animationsRef.current.set(timelineId, timeline as any);

    return {
      timeline,
      id: timelineId,
      add: (animationConfig: any) => timeline.add(animationConfig),
    };
  }, [defaultAnimationConfig]);

  // Animate element entrance
  const animateEntrance = useCallback((
    element: HTMLElement,
    type: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' = 'fadeIn',
    config: Partial<AnimationConfig> = {}
  ) => {
    const id = `entrance-${Date.now()}`;
    
    const animations = {
      fadeIn: { opacity: [0, 1] },
      slideUp: { opacity: [0, 1], translateY: [30, 0] },
      slideDown: { opacity: [0, 1], translateY: [-30, 0] },
      slideLeft: { opacity: [0, 1], translateX: [30, 0] },
      slideRight: { opacity: [0, 1], translateX: [-30, 0] },
      scaleIn: { opacity: [0, 1], scale: [0.8, 1] },
    };

    return createAnimation(id, element, {
      ...animations[type],
      ...config,
    });
  }, [createAnimation]);

  // Animate element exit
  const animateExit = useCallback((
    element: HTMLElement,
    type: 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleOut' = 'fadeOut',
    config: Partial<AnimationConfig> = {}
  ) => {
    const id = `exit-${Date.now()}`;
    
    const animations = {
      fadeOut: { opacity: [1, 0] },
      slideUp: { opacity: [1, 0], translateY: [0, -30] },
      slideDown: { opacity: [1, 0], translateY: [0, 30] },
      slideLeft: { opacity: [1, 0], translateX: [0, -30] },
      slideRight: { opacity: [1, 0], translateX: [0, 30] },
      scaleOut: { opacity: [1, 0], scale: [1, 0.8] },
    };

    return createAnimation(id, element, {
      ...animations[type],
      ...config,
    });
  }, [createAnimation]);

  // Cleanup all animations
  const cleanup = useCallback(() => {
    animationsRef.current.forEach((animation) => {
      animation.pause();
    });
    animationsRef.current.clear();

    observersRef.current.forEach((observer) => {
      observer.disconnect();
    });
    observersRef.current.clear();
  }, []);

  // Auto cleanup on unmount
  useEffect(() => {
    if (autoCleanup) {
      return cleanup;
    }
  }, [autoCleanup, cleanup]);

  return {
    // Core animation methods
    createAnimation,
    playAnimation,
    pauseAnimation,
    stopAnimation,
    removeAnimation,
    
    // Specialized animation methods
    createHoverAnimation,
    createScrollAnimation,
    createStaggeredAnimation,
    createTimeline,
    
    // Convenience methods
    animateEntrance,
    animateExit,
    
    // Utility
    cleanup,
    
    // State
    activeAnimations: animationsRef.current,
  };
};