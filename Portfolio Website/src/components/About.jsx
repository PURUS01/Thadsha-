import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = ({ profile }) => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yImg = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const yContent = useTransform(scrollYProgress, [0, 1], [25, -25]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

    const details = [
        { label: 'Role', value: profile?.position || 'Software Architect' },
        { label: 'Focus', value: 'Scalable Systems' },
        { label: 'Location', value: profile?.address || 'Global / Remote' },
        { label: 'DNA', value: 'Architecture First' }
    ];

    return (
        <section ref={sectionRef} id="about" className="py-16 md:py-20 lg:py-24 relative px-4 md:px-6">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-14 lg:gap-16 items-center">

                {/* Visual Side */}
                <div className="lg:col-span-5 relative order-1 lg:order-1">
                    <motion.div
                        style={{ y: yImg }}
                        className="relative z-10"
                    >
                        <div className="aspect-[4/5] rounded-[40px] md:rounded-[50px] lg:rounded-[60px] overflow-hidden glass border-white/10 shadow-premium relative group max-w-md mx-auto lg:max-w-none">
                            <img
                                src={profile?.photoURL || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"}
                                alt={profile?.firstName}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                        </div>

                        {/* Floating DNA Tag */}
                        <div className="absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 p-6 md:p-8 glass-heavy rounded-full border-white/20 animate-float hidden md:block">
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-primary">System Designer</span>
                        </div>
                    </motion.div>

                    {/* Background Decorative Frame */}
                    <motion.div
                        style={{ rotate, y: yContent, opacity: 0.1 }}
                        className="absolute -top-6 md:-top-10 -left-6 md:-left-10 w-full h-full border-2 border-primary rounded-[40px] md:rounded-[50px] lg:rounded-[60px] -z-10 hidden lg:block"
                    />
                </div>

                {/* Content Side */}
                <div className="lg:col-span-7 space-y-8 md:space-y-10 lg:space-y-12 order-2 lg:order-2">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-3 md:px-4 py-1 md:py-1.5 glass rounded-full mb-6 md:mb-8 border-white/5">
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary">Biography</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white font-outfit tracking-tighter leading-none mb-6 md:mb-8 lg:mb-10">
                            Designing <br /> <span className="text-gradient">Logic.</span>
                        </h2>

                        <div className="space-y-4 md:space-y-6 text-slate-400 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
                            <p>
                                {profile?.about || `I am ${profile?.firstName || 'Thadsha'} ${profile?.lastName || ''}, a Software Engineer dedicated to crafting the digital infrastructure of tomorrow. My expertise lies in the intersection of robust backend architecture and seamless frontend performance.`}
                            </p>
                            <p className="border-l-4 border-primary/30 pl-6 md:pl-8 py-2 italic text-sm md:text-base text-slate-500">
                                "Technology is most powerful when it's invisible, empowering users through silent, scalable precision."
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {details.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-4 md:p-6 glass rounded-2xl md:rounded-3xl border-white/5"
                            >
                                <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 md:mb-2">{item.label}</p>
                                <p className="text-white font-bold text-xs md:text-sm tracking-tight">{item.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
