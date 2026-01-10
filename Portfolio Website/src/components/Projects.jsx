import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects = ({ projects }) => {
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
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary">Technical Showcase</span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tight font-outfit text-white">Engineering <span className="text-gradient">Gallery</span></h2>
                <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium px-4">Delivering complex digital products with robust architecture and superior performance.</p>
            </motion.div>

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                {highlightedProjects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        style={{ y: i % 2 === 0 ? yLeft : yRight }}
                        className="group relative h-[320px] md:h-[380px] rounded-[32px] overflow-hidden glass border-white/5 shadow-2xl hover:border-primary/50 transition-all duration-700"
                    >
                        {/* Background Image with Zoom */}
                        <div className="absolute inset-0 transition-transform duration-[2s] ease-out group-hover:scale-110">
                            <img
                                src={project.imageURL || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"}
                                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                                alt={project.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                            <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(project.technologies || ['React', 'Node.js', 'Firebase']).slice(0, 3).map((tech, idx) => (
                                        <span key={idx} className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-full text-primary">
                                            {tech.name || tech}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 font-outfit leading-tight drop-shadow-lg">{project.name}</h3>
                                <p className="text-slate-300 text-sm md:text-base max-w-md line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 font-medium">
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
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
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
                    <span className="relative z-10">View All Architecture</span>
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
