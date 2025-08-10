import { useCallback, useRef, useEffect } from 'react';
import anime from 'animejs';
import { AnimationConfig, AnimationPreset } from '@/types/animations';

export const useAnimations = () => {
  const animationsRef = useRef<any[]>([]);

  const createAnimation = useCallback((element: HTMLElement, config: AnimationConfig) => {
    const animation = anime({
      targets: element,
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
      fadeIn: {
        opacity: [0, 1],
        duration: config.duration || 400,
        easing: config.easing || 'easeOutQuad',
      },
      slideUp: {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: config.duration || 400,
        easing: config.easing || 'easeOutBack',
      },
      slideDown: {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: config.duration || 400,
        easing: config.easing || 'easeOutBack',
      },
      slideLeft: {
        opacity: [0, 1],
        translateX: [20, 0],
        duration: config.duration || 400,
        easing: config.easing || 'easeOutBack',
      },
      slideRight: {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: config.duration || 400,
        easing: config.easing || 'easeOutBack',
      },
      scaleIn: {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: config.duration || 400,
        easing: config.easing || 'easeOutBack',
      },
      rotateIn: {
        opacity: [0, 1],
        rotate: [180, 0],
        duration: config.duration || 600,
        easing: config.easing || 'easeOutBack',
      },
    };

    const animation = anime({
      targets: element,
      ...presets[preset],
      ...config,
    });

    animationsRef.current.push(animation);
    return animation;
  }, []);

  const animateSidebarToggle = useCallback((
    element: HTMLElement,
    isExpanded: boolean,
    config: AnimationConfig = {}
  ) => {
    return anime({
      targets: element,
      width: isExpanded ? '256px' : '64px',
      duration: config.duration || 300,
      easing: config.easing || 'easeOutQuad',
    });
  }, []);

  const createHoverAnimation = useCallback((
    element: HTMLElement,
    hoverConfig: AnimationConfig,
    normalConfig: AnimationConfig
  ) => {
    const enterAnimation = anime({
      targets: element,
      ...hoverConfig,
      autoplay: false,
    });

    const leaveAnimation = anime({
      targets: element,
      ...normalConfig,
      autoplay: false,
    });

    const handleMouseEnter = () => {
      leaveAnimation.pause();
      enterAnimation.play();
    };

    const handleMouseLeave = () => {
      enterAnimation.pause();
      leaveAnimation.play();
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      enterAnimation.pause();
      leaveAnimation.pause();
    };
  }, []);

  const cleanupAnimations = useCallback(() => {
    animationsRef.current.forEach(animation => {
      if (animation && animation.pause) {
        animation.pause();
      }
    });
    animationsRef.current = [];
  }, []);

  useEffect(() => {
    return cleanupAnimations;
  }, [cleanupAnimations]);

  return {
    createAnimation,
    animateEntrance,
    animateSidebarToggle,
    createHoverAnimation,
    cleanupAnimations,
  };
};
