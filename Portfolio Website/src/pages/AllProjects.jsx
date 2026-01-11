import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllProjects = ({ projects, profile }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black text-white font-outfit tracking-tighter">
                            All <span className="text-gradient">Projects.</span>
                        </h1>
                        <p className="text-slate-400 text-xl max-w-2xl font-medium">
                            A complete archive of engineering solutions, architectural patterns, and digital products.
                        </p>
                    </div>
                    <div className="hidden lg:block">
                        <div className="px-6 py-3 glass rounded-2xl border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Total Projects</p>
                            <p className="text-3xl font-black text-white">{projects.length}</p>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            className="group relative aspect-square rounded-[32px] overflow-hidden glass border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img
                                    src={project.imageURL || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"}
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-125 transition-all duration-[1.5s]"
                                    alt={project.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                            </div>

                            {/* Light Sweep Effect */}
                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                            {/* Content */}
                            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(project.technologies || []).slice(0, 3).map((tech, idx) => (
                                            <span key={idx} className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-primary/20 border border-primary/20 rounded-full text-primary">
                                                {tech.name || tech}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-black text-white mb-1 font-outfit leading-tight">{project.name}</h3>
                                    <p className="text-slate-400 text-xs line-clamp-1 mb-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        {project.description || "Complex engineering solution built with modern architectural patterns."}
                                    </p>
                                    {project.url && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center w-fit px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl"
                                            >
                                                Inspect <ExternalLink size={12} className="ml-2" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[150px]" />
            </div>
        </div>
    );
};

export default AllProjects;
