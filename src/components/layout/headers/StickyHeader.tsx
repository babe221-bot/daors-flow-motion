// Sticky header component with anime.js animations
import React, { useEffect, useRef, useState } from 'react';
import { useAnimations } from '@/hooks/useAnimations';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { animateHeaderSticky, animateStickyScroll } from '@/lib/animations/layoutAnimations';
import { cn } from '@/lib/utils';
import { StickyConfig } from '@/types/layout';

interface StickyHeaderProps {
  children: React.ReactNode;
  config?: StickyConfig;
  className?: string;
  threshold?: number;
  showProgress?: boolean;
  onStickyChange?: (isSticky: boolean) => void;
}

const defaultConfig: StickyConfig = {
  top: 0,
  zIndex: 50,
  backgroundColor: 'rgba(var(--background), 0.95)',
  backdropBlur: true,
};

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  children,
  config = {},
  className,
  threshold = 20,
  showProgress = false,
  onStickyChange,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const { createAnimation } = useAnimations();
  const { isMobile } = useResponsiveLayout();

  const [isSticky, setIsSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const mergedConfig = { ...defaultConfig, ...config };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newIsSticky = scrollY > threshold;
      
      // Calculate scroll progress for animations
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / documentHeight, 1);
      
      setScrollProgress(progress);

      if (newIsSticky !== isSticky) {
        setIsSticky(newIsSticky);
        onStickyChange?.(newIsSticky);

        // Animate sticky transition
        if (headerRef.current) {
          animateHeaderSticky(headerRef.current, newIsSticky);
        }
      } else if (newIsSticky && headerRef.current) {
        // Animate scroll progress
        animateStickyScroll(headerRef.current, progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky, threshold, onStickyChange]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'sticky transition-all duration-300 ease-out',
          isSticky && 'shadow-sm border-b border-border/50',
          className
        )}
        style={{
          top: mergedConfig.top,
          zIndex: mergedConfig.zIndex,
          backgroundColor: isSticky ? mergedConfig.backgroundColor : 'transparent',
          backdropFilter: isSticky && mergedConfig.backdropBlur ? 'blur(12px)' : 'none',
        }}
        data-sticky-header
        data-is-sticky={isSticky}
      >
        {children}
        
        {/* Progress bar */}
        {showProgress && isSticky && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-100 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        )}
      </header>
    </>
  );
};

// Sticky header with slide animation
export const SlideInHeader: React.FC<StickyHeaderProps> = ({
  children,
  config = {},
  className,
  threshold = 100,
  onStickyChange,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const { createAnimation } = useAnimations();

  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const mergedConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrollingUp = scrollY < lastScrollY;
      const shouldShow = scrollY > threshold && isScrollingUp;

      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
        onStickyChange?.(shouldShow);

        if (headerRef.current) {
          createAnimation('slide-header', headerRef.current, {
            translateY: shouldShow ? ['-100%', '0%'] : ['0%', '-100%'],
            opacity: shouldShow ? [0, 1] : [1, 0],
            duration: 300,
            easing: 'easeOutQuart',
          });
        }
      }

      setLastScrollY(scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, lastScrollY, threshold, onStickyChange, createAnimation]);

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 right-0 transform -translate-y-full opacity-0',
        'bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50',
        className
      )}
      style={{
        zIndex: mergedConfig.zIndex,
      }}
      data-slide-header
    >
      {children}
    </header>
  );
};

// Expandable header that grows on scroll
export const ExpandableHeader: React.FC<StickyHeaderProps & {
  expandedHeight?: number;
  collapsedHeight?: number;
}> = ({
  children,
  config = {},
  className,
  threshold = 50,
  expandedHeight = 120,
  collapsedHeight = 64,
  onStickyChange,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const { createAnimation } = useAnimations();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const mergedConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldCollapse = scrollY > threshold;

      if (shouldCollapse !== isCollapsed) {
        setIsCollapsed(shouldCollapse);
        onStickyChange?.(shouldCollapse);

        if (headerRef.current) {
          createAnimation('expand-header', headerRef.current, {
            height: shouldCollapse ? collapsedHeight : expandedHeight,
            paddingTop: shouldCollapse ? '8px' : '16px',
            paddingBottom: shouldCollapse ? '8px' : '16px',
            duration: 300,
            easing: 'easeOutQuart',
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCollapsed, threshold, expandedHeight, collapsedHeight, onStickyChange, createAnimation]);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 transition-all duration-300 ease-out',
        'bg-background/95 backdrop-blur-md',
        isCollapsed && 'shadow-sm border-b border-border/50',
        className
      )}
      style={{
        height: expandedHeight,
        zIndex: mergedConfig.zIndex,
      }}
      data-expandable-header
      data-is-collapsed={isCollapsed}
    >
      <div className="h-full flex items-center">
        {children}
      </div>
    </header>
  );
};

// Header with parallax effect
export const ParallaxHeader: React.FC<StickyHeaderProps & {
  parallaxSpeed?: number;
  backgroundImage?: string;
}> = ({
  children,
  config = {},
  className,
  parallaxSpeed = 0.5,
  backgroundImage,
  onStickyChange,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      if (backgroundRef.current) {
        const yPos = -(scrollY * parallaxSpeed);
        backgroundRef.current.style.transform = `translateY(${yPos}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallaxSpeed]);

  return (
    <header
      ref={headerRef}
      className={cn('relative overflow-hidden', className)}
      data-parallax-header
    >
      {backgroundImage && (
        <div
          ref={backgroundRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </header>
  );
};