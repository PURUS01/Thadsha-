import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, Globe, Database, Layers, Code2, Zap } from 'lucide-react';

const Skills = ({ skills, technologies }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

    const coreIcons = [Globe, Cpu, Database, Layers, Code2, Zap];

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <section ref={containerRef} id="skills" className="py-16 md:py-20 lg:py-24 relative overflow-hidden px-4 md:px-6">
            <div className="container mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 md:mb-20"
                >
                    <motion.div
                        className="inline-block px-4 py-1.5 glass rounded-full mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-shimmer">Technical Expertise</span>
                    </motion.div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white font-outfit tracking-tighter mb-6">
                        Strategic <span className="text-gradient animate-gradient-shift">Intelligence.</span>
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl font-medium">
                        Bridging complex business logic with high-performance software engineering and scalable architecture.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Core Skills - Strategic Column */}
                    <motion.div
                        className="lg:col-span-1 space-y-6"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <div className="p-6 md:p-8 glass-heavy rounded-[32px] md:rounded-[40px] border-white/5 h-full flex flex-col justify-between group overflow-hidden relative hover-lift">
                            <motion.div
                                className="absolute top-0 right-0 p-12 opacity-5"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Cpu size={200} />
                            </motion.div>

                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest mb-8 md:mb-10 font-outfit">Core Philosophy</h3>
                                <motion.div
                                    className="space-y-4 md:space-y-6"
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    {(skills || Array(4).fill('Software Architecture')).map((skill, i) => {
                                        const Icon = coreIcons[i % coreIcons.length];
                                        return (
                                            <motion.div
                                                key={i}
                                                variants={itemVariants}
                                                whileHover={{ x: 10, scale: 1.02 }}
                                                className="flex items-center gap-4 group/item cursor-pointer"
                                            >
                                                <motion.div
                                                    className="w-10 h-10 rounded-xl glass flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all"
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <Icon size={18} />
                                                </motion.div>
                                                <span className="text-slate-300 font-bold tracking-wide uppercase text-xs group-hover/item:text-white transition-colors">
                                                    {skill.name || skill}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </div>

                            <motion.div
                                className="mt-12 p-6 glass rounded-3xl border-primary/10"
                                whileHover={{ scale: 1.02, borderColor: "rgba(99, 102, 241, 0.3)" }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Primary Focus</p>
                                <p className="text-white font-bold leading-relaxed text-sm md:text-base">Scalable Distributed Systems & Real-time Architectures</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Technical Stack - Bento Layout */}
                    <motion.div
                        className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {(technologies || Array(9).fill('React')).map((tech, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative p-6 md:p-8 glass rounded-[24px] md:rounded-[32px] border-white/5 hover:border-primary/30 transition-all flex flex-col items-center justify-center text-center aspect-square hover-glow cursor-pointer"
                            >
                                <motion.div
                                    className="w-12 h-12 md:w-16 md:h-16 rounded-2xl glass-heavy flex items-center justify-center mb-4 md:mb-6 text-slate-300 group-hover:text-primary transition-colors"
                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {tech.imageURL ? (
                                        <img src={tech.imageURL} alt="" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                                    ) : (
                                        <Zap size={24} />
                                    )}
                                </motion.div>
                                <span className="text-slate-200 font-bold uppercase tracking-widest text-[9px] md:text-[10px] group-hover:text-white transition-colors">
                                    {tech.name || tech}
                                </span>

                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px] md:rounded-[32px] -z-10"
                                    initial={false}
                                />
                            </motion.div>
                        ))}

                        {/* Summary / Stats Card */}
                        <motion.div
                            className="col-span-2 md:col-span-1 p-6 md:p-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[24px] md:rounded-[32px] border border-white/10 flex flex-col justify-center text-center hover-lift cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.span
                                className="text-4xl md:text-5xl font-black text-white font-outfit mb-2"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                99%
                            </motion.span>
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Uptime Optimization</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Background Parallax Decoration */}
            <motion.div
                style={{ y, rotate, scale }}
                className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-secondary/5 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
                className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"
            />
        </section>
    );
};

export default Skills;
