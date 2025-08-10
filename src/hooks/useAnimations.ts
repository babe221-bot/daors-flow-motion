import { useRef, useEffect, useCallback } from 'react';
import anime from 'animejs';
import { AnimationConfig, AnimationPreset } from '@/types/animations';

export const useAnimations = () => {
  const animationsRef = useRef<anime.AnimeInstance[]>([]);

  const createAnimation = useCallback((
    element: HTMLElement,
    config: AnimationConfig
  ) => {
    const animation = anime({
      targets: element,
      duration: config.duration || 300,
      easing: config.easing || 'easeOutQuad',
      ...config,
    });
    
    animationsRef.current.push(animation);
    return animation;
  }, []);

  const animateEntrance = useCallback((
    element: HTMLElement,
    preset: AnimationPreset,
    config: AnimationConfig = {}
  ) => {
    const presets: Record<AnimationPreset, any> = {
      slideUp: {
        translateY: [50, 0],
        opacity: [0, 1],
      },
      slideDown: {
        translateY: [-50, 0],
        opacity: [0, 1],
      },
      slideLeft: {
        translateX: [50, 0],
        opacity: [0, 1],
      },
      slideRight: {
        translateX: [-50, 0],
        opacity: [0, 1],
      },
      fadeIn: {
        opacity: [0, 1],
      },
      scaleIn: {
        scale: [0.8, 1],
        opacity: [0, 1],
      },
      bounce: {
        scale: [0.5, 1.1, 1],
        opacity: [0, 1],
      },
      pulse: {
        scale: [1, 1.05, 1],
      },
    };

    const animation = anime({
      targets: element,
      ...presets[preset],
      duration: config.duration || 300,
      easing: config.easing || 'easeOutBack',
    });

    animationsRef.current.push(animation);
    return animation;
  }, []);

  const createHoverAnimation = useCallback((
    element: HTMLElement,
    hoverConfig: AnimationConfig,
    normalConfig: AnimationConfig
  ) => {
    const handleMouseEnter = () => {
      anime({
        targets: element,
        ...hoverConfig,
        duration: hoverConfig.duration || 200,
      });
    };

    const handleMouseLeave = () => {
      anime({
        targets: element,
        ...normalConfig,
        duration: normalConfig.duration || 200,
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const cleanup = useCallback(() => {
    animationsRef.current.forEach(animation => {
      if (animation && typeof animation.pause === 'function') {
        animation.pause();
      }
    });
    animationsRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    createAnimation,
    animateEntrance,
    createHoverAnimation,
    cleanup,
  };
};
