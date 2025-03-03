'use client';
import { useState, useEffect } from 'react';

export const useIsDesktop = (breakpoint: number = 1024) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= breakpoint);

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isDesktop;
};
