import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
    const theme = useTheme();
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    // More responsive spring physics for accurate pointing
    const springConfig = { damping: 30, stiffness: 300 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(hover: none)').matches);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    useEffect(() => {
        const moveCursor = (e) => {
            // Direct positioning for accurate cursor placement
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        
        // Scroll detection
        let scrollTimeout;
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
        };
        
        const handleElementEnter = (e) => {
            const target = e.target;
            const isInteractive = target.tagName === 'A' || 
                                 target.tagName === 'BUTTON' || 
                                 target.closest('a') || 
                                 target.closest('button') ||
                                 target.classList.contains('cursor-pointer');
            
            if (isInteractive) {
                setIsHovering(true);
            }
        };

        const handleElementLeave = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const interactiveElements = document.querySelectorAll('a, button, [role="button"], [onclick], .cursor-pointer, [href]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleElementEnter);
            el.addEventListener('mouseleave', handleElementLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleElementEnter);
                el.removeEventListener('mouseleave', handleElementLeave);
            });
        };
    }, [cursorX, cursorY]);

    if (!isDesktop) return null;

    return (
        <>
            {/* Main Cursor - Minimalist Dot - Perfectly Centered */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="w-1.5 h-1.5 rounded-full absolute"
                    style={{
                        left: '-3px',
                        top: '-3px',
                        backgroundColor: 'white',
                        boxShadow: `0 0 ${isHovering ? '15px' : '8px'} ${theme?.primary || '#6366f1'}${isHovering ? 'AA' : '60'}`,
                    }}
                    animate={{
                        scale: isClicking ? 0.7 : 1,
                    }}
                    transition={{ duration: 0.1, ease: 'easeOut' }}
                />
            </motion.div>

            {/* Outer Glow Ring - Perfectly Centered */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="w-10 h-10 rounded-full border absolute"
                    style={{
                        left: '-20px',
                        top: '-20px',
                        borderColor: isScrolling 
                            ? `${theme?.secondary || '#a855f7'}60`
                            : `${theme?.primary || '#6366f1'}${isHovering ? '60' : '30'}`,
                    }}
                    animate={{
                        scale: isClicking ? 0.6 : isHovering ? 1.5 : isScrolling ? 1.2 : 1,
                        opacity: isClicking ? 0.2 : isHovering ? 0.5 : isScrolling ? 0.6 : 0.3,
                    }}
                    transition={{ 
                        duration: 0.2, 
                        ease: "easeOut"
                    }}
                />
            </motion.div>

            {/* Scroll Effect - Smooth Pulsing Glow */}
            {isScrolling && (
                <motion.div
                    className="fixed top-0 left-0 pointer-events-none z-[9997]"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Expanding Glow Circles */}
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${16 + i * 8}px`,
                                height: `${16 + i * 8}px`,
                                left: `${-8 - i * 4}px`,
                                top: `${-8 - i * 4}px`,
                                border: `1px solid ${theme?.secondary || '#a855f7'}${60 - i * 20}`,
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.6 - i * 0.2, 0.2, 0.6 - i * 0.2],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </motion.div>
            )}

            {/* Hover Glow Effect */}
            {isHovering && (
                <motion.div
                    className="fixed top-0 left-0 pointer-events-none z-[9997]"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="w-16 h-16 rounded-full absolute"
                        style={{
                            left: '-32px',
                            top: '-32px',
                            background: `radial-gradient(circle, ${theme?.primary || '#6366f1'}20, transparent 70%)`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            )}

            {/* Click Ripple */}
            {isClicking && (
                <motion.div
                    className="fixed top-0 left-0 pointer-events-none z-[9996]"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div 
                        className="w-12 h-12 rounded-full border absolute"
                        style={{
                            left: '-24px',
                            top: '-24px',
                            borderColor: theme?.primary || '#6366f1',
                        }}
                    />
                </motion.div>
            )}
        </>
    );
};

export default CustomCursor;
