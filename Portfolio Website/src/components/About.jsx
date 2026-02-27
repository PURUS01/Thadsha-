import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const About = ({ profile, skills, technologies }) => {
    const theme = useTheme();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yImg = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const yContent = useTransform(scrollYProgress, [0, 1], [25, -25]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

    return (
        <section ref={sectionRef} id="about" className="pt-0 pb-0 relative px-4 md:px-6 overflow-hidden">
            {/* Theme Background Glow */}
            <div
                className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 -z-10 transition-all duration-1000"
                style={{ backgroundColor: theme?.secondary || '#a855f7' }}
            />
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-14 lg:gap-16 items-center py-12 md:py-16">

                {/* Visual Side */}
                <div className="lg:col-span-5 relative order-1 lg:order-1">
                    <motion.div
                        style={{ y: yImg }}
                        className="relative z-10"
                    >
                        <div className="aspect-[4/5] rounded-[40px] md:rounded-[50px] lg:rounded-[60px] overflow-hidden glass border-0 shadow-premium relative group max-w-md mx-auto lg:max-w-none">
                            <img
                                src={profile?.photoURL || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"}
                                alt={profile?.firstName}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                        </div>

                        {/* Floating DNA Tag */}
                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="group absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 p-6 md:p-8 glass-heavy rounded-full border-0 animate-float hidden md:block cursor-pointer transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            <span className="relative z-10 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-primary group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all duration-300">System Designer</span>
                        </motion.div>
                    </motion.div>

                    {/* Background Decorative Frame - Removed to avoid visible section dividers */}
                </div>

                {/* Content Side */}
                <div className="lg:col-span-7 space-y-8 md:space-y-10 lg:space-y-12 order-2 lg:order-2">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="group relative inline-block px-3 md:px-4 py-1 md:py-1.5 glass rounded-full mb-6 md:mb-8 border-0 cursor-pointer transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            <span className="relative z-10 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all duration-300">Biography</span>
                        </motion.div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white font-outfit tracking-tighter leading-none mb-6 md:mb-8 lg:mb-10">
                            About <br /> <motion.span style={{ x: useTransform(scrollYProgress, [0, 1], [0, 100]) }} className="text-gradient inline-block">Me</motion.span>
                        </h2>

                        <div className="space-y-4 md:space-y-6 text-slate-400 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
                            <p>
                                {profile?.about || `I am ${profile?.firstName || 'Thadsha'} ${profile?.lastName || ''}, a Software Engineer dedicated to crafting the digital infrastructure of tomorrow. My expertise lies in the intersection of robust backend architecture and seamless frontend performance.`}
                            </p>
                            <p className="pl-6 md:pl-8 py-2 italic text-sm md:text-base text-slate-500">
                                "Technology is most powerful when it's invisible, empowering users through silent, scalable precision."
                            </p>
                        </div>
                    </motion.div>

                    {/* Skills Section */}
                    {skills && skills.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">Expertise & Skills</h3>
                            <div className="flex flex-wrap gap-3">
                                {skills.map((skill, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        className="group relative px-4 py-2 glass rounded-full border-0 cursor-pointer transition-all duration-300 overflow-hidden"
                                        style={{
                                            boxShadow: `0 0 0 rgba(0,0,0,0)`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = `0 0 25px ${theme?.primary || '#6366f1'}80, 0 0 50px ${theme?.primary || '#6366f1'}40`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                        <span className="relative z-10 text-xs md:text-sm font-semibold text-white/80 group-hover:text-white transition-colors duration-300">
                                            {skill.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Technologies Section */}
                    {technologies && technologies.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider">Tech Stack</h3>
                            <div className="flex flex-wrap gap-3">
                                {technologies.map((tech, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        className="group relative px-4 py-2 glass rounded-full border border-white/10 cursor-pointer transition-all duration-300 hover:border-secondary/50 overflow-hidden"
                                        style={{
                                            boxShadow: `0 0 0 rgba(0,0,0,0)`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = `0 0 25px ${theme?.secondary || '#a855f7'}80, 0 0 50px ${theme?.secondary || '#a855f7'}40`;
                                            e.currentTarget.style.borderColor = theme?.secondary || '#a855f7';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/20 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                        <span className="relative z-10 text-xs md:text-sm font-semibold text-white/80 group-hover:text-white transition-colors duration-300">
                                            {tech.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default About;
