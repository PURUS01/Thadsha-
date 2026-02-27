import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const AnimatedBackground = () => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse tracking
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Particle system
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 2.5 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5,
  }));

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden pointer-events-none"
    >
      {/* Base Background */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Animated Mesh Gradient */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 opacity-35"
        style={{
          background: `
            radial-gradient(circle at 25% 35%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 75% 65%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Main Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 360],
          x: [0, 100, 0],
          y: [0, -70, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[15%] -left-[10%] w-[75%] h-[75%] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          rotate: [360, 0],
          x: [0, -110, 0],
          y: [0, 90, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[115px]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Particle System */}
      <svg className="absolute inset-0 w-full h-full opacity-35">
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            r={particle.size}
            fill="rgba(99, 102, 241, 0.6)"
            initial={{
              cx: `${particle.x}%`,
              cy: `${particle.y}%`,
              opacity: 0,
            }}
            animate={{
              cx: [
                `${particle.x}%`,
                `${(particle.x + 30) % 100}%`,
                `${particle.x}%`,
              ],
              cy: [
                `${particle.y}%`,
                `${(particle.y - 40) % 100}%`,
                `${particle.y}%`,
              ],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </svg>

      {/* Mouse-Interactive Glow */}
      <motion.div
        className="absolute rounded-full blur-[100px] opacity-25"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%)',
          x: useTransform(springX, (x) => x - 175),
          y: useTransform(springY, (y) => y - 175),
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Rotating Orb Rings */}
      {Array.from({ length: 2 }, (_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-15"
          style={{
            width: `${250 + i * 150}px`,
            height: `${250 + i * 150}px`,
            borderColor: i === 0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(139, 92, 246, 0.4)',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 1.5,
          }}
        />
      ))}

      {/* Flowing Conic Gradient */}
      <motion.div
        className="absolute inset-0 opacity-8"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              rgba(99, 102, 241, 0.15) 0deg,
              transparent 90deg,
              rgba(139, 92, 246, 0.15) 180deg,
              transparent 270deg,
              rgba(99, 102, 241, 0.15) 360deg
            )
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Animated Grid */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '55px 55px',
        }}
      />

      {/* Center Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.04, 0.18, 0.04],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
