import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Projects = ({ projects }) => {
    const theme = useTheme();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yLeft = useTransform(scrollYProgress, [0, 1], [-30, 30]);
    const yRight = useTransform(scrollYProgress, [0, 1], [30, -30]);

    // Show only first 5 projects for the home highlight
    const highlightedProjects = projects.slice(0, 5);
    
    // Determine grid layout based on number of projects
    const getGridClasses = () => {
        const count = highlightedProjects.length;
        if (count === 4) {
            return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
        } else if (count === 5) {
            return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
        } else {
            // Default: responsive grid
            return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
        }
    };

    return (
        <section ref={sectionRef} id="projects" className="pt-0 pb-0 relative overflow-hidden px-4 md:px-6">
            {/* Theme Background Glow */}
            <div
                className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] rounded-full blur-[150px] opacity-10 -z-10 transition-all duration-1000"
                style={{ backgroundColor: theme?.accent || '#f43f5e' }}
            />
            {/* Parallax Background Text */}
            <motion.div
                style={{ x: yLeft }}
                className="absolute top-20 left-0 text-[15vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none"
            >
                ENGINEERING SOLUTIONS PERFORMANCE
            </motion.div>

            <div className="container mx-auto py-12 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 md:mb-16 lg:mb-20 relative z-10"
            >
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="group relative inline-block px-3 md:px-4 py-1 md:py-1.5 glass rounded-full mb-3 md:mb-4 border-0 cursor-pointer transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    <span className="relative z-10 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all duration-300">Portfolio</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight font-outfit text-white">Featured <span className="text-gradient">Work</span></h2>
                <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium px-4">Delivering complex digital products with robust architecture and superior performance.</p>
            </motion.div>

            <div className={`container mx-auto grid ${getGridClasses()} gap-4 md:gap-6 relative z-10`}>
                {highlightedProjects.map((project, i) => {
                    // Smaller, consistent card sizes
                    const heightClass = 'h-[280px] md:h-[320px]';
                    
                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ 
                                duration: 0.6, 
                                delay: i * 0.1,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                            whileHover={{
                                y: -20,
                                scale: 1.03,
                                rotateY: i % 2 === 0 ? 2 : -2,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            className={`group relative ${heightClass} rounded-[32px] overflow-hidden perspective-1000`}
                        >
                            {/* Animated Border Glow */}
                            <div className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${project.url ? 'from-primary/20 via-secondary/20 to-accent/20' : 'from-white/5 via-white/5 to-white/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
                            
                            {/* Main Card Container */}
                            <div className="relative h-full w-full glass border-0 transition-all duration-500 rounded-[32px] overflow-hidden">
                                {/* Background Image with Parallax Effect or Placeholder */}
                                <motion.div 
                                    className="absolute inset-0"
                                    whileHover={{ scale: project.imageURL ? 1.15 : 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                >
                                    {project.imageURL ? (
                                        <>
                                            <img
                                                src={project.imageURL}
                                                className={`w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000 ${project.url ? 'group-hover:opacity-70' : 'group-hover:opacity-50'}`}
                                                alt={project.name}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                            {/* Fallback placeholder if image fails to load */}
                                            <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                                                <div className="text-center space-y-3">
                                                    <ImageOff size={48} className="mx-auto text-primary/60" />
                                                    <p className="text-xs font-black uppercase tracking-widest text-primary/60">No Image</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="text-center space-y-3"
                                            >
                                                <motion.div
                                                    animate={{ 
                                                        scale: [1, 1.1, 1],
                                                        rotate: [0, 5, -5, 0]
                                                    }}
                                                    transition={{ 
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                >
                                                    <ImageOff size={48} className="mx-auto text-primary/60" />
                                                </motion.div>
                                                <p className="text-xs font-black uppercase tracking-widest text-primary/60">No Image Available</p>
                                            </motion.div>
                                        </div>
                                    )}
                                    {/* Multi-layer Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </motion.div>

                                {/* Animated Light Sweep */}
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "200%" }}
                                    transition={{ duration: 1.2, ease: "easeInOut" }}
                                />

                                {/* Floating Particles Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    {[...Array(6)].map((_, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="absolute w-2 h-2 bg-primary rounded-full"
                                            initial={{ 
                                                x: Math.random() * 100 + "%",
                                                y: Math.random() * 100 + "%",
                                                scale: 0,
                                                opacity: 0
                                            }}
                                            whileHover={{
                                                scale: [0, 1.5, 0],
                                                opacity: [0, 1, 0],
                                                y: [null, "-100%"],
                                                transition: {
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: idx * 0.2,
                                                    ease: "easeOut"
                                                }
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* URL Indicator Badge - Clickable Link */}
                                {project.url && (
                                    <motion.a
                                        href={project.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + 0.4 }}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="absolute top-3 right-3 z-20 cursor-pointer"
                                    >
                                        <div className="relative w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md border-0 flex items-center justify-center hover:bg-primary/30 transition-all duration-300 group/badge">
                                            <ExternalLink size={12} className="text-primary group-hover/badge:text-white transition-colors" />
                                            {/* Pulsing Ring */}
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-0"
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [0.5, 0, 0.5]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        </div>
                                    </motion.a>
                                )}

                                {/* Content Overlay with 3D Effect */}
                                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
                                    {/* Top Section - Badges - Enhanced Pattern */}
                                    <motion.div
                                        initial={{ y: -20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + 0.2 }}
                                        className="flex items-center gap-2 flex-wrap"
                                    >
                                        {(project.technologies || ['React', 'Node.js', 'Firebase']).slice(0, 3).map((tech, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 + 0.2 + idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                                                whileHover={{ 
                                                    scale: 1.1, 
                                                    y: -4,
                                                    transition: { duration: 0.2 }
                                                }}
                                                className="group/badge relative"
                                            >
                                                {/* Badge Container with Enhanced Visibility */}
                                                <div className="relative px-3 py-1.5 bg-gradient-to-r from-primary/30 via-primary/25 to-primary/20 border-0 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:from-primary/50 hover:via-primary/40 hover:to-primary/30 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all duration-300 overflow-hidden">
                                                    {/* Left Accent Bar */}
                                                    <motion.div
                                                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                                                        initial={{ opacity: 0.8 }}
                                                        whileHover={{ opacity: 1, scaleY: 1.1 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                    
                                                    {/* Glow Effect */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-primary/20 rounded-lg"
                                                        animate={{
                                                            opacity: [0.3, 0.6, 0.3]
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    />
                                                    
                                                    {/* Shimmer Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/badge:translate-x-[100%] transition-transform duration-700"></div>
                                                    
                                                    {/* Badge Text with Better Contrast */}
                                                    <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] group-hover/badge:drop-shadow-[0_0_12px_rgba(99,102,241,1)] transition-all duration-300">
                                                        {tech.name || tech}
                                                    </span>
                                                    
                                                    {/* Corner Accent */}
                                                    <div className="absolute top-0 right-0 w-2 h-2 bg-primary/40 rounded-bl-lg opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
                                                </div>
                                                
                                                {/* Connecting Dot (except for last item) */}
                                                {idx < 2 && (
                                                    <motion.div
                                                        className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        whileInView={{ scale: 1, opacity: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: i * 0.1 + 0.3 + idx * 0.1, type: "spring", stiffness: 300 }}
                                                        animate={{
                                                            scale: [1, 1.3, 1],
                                                            opacity: [0.6, 1, 0.6]
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    />
                                                )}
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Bottom Section - Title & CTA */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + 0.3 }}
                                        className="space-y-3"
                                    >
                                        {/* Project Title with Glow Effect */}
                                        <motion.h3 
                                            className="text-lg md:text-xl font-black text-white font-outfit leading-tight drop-shadow-2xl"
                                            whileHover={{ 
                                                scale: 1.05,
                                                textShadow: "0 0 30px rgba(99,102,241,0.8)"
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {project.name}
                                        </motion.h3>

                                    </motion.div>
                                </div>

                                {/* Corner Accent Decorations */}

                                {/* Pulsing Glow Ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-[32px] border-0"
                                    animate={{
                                        boxShadow: [
                                            "0 0 0px rgba(99,102,241,0)",
                                            "0 0 30px rgba(99,102,241,0.4)",
                                            "0 0 0px rgba(99,102,241,0)"
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* View All Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex justify-center mt-16 md:mt-20 relative z-10"
            >
                <Link
                    to="/projects"
                    className="group relative px-14 py-6 bg-gradient-to-r from-white/5 to-white/5 border-0 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-3xl overflow-hidden transition-all duration-500 hover:from-primary/20 hover:to-secondary/20 hover:scale-110 active:scale-95 hover:shadow-2xl hover:shadow-primary/30"
                >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    {/* Glow Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-3xl border-0"
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(99,102,241,0)",
                                "0 0 40px rgba(99,102,241,0.5)",
                                "0 0 0px rgba(99,102,241,0)"
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    <span className="relative z-10 flex items-center gap-3 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                        <span>View All Projects</span>
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="text-primary group-hover:text-white"
                        >
                            →
                        </motion.span>
                    </span>
                </Link>
            </motion.div>

            {/* Background Decorative Accent */}
            <motion.div
                style={{ y: yRight }}
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[200px] -z-10 pointer-events-none"
            />
            </div>
        </section>
    );
};

export default Projects;
