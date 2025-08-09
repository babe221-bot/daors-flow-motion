// React-bits inspired interactive background components
import React, { useRef, useEffect, useState } from 'react';
import { useAnimations } from '@/hooks/useAnimations';
import { cn } from '@/lib/utils';

interface InteractiveBackgroundProps {
  variant?: 'dots' | 'grid' | 'waves' | 'particles';
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({
  variant = 'dots',
  intensity = 'medium',
  color = 'rgba(var(--primary), 0.1)',
  className,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { createAnimation } = useAnimations();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const renderBackground = () => {
    switch (variant) {
      case 'dots':
        return <DotsBackground intensity={intensity} color={color} mousePosition={mousePosition} />;
      case 'grid':
        return <GridBackground intensity={intensity} color={color} mousePosition={mousePosition} />;
      case 'waves':
        return <WavesBackground intensity={intensity} color={color} mousePosition={mousePosition} />;
      case 'particles':
        return <ParticlesBackground intensity={intensity} color={color} mousePosition={mousePosition} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      data-interactive-background
    >
      <div className="absolute inset-0 pointer-events-none">
        {renderBackground()}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Dots background component
const DotsBackground: React.FC<{
  intensity: string;
  color: string;
  mousePosition: { x: number; y: number };
}> = ({ intensity, color, mousePosition }) => {
  const dotsRef = useRef<HTMLDivElement>(null);
  const { createAnimation } = useAnimations();

  const dotSizes = {
    low: { size: 2, spacing: 40, count: 20 },
    medium: { size: 3, spacing: 30, count: 35 },
    high: { size: 4, spacing: 20, count: 50 },
  };

  const config = dotSizes[intensity as keyof typeof dotSizes];

  useEffect(() => {
    if (dotsRef.current) {
      const dots = dotsRef.current.querySelectorAll('[data-dot]');
      dots.forEach((dot, index) => {
        const delay = index * 50;
        createAnimation(`dot-${index}`, dot as HTMLElement, {
          scale: [0.5, 1, 0.8],
          opacity: [0.3, 0.8, 0.5],
          duration: 2000 + Math.random() * 1000,
          delay,
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutSine',
        });
      });
    }
  }, [createAnimation]);

  return (
    <div ref={dotsRef} className="absolute inset-0">
      {Array.from({ length: config.count }).map((_, i) => (
        <div
          key={i}
          data-dot
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: config.size,
            height: config.size,
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translate(-50%, -50%) scale(${
              1 + Math.abs(mousePosition.x - Math.random() * 100) / 200
            })`,
          }}
        />
      ))}
    </div>
  );
};

// Grid background component
const GridBackground: React.FC<{
  intensity: string;
  color: string;
  mousePosition: { x: number; y: number };
}> = ({ intensity, color, mousePosition }) => {
  const gridSizes = {
    low: 60,
    medium: 40,
    high: 25,
  };

  const size = gridSizes[intensity as keyof typeof gridSizes];

  return (
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
        transition: 'transform 0.3s ease-out',
      }}
    />
  );
};

// Waves background component
const WavesBackground: React.FC<{
  intensity: string;
  color: string;
  mousePosition: { x: number; y: number };
}> = ({ intensity, color, mousePosition }) => {
  const waveRef = useRef<HTMLDivElement>(null);
  const { createAnimation } = useAnimations();

  useEffect(() => {
    if (waveRef.current) {
      createAnimation('wave-animation', waveRef.current, {
        translateX: ['-100%', '100%'],
        duration: 8000,
        loop: true,
        easing: 'linear',
      });
    }
  }, [createAnimation]);

  const waveIntensity = {
    low: 0.3,
    medium: 0.5,
    high: 0.8,
  };

  const opacity = waveIntensity[intensity as keyof typeof waveIntensity];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={waveRef}
        className="absolute inset-0 w-[200%]"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity,
          transform: `translateY(${mousePosition.y * 0.2}px)`,
        }}
      />
    </div>
  );
};

// Particles background component
const ParticlesBackground: React.FC<{
  intensity: string;
  color: string;
  mousePosition: { x: number; y: number };
}> = ({ intensity, color, mousePosition }) => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const { createAnimation } = useAnimations();

  const particleCounts = {
    low: 15,
    medium: 25,
    high: 40,
  };

  const count = particleCounts[intensity as keyof typeof particleCounts];

  useEffect(() => {
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('[data-particle]');
      particles.forEach((particle, index) => {
        createAnimation(`particle-${index}`, particle as HTMLElement, {
          translateY: [0, -100, 0],
          translateX: [0, Math.random() * 50 - 25, 0],
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          duration: 3000 + Math.random() * 2000,
          delay: index * 200,
          loop: true,
          easing: 'easeInOutQuad',
        });
      });
    }
  }, [createAnimation]);

  return (
    <div ref={particlesRef} className="absolute inset-0">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          data-particle
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: '100%',
            transform: `translateX(${mousePosition.x * 0.1}px)`,
          }}
        />
      ))}
    </div>
  );
};

// Floating elements component
export const FloatingElements: React.FC<{
  elements?: Array<{ icon: React.ReactNode; size?: number }>;
  count?: number;
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
}> = ({
  elements = [],
  count = 8,
  speed = 'medium',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { createAnimation } = useAnimations();

  const speeds = {
    slow: 8000,
    medium: 5000,
    fast: 3000,
  };

  const duration = speeds[speed];

  useEffect(() => {
    if (containerRef.current) {
      const floatingElements = containerRef.current.querySelectorAll('[data-floating]');
      floatingElements.forEach((element, index) => {
        createAnimation(`floating-${index}`, element as HTMLElement, {
          translateY: [0, -30, 0],
          translateX: [0, Math.random() * 20 - 10, 0],
          rotate: [0, Math.random() * 10 - 5, 0],
          duration: duration + Math.random() * 2000,
          delay: index * 500,
          loop: true,
          easing: 'easeInOutSine',
        });
      });
    }
  }, [createAnimation, duration]);

  return (
    <div ref={containerRef} className={cn('absolute inset-0 pointer-events-none', className)}>
      {Array.from({ length: count }).map((_, i) => {
        const element = elements[i % elements.length];
        return (
          <div
            key={i}
            data-floating
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: element?.size || Math.random() * 20 + 10,
            }}
          >
            {element?.icon || '✦'}
          </div>
        );
      })}
    </div>
  );
};