import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [clickRipples, setClickRipples] = useState([]);
  const [hoverParticles, setHoverParticles] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  // Scroll tracking
  const { scrollYProgress } = useScroll();
  const scrollIntensity = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  // Smooth mouse tracking
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Create hover particles
      if (isHovering && Math.random() > 0.7) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
        };
        setHoverParticles(prev => [...prev.slice(-10), newParticle]);
        setTimeout(() => {
          setHoverParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 1000);
      }
    };

    const handleClick = (e) => {
      // Create ripple effect on click
      const ripple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: 0,
      };
      setClickRipples(prev => [...prev, ripple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setClickRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 2000);

      // Create particle burst on click
      const burstParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        angle: (Math.PI * 2 * i) / 8,
        distance: Math.random() * 100 + 50,
        size: Math.random() * 5 + 3,
      }));
      setHoverParticles(prev => [...prev, ...burstParticles]);
      burstParticles.forEach((particle, i) => {
        setTimeout(() => {
          setHoverParticles(prev => prev.filter(p => p.id !== particle.id));
        }, 1500 + i * 50);
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isHovering]);

  // Generate morphing blob paths
  const blobPaths = [
    'M 200,200 Q 300,100 400,200 T 600,200 Q 500,300 400,200 T 200,200',
    'M 200,200 Q 350,50 500,200 T 800,200 Q 650,350 500,200 T 200,200',
  ];

  // Particle trail system
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    pathLength: Math.random() * 100,
    speed: Math.random() * 0.5 + 0.3,
    delay: Math.random() * 5,
  }));

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden pointer-events-none"
    >
      {/* Base Background with Gradient */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Scroll-Responsive Mesh Gradient */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0"
        style={{
          opacity: useTransform(scrollIntensity, [1, 1.5], [0.4, 0.6]),
          background: `
            radial-gradient(circle at 20% 40%, ${theme?.primary || '#6366f1'}15 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, ${theme?.secondary || '#a855f7'}15 0%, transparent 50%),
            radial-gradient(circle at 50% 60%, ${theme?.accent || '#f43f5e'}10 0%, transparent 60%)
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Scroll-Responsive Morphing Blob Shapes */}
      {blobPaths.map((path, index) => (
        <motion.div
          key={`blob-${index}`}
          className="absolute opacity-20 blur-[80px]"
          style={{
            width: '600px',
            height: '600px',
            top: `${35 + index * 25}%`,
            left: `${5 + index * 25}%`,
            scale: scrollIntensity,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20 + index * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 2,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 800 400">
            <motion.path
              d={path}
              fill={`${theme?.primary || '#6366f1'}40`}
              animate={{
                d: [
                  blobPaths[index],
                  blobPaths[(index + 1) % blobPaths.length],
                  blobPaths[index],
                ],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Particle Trail System */}
      <svg className="absolute inset-0 w-full h-full opacity-40">
        {particles.map((particle) => {
          const maxX = 75;
          const minY = 25;
          const initialX = Math.random() * maxX;
          const initialY = Math.random() * (100 - minY) + minY;
          
          return (
            <motion.circle
              key={particle.id}
              r={particle.size}
              fill={theme?.primary || '#6366f1'}
              initial={{
                cx: `${initialX}%`,
                cy: `${initialY}%`,
                opacity: 0,
              }}
              animate={{
                cx: [
                  `${initialX}%`,
                  `${Math.min(initialX + Math.random() * 20, maxX)}%`,
                  `${initialX}%`,
                ],
                cy: [
                  `${initialY}%`,
                  `${Math.max(Math.min(initialY + Math.random() * 30 - 15, 100), minY)}%`,
                  `${initialY}%`,
                ],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: particle.duration || 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: particle.delay,
              }}
            />
          );
        })}
      </svg>

      {/* Click Ripple Effects */}
      {clickRipples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            border: `2px solid ${theme?.primary || '#6366f1'}`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: 400,
            height: 400,
            opacity: 0,
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Hover Particle Effects */}
      {hoverParticles.map((particle) => {
        const finalX = particle.x + (particle.angle ? Math.cos(particle.angle) * particle.distance : 0);
        const finalY = particle.y + (particle.angle ? Math.sin(particle.angle) * particle.distance : 0);
        
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, ${theme?.primary || '#6366f1'} 0%, transparent 70%)`,
              boxShadow: `0 0 ${particle.size * 3}px ${theme?.primary || '#6366f1'}80`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: particle.angle ? Math.cos(particle.angle) * particle.distance : 0,
              y: particle.angle ? Math.sin(particle.angle) * particle.distance : 0,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: particle.angle ? 1.5 : 1,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Enhanced Mouse-Interactive Glow */}
      <motion.div
        className="absolute rounded-full blur-[120px] opacity-30"
        style={{
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${theme?.primary || '#6366f1'}40 0%, transparent 70%)`,
          x: useTransform(springX, (x) => x - 200),
          y: useTransform(springY, (y) => y - 200),
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.3]),
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Cursor Trail Effect */}
      <motion.div
        className="absolute rounded-full blur-[60px] opacity-20"
        style={{
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${theme?.secondary || '#a855f7'}60 0%, transparent 70%)`,
          x: useTransform(springX, (x) => x - 100),
          y: useTransform(springY, (y) => y - 100),
        }}
        animate={{
          opacity: isHovering ? [0.2, 0.4, 0.2] : 0.1,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Scroll-Responsive Flowing Liquid Effect */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          rotate: useTransform(scrollYProgress, [0, 1], [0, 360]),
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              ${theme?.primary || '#6366f1'}20 0deg,
              transparent 60deg,
              ${theme?.secondary || '#a855f7'}20 120deg,
              transparent 180deg,
              ${theme?.accent || '#f43f5e'}20 240deg,
              transparent 300deg,
              ${theme?.primary || '#6366f1'}20 360deg
            )
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Flowing Organic Lines Network */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme?.primary || '#6366f1'} stopOpacity="0.4" />
            <stop offset="50%" stopColor={theme?.secondary || '#a855f7'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={theme?.accent || '#f43f5e'} stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: 12 }, (_, i) => {
          const startX = (i * 8.33) % 100;
          const startY = (i * 12) % 100;
          const endX = ((i * 8.33) + 30) % 100;
          const endY = ((i * 12) + 25) % 100;
          
          return (
            <motion.path
              key={`flow-line-${i}`}
              d={`M ${startX}% ${startY}% Q ${(startX + endX) / 2}% ${(startY + endY) / 2}% ${endX}% ${endY}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.6, 0],
                d: [
                  `M ${startX}% ${startY}% Q ${(startX + endX) / 2}% ${(startY + endY) / 2}% ${endX}% ${endY}%`,
                  `M ${startX}% ${startY}% Q ${(startX + endX) / 2 + 5}% ${(startY + endY) / 2 - 5}% ${endX}% ${endY}%`,
                  `M ${startX}% ${startY}% Q ${(startX + endX) / 2}% ${(startY + endY) / 2}% ${endX}% ${endY}%`,
                ],
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          );
        })}
      </svg>

      {/* Animated Mesh Network Nodes */}
      <svg className="absolute inset-0 w-full h-full opacity-25">
        {Array.from({ length: 15 }, (_, i) => {
          const x = (i * 6.67) % 100;
          const y = (i * 6.67 + 20) % 100;
          
          return (
            <g key={`node-${i}`}>
              <motion.circle
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={theme?.primary || '#6366f1'}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
              {/* Connecting lines between nodes */}
              {i < 14 && (
                <motion.line
                  x1={`${x}%`}
                  y1={`${y}%`}
                  x2={`${((i + 1) * 6.67) % 100}%`}
                  y2={`${((i + 1) * 6.67 + 20) % 100}%`}
                  stroke={theme?.primary || '#6366f1'}
                  strokeWidth="0.5"
                  strokeOpacity="0.2"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: [0, 1, 0],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.4,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Flowing Wave Patterns */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.path
            key={`wave-${i}`}
            d={`M 0,${20 + i * 20} Q 25,${15 + i * 20} 50,${20 + i * 20} T 100,${20 + i * 20}`}
            stroke={[theme?.primary, theme?.secondary, theme?.accent, theme?.primary, theme?.secondary][i] || '#6366f1'}
            strokeWidth="2"
            fill="none"
            strokeOpacity="0.3"
            animate={{
              d: [
                `M 0,${20 + i * 20} Q 25,${15 + i * 20} 50,${20 + i * 20} T 100,${20 + i * 20}`,
                `M 0,${20 + i * 20} Q 25,${25 + i * 20} 50,${20 + i * 20} T 100,${20 + i * 20}`,
                `M 0,${20 + i * 20} Q 25,${15 + i * 20} 50,${20 + i * 20} T 100,${20 + i * 20}`,
              ],
              pathLength: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + i * 1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>

      {/* Scroll-Responsive Radial Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.05, 0.2, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full blur-[150px]"
        style={{
          background: `radial-gradient(circle, ${theme?.primary || '#6366f1'} 0%, transparent 70%)`,
          scale: scrollIntensity,
        }}
      />

      {/* Interactive Hover Zone Effect */}
      <motion.div
        className="absolute rounded-full blur-[100px] opacity-0"
        style={{
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${theme?.accent || '#f43f5e'}50 0%, transparent 70%)`,
          x: useTransform(springX, (x) => x - 150),
          y: useTransform(springY, (y) => y - 150),
        }}
        animate={{
          opacity: isHovering ? [0, 0.3, 0] : 0,
          scale: isHovering ? [1, 1.5, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isHovering ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Abstract Shapes */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`abstract-${i}`}
          className="absolute opacity-15"
          style={{
            width: `${100 + i * 30}px`,
            height: `${100 + i * 30}px`,
            left: `${10 + i * 15}%`,
            top: `${30 + i * 12}%`,
            background: `radial-gradient(ellipse at center, ${theme?.primary || '#6366f1'}40 0%, transparent 70%)`,
            borderRadius: `${30 + i * 10}% ${70 - i * 10}% ${50 + i * 5}% ${60 - i * 5}%`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
            borderRadius: [
              `${30 + i * 10}% ${70 - i * 10}% ${50 + i * 5}% ${60 - i * 5}%`,
              `${70 - i * 10}% ${30 + i * 10}% ${60 - i * 5}% ${50 + i * 5}%`,
              `${30 + i * 10}% ${70 - i * 10}% ${50 + i * 5}% ${60 - i * 5}%`,
            ],
          }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}

      {/* Dynamic Light Rays */}
      <svg className="absolute inset-0 w-full h-full opacity-15">
        <defs>
          <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme?.primary || '#6366f1'} stopOpacity="0.5" />
            <stop offset="100%" stopColor={theme?.secondary || '#a855f7'} stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (360 / 8) * i;
          const centerX = 50;
          const centerY = 50;
          const length = 40;
          const endX = centerX + Math.cos((angle * Math.PI) / 180) * length;
          const endY = centerY + Math.sin((angle * Math.PI) / 180) * length;
          
          return (
            <motion.line
              key={`ray-${i}`}
              x1={`${centerX}%`}
              y1={`${centerY}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke="url(#rayGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                opacity: [0.1, 0.4, 0.1],
                x2: [
                  `${endX}%`,
                  `${centerX + Math.cos((angle * Math.PI) / 180) * (length + 10)}%`,
                  `${endX}%`,
                ],
                y2: [
                  `${endY}%`,
                  `${centerY + Math.sin((angle * Math.PI) / 180) * (length + 10)}%`,
                  `${endY}%`,
                ],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          );
        })}
      </svg>

      {/* Organic Blob Clusters */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={`cluster-${i}`}
          className="absolute rounded-full blur-[60px] opacity-20"
          style={{
            width: `${150 + i * 50}px`,
            height: `${150 + i * 50}px`,
            left: `${20 + i * 20}%`,
            top: `${40 + i * 15}%`,
            background: `radial-gradient(circle, ${[theme?.primary, theme?.secondary, theme?.accent, theme?.primary][i] || '#6366f1'}30 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
    </div>
  );
};

export default AnimatedBackground;
