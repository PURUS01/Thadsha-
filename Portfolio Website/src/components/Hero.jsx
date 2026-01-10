import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const Hero = ({ profile }) => {
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
            className="relative min-h-screen flex items-center pt-20 md:pt-24 pb-12 md:pb-0 overflow-hidden px-4 md:px-6"
        >
            {/* Dynamic Kinetic Background */}
            <motion.div
                style={{ x: springX, y: springY, opacity: 0.15 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[60vw] h-[80vw] md:h-[60vw] bg-primary rounded-full blur-[120px] md:blur-[180px] -z-10"
            />

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center relative z-10">
                <motion.div
                    style={{ y: yText, opacity: opacityHero, rotateX: tiltX, rotateY: tiltY }}
                    className="space-y-6 md:space-y-8 lg:space-y-10 perspective-1000 order-2 lg:order-1"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 md:gap-4 px-4 md:px-5 py-1.5 md:py-2 glass-heavy rounded-xl md:rounded-2xl border-white/10"
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
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.85] font-outfit text-white"
                        >
                            {profile?.firstName || 'Thadsha'} <br />
                            <span className="text-gradient drop-shadow-2xl">{profile?.lastName || ''}</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.4 }}
                            className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary"
                        >
                            {profile?.position || 'Software Engineer'}
                        </motion.p>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-base md:text-lg text-slate-400 max-w-lg leading-relaxed font-medium border-l-2 border-primary/20 pl-6 md:pl-8 py-2"
                    >
                        Developing high-performance software with elegant architectures and immersive digital experiences. I believe in the intersection of code and art.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 lg:gap-8 pt-4"
                    >
                        <a href="#projects" className="group relative px-8 md:px-10 lg:px-12 py-4 md:py-5 lg:py-6 bg-white text-black font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95 text-center">
                            <span className="relative z-10">Inspect Projects</span>
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                        </a>
                        <a href="#contact" className="px-8 md:px-10 lg:px-12 py-4 md:py-5 lg:py-6 glass text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-2xl md:rounded-3xl border-white/5 hover:bg-white/5 transition-all text-center">
                            Reach Out
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div
                    style={{ opacity: opacityHero, rotateX: tiltX, rotateY: tiltY, scale: 1.05 }}
                    className="hidden lg:block relative order-1 lg:order-2"
                >
                    <div className="relative z-10 p-12 lg:p-16 glass-heavy rounded-[60px] lg:rounded-[80px] border-white/10 shadow-premium aspect-square flex flex-col justify-center items-center group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 opacity-40 group-hover:scale-110 transition-transform duration-1000" />

                        {/* Kinetic Architecture Visual */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute w-[120%] h-[120%] border border-white/[0.03] rounded-full animate-spin-slow opacity-20" />
                            <div className="absolute w-[80%] h-[80%] border border-white/[0.05] rounded-full animate-reverse-spin-slow opacity-10" />

                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="z-20 flex flex-col items-center gap-4 lg:gap-6"
                            >
                                <div className="text-7xl lg:text-9xl font-black text-white/10 font-outfit uppercase">CODE</div>
                                <div className="w-1 h-16 lg:h-24 bg-gradient-to-b from-primary to-transparent" />
                                <div className="text-2xl lg:text-4xl font-light text-white font-outfit tracking-[0.8em] lg:tracking-[1em] opacity-40">ARCHITECTURE</div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Drifting Text - Hidden on mobile */}
            <motion.div
                style={{ x: mouseX, opacity: 0.03 }}
                className="hidden md:block absolute bottom-20 left-0 text-[15vw] lg:text-[20vw] font-black text-white whitespace-nowrap pointer-events-none select-none overflow-hidden"
            >
                ENGINEER ARCHITECT CREATOR
            </motion.div>
        </div>
    );
};

export default Hero;

