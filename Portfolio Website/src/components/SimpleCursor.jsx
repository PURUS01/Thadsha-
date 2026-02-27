import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SimpleCursor = () => {
  const theme = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isDesktop, setIsDesktop] = useState(false);

  // Smooth but responsive spring
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia('(pointer: fine)').matches);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleElementEnter = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.onclick !== null;
      
      if (isInteractive) {
        setIsHovering(true);
      }
    };

    const handleElementLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], [onclick], .cursor-pointer, [href]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementEnter);
      el.addEventListener('mouseleave', handleElementLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementEnter);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, [cursorX, cursorY]);

  if (!isDesktop) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: springX,
        y: springY,
      }}
    >
      {/* Simple dot that follows cursor */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: isHovering ? '8px' : '4px',
          height: isHovering ? '8px' : '4px',
          left: isHovering ? '-4px' : '-2px',
          top: isHovering ? '-4px' : '-2px',
          backgroundColor: theme?.primary || '#6366f1',
          opacity: 0.6,
          boxShadow: isHovering 
            ? `0 0 12px ${theme?.primary || '#6366f1'}80`
            : `0 0 6px ${theme?.primary || '#6366f1'}40`,
        }}
        animate={{
          scale: isHovering ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: isHovering ? 1.5 : 0.2,
          repeat: isHovering ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default SimpleCursor;
