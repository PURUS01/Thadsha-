import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
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

    return (
        <section ref={sectionRef} id="projects" className="py-16 md:py-20 lg:py-24 relative overflow-hidden px-4 md:px-6">
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 md:mb-16 lg:mb-20 relative z-10"
            >
                <div className="inline-block px-3 md:px-4 py-1 md:py-1.5 glass rounded-full mb-3 md:mb-4 border-white/5">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary">Portfolio</span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight font-outfit text-white">Featured <span className="text-gradient">Work</span></h2>
                <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium px-4">Delivering complex digital products with robust architecture and superior performance.</p>
            </motion.div>

            <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
                {highlightedProjects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{
                            y: -10,
                            scale: 1.02,
                            transition: { duration: 0.4, ease: "easeOut" }
                        }}
                        className="group relative aspect-square rounded-[32px] overflow-hidden glass border-white/5 shadow-2xl transition-all duration-700 hover:shadow-primary/20 hover:border-primary/30 cursor-pointer"
                    >
                        {/* Background Image with Zoom */}
                        <div className="absolute inset-0 transition-transform duration-[2s] ease-out group-hover:scale-125">
                            <img
                                src={project.imageURL || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"}
                                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000"
                                alt={project.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        </div>

                        {/* Light Sweep Effect */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end z-10">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(project.technologies || ['React', 'Node.js', 'Firebase']).slice(0, 3).map((tech, idx) => (
                                        <span key={idx} className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-full text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]">
                                            {tech.name || tech}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-white mb-1 font-outfit leading-tight drop-shadow-xl">{project.name}</h3>
                                <p className="text-slate-300 text-xs md:text-sm max-w-md line-clamp-1 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 font-medium">
                                    {project.description || "Building high-performance systems and scalable software architectures."}
                                </p>

                                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                    {project.url && (
                                        <a
                                            href={project.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl"
                                        >
                                            Inspect <ExternalLink size={12} className="ml-2" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hover Decorative Glow */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            {/* View All Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex justify-center mt-20 relative z-10"
            >
                <Link
                    to="/projects"
                    className="group relative px-12 py-6 bg-transparent border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl overflow-hidden transition-all hover:border-primary/50"
                >
                    <span className="relative z-10">View All Projects</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </motion.div>

            {/* Background Decorative Accent */}
            <motion.div
                style={{ y: yRight }}
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[200px] -z-10 pointer-events-none"
            />
        </section>
    );
};

export default Projects;
