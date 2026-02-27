import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Hero = ({ profile }) => {
    const theme = useTheme();
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rafId = useRef(null);

    // Smooth Cursor Following with reduced stiffness for better performance
    const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

    const tiltX = useTransform(springY, [-500, 500], [3, -3]);
    const tiltY = useTransform(springX, [-500, 500], [-3, 3]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;

        // Throttle mouse move updates using requestAnimationFrame
        if (rafId.current) return;

        rafId.current = requestAnimationFrame(() => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            mouseX.set(e.clientX - centerX);
            mouseY.set(e.clientY - centerY);
            rafId.current = null;
        });
    };

    useEffect(() => {
        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center pt-20 md:pt-24 pb-0 overflow-hidden px-4 md:px-6"
        >
            {/* Dynamic Kinetic Background */}
            <motion.div
                style={{ x: springX, y: springY, opacity: 0.15 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[60vw] h-[80vw] md:h-[60vw] bg-primary rounded-full blur-[120px] md:blur-[180px] -z-10"
            />

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-8 items-center relative z-10">
                <motion.div
                    style={{ y: yText, opacity: opacityHero, rotateX: tiltX, rotateY: tiltY }}
                    className="lg:col-span-7 space-y-6 md:space-y-8 lg:space-y-10 perspective-1000 order-2 lg:order-1"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 md:gap-4 px-4 md:px-5 py-1.5 md:py-2 glass-heavy rounded-xl md:rounded-2xl border-0"
                    >
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/80">
                            Available For Tech Innovation
                        </span>
                    </motion.div>

                    <div className="space-y-3 md:space-y-4">
                        <motion.h1
                            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[1.1] font-outfit text-white mb-6"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
                                }
                            }}
                        >
                            {/* Render First Name */}
                            <span className="block whitespace-nowrap">
                                {(profile?.firstName || 'Thadsha').split('').map((char, index) => (
                                    <motion.span
                                        key={index}
                                        className="inline-block"
                                        variants={{
                                            hidden: { opacity: 0, y: 50, rotateX: -90 },
                                            visible: { opacity: 1, y: 0, rotateX: 0 }
                                        }}
                                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </span>

                            {/* Render Last Name */}
                            <span className="block text-gradient drop-shadow-2xl mt-1 md:mt-2 whitespace-nowrap">
                                {(profile?.lastName || '').split('').map((char, index) => (
                                    <motion.span
                                        key={index}
                                        className="inline-block"
                                        variants={{
                                            hidden: { opacity: 0, y: 50, rotateX: -90 },
                                            visible: { opacity: 1, y: 0, rotateX: 0 }
                                        }}
                                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-[0.3em] text-primary"
                        >
                            {profile?.position || 'Software Engineer'}
                        </motion.p>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-base md:text-lg text-slate-400 max-w-lg leading-relaxed font-medium pl-6 md:pl-8 py-2"
                    >
                        Developing high-performance software with elegant architectures and immersive digital experiences. I believe in the intersection of code and art.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 lg:gap-8 pt-4"
                    >
                        <a href="#projects" className="group relative px-8 md:px-10 lg:px-12 py-4 md:py-5 lg:py-6 bg-white text-black font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-center hover:shadow-primary/30">
                            <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]">Inspect Projects</span>
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </a>
                        {profile?.resumeURL && (
                            <a 
                                href={profile.resumeURL} 
                                target="_blank"
                                rel="noreferrer"
                                className="group relative px-8 md:px-10 lg:px-12 py-4 md:py-5 lg:py-6 glass text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl md:rounded-3xl border-0 hover:bg-white/10 transition-all duration-300 text-center flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-primary/20 overflow-hidden"
                            >
                                <span className="relative z-10">Download CV</span>
                                <Download size={14} className="relative z-10 group-hover:translate-y-1 group-hover:rotate-12 transition-all duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </a>
                        )}
                    </motion.div>
                </motion.div>

                <motion.div
                    style={{ opacity: opacityHero, rotateX: tiltX, rotateY: tiltY, scale: 1.05 }}
                    className="hidden lg:block lg:col-span-5 relative order-1 lg:order-2"
                >
                    {/* Simple Elegant Circles */}
                    <div className="relative w-full aspect-square flex items-center justify-center pointer-events-none">
                        {/* Soft background glow */}
                        <div
                            className="absolute w-96 h-96 rounded-full blur-[120px] opacity-20 transition-all duration-1000"
                            style={{ backgroundColor: theme?.primary || '#6366f1' }}
                        />

                        {/* Concentric Circles */}
                        <div className="relative w-96 h-96 flex items-center justify-center">
                            {/* Outer Circle */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-80 h-80 rounded-full border-0 transition-all duration-700"
                            />

                            {/* Middle Circle */}
                            <motion.div
                                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute w-56 h-56 rounded-full border-0 transition-all duration-700"
                            />

                            {/* Inner Circle */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute w-32 h-32 rounded-full border-0 transition-all duration-700"
                            />

                            {/* Center Glow */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-16 h-16 rounded-full blur-xl transition-all duration-700"
                                style={{ backgroundColor: theme?.primary || '#6366f1' }}
                            />

                            {/* Center Dot */}
                            <div
                                className="absolute w-4 h-4 rounded-full transition-all duration-700"
                                style={{
                                    backgroundColor: theme?.primary || '#6366f1',
                                    boxShadow: `0 0 20px ${theme?.primary || '#6366f1'}`
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Drifting Text - Hidden on mobile */}
            <motion.div
                style={{
                    x: useTransform(scrollYProgress, [0, 1], [0, -400]),
                    opacity: 0.03
                }}
                className="hidden md:block absolute bottom-20 left-0 text-[15vw] lg:text-[20vw] font-black text-white whitespace-nowrap pointer-events-none select-none overflow-hidden"
            >
                ENGINEER ARCHITECT CREATOR
            </motion.div>
        </div>
    );
};

export default Hero;
