import { useState, useEffect } from 'react';

/**
 * Breakpoints baseados no Tailwind CSS
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValues {
  isMobile: boolean;      // < 768px
  isTablet: boolean;      // 768px - 1024px
  isDesktop: boolean;     // > 1024px
  isLargeScreen: boolean; // > 1200px
  width: number;
  breakpoint: Breakpoint;
}

/**
 * Hook personalizado para detectar breakpoints responsivos
 * Otimizado para React 19 e TypeScript
 */
export function useResponsive(): ResponsiveValues {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Adiciona o listener
    window.addEventListener('resize', handleResize);
    
    // Atualiza imediatamente após a montagem
    handleResize();

    // Remove o listener ao desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determina o breakpoint atual com base na largura da janela
  const getBreakpoint = (w: number): Breakpoint => {
    if (w < 640) return 'xs';
    if (w < 768) return 'sm';
    if (w < 1024) return 'md';
    if (w < 1280) return 'lg';
    if (w < 1536) return 'xl';
    return '2xl';
  };

  const breakpoint = getBreakpoint(width);

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isLargeScreen: width > 1200,
    width,
    breakpoint,
  };
}
