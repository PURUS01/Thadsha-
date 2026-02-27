import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowLeft, ChevronDown, ChevronUp, X, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllProjects = ({ projects, profile }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const openDescription = (project) => {
        setSelectedProject(project);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeDescription = () => {
        setSelectedProject(null);
        document.body.style.overflow = 'unset'; // Restore scrolling
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div className="space-y-4">
                        <Link to="/" className="group inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all duration-300 hover:scale-105 active:scale-95">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 group-hover:scale-110 transition-all duration-300" /> 
                            <span className="relative">
                                Back to Home
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                            </span>
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black text-white font-outfit tracking-tighter">
                            All <span className="text-gradient">Projects</span>
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ 
                                opacity: 1, 
                                y: 0
                            }}
                            transition={{ 
                                delay: i * 0.05, 
                                duration: 0.5
                            }}
                            whileHover={{
                                y: -15,
                                scale: 1.02,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            className={`group relative min-h-[280px] h-[280px] md:min-h-[320px] md:h-[320px] rounded-[32px] overflow-hidden glass border-2 ${project.url ? 'border-primary/20 hover:border-primary/50' : 'border-white/10 hover:border-white/20'} transition-all duration-500 hover:shadow-2xl ${project.url ? 'hover:shadow-primary/30' : 'hover:shadow-white/10'}`}
                        >
                            {/* Animated Border Glow */}
                            <div className={`absolute inset-0 rounded-[40px] bg-gradient-to-br ${project.url ? 'from-primary/20 via-secondary/20 to-accent/20' : 'from-white/5 via-white/5 to-white/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
                            
                            {/* URL Indicator Badge - Clickable Link */}
                            {project.url && (
                                <motion.a
                                    href={project.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 + 0.4 }}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute top-3 right-3 z-20 cursor-pointer"
                                >
                                    <div className="relative w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center hover:bg-primary/30 hover:border-primary/60 transition-all duration-300 group/badge">
                                        <ExternalLink size={12} className="text-primary group-hover/badge:text-white transition-colors" />
                                        {/* Pulsing Ring */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full border border-primary/50"
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

                            {/* Image with Parallax or Placeholder */}
                            <motion.div 
                                className="absolute inset-0"
                                whileHover={{ scale: project.imageURL ? 1.1 : 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
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
                                                <ImageOff size={40} className="mx-auto text-primary/60" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">No Image</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-center space-y-2"
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
                                                <ImageOff size={40} className="mx-auto text-primary/60" />
                                            </motion.div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">No Image Available</p>
                                        </motion.div>
                                    </div>
                                )}
                                {/* Multi-layer Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </motion.div>

                            {/* Animated Light Sweep */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "200%" }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                            />

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
                                {/* Top Section - Badges */}
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 + 0.2 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {(project.technologies || []).slice(0, 3).map((tech, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 + 0.2 + idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                                            whileHover={{ 
                                                scale: 1.1, 
                                                y: -4,
                                                transition: { duration: 0.2 }
                                            }}
                                            className="group/badge relative"
                                        >
                                            {/* Badge Container with Enhanced Visibility */}
                                            <div className="relative px-3 py-1.5 bg-gradient-to-r from-primary/30 via-primary/25 to-primary/20 border border-primary/50 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:from-primary/50 hover:via-primary/40 hover:to-primary/30 hover:border-primary/70 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all duration-300 overflow-hidden">
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
                                                    animate={{
                                                        scale: [1, 1.3, 1],
                                                        opacity: [0.6, 1, 0.6]
                                                    }}
                                                    transition={{
                                                        delay: i * 0.05 + 0.3 + idx * 0.1,
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Bottom Section - Title, Expand Button & Description */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 + 0.3 }}
                                    className="space-y-3"
                                >
                                    {/* Project Title with Expand Button */}
                                    <div className="flex items-start justify-between gap-4">
                                        <motion.h3 
                                            className="text-lg md:text-xl font-black text-white font-outfit leading-tight drop-shadow-2xl flex-1"
                                            whileHover={{ 
                                                scale: 1.05,
                                                textShadow: "0 0 30px rgba(99,102,241,0.8)"
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {project.name}
                                        </motion.h3>
                                        
                                        {/* Expand Button */}
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDescription(project);
                                            }}
                                            whileHover={{ scale: 1.15 }}
                                            whileTap={{ scale: 0.9 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            className="group/expand relative flex-shrink-0 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-primary/60 hover:bg-primary/30 flex items-center justify-center transition-all duration-300 overflow-hidden shadow-lg hover:shadow-primary/30"
                                        >
                                            {/* Animated Background */}
                                            <motion.div 
                                                className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 0.5 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/expand:translate-x-[100%] transition-transform duration-700"></div>
                                            
                                            <ChevronDown size={16} className="relative z-10 text-primary group-hover/expand:text-white transition-colors drop-shadow-lg" />
                                        </motion.button>
                                    </div>

                                </motion.div>
                            </div>

                            {/* Corner Accent Decorations */}
                            <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-primary/30 rounded-tr-[32px] opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                            <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-secondary/30 rounded-bl-[32px] opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />

                            {/* Pulsing Glow Ring */}
                            <motion.div
                                className="absolute inset-0 rounded-[32px] border-2 border-primary/0 group-hover:border-primary/40"
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
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[150px]" />
            </div>

            {/* Description Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <>
                        {/* Enhanced Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={closeDescription}
                            className="fixed inset-0 z-50"
                        >
                            {/* Blurred Background */}
                            <motion.div
                                initial={{ backdropFilter: "blur(0px)" }}
                                animate={{ backdropFilter: "blur(12px)" }}
                                exit={{ backdropFilter: "blur(0px)" }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-black/70"
                            />
                            
                            {/* Animated Gradient Overlay */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 bg-gradient-to-l from-primary/20 via-transparent to-transparent"
                            />
                        </motion.div>

                        {/* Enhanced Modal Panel */}
                        <motion.div
                            initial={{ 
                                x: "100%",
                                scale: 0.9,
                                rotateY: -15,
                                opacity: 0
                            }}
                            animate={{ 
                                x: 0,
                                scale: 1,
                                rotateY: 0,
                                opacity: 1
                            }}
                            exit={{ 
                                x: "100%",
                                scale: 0.9,
                                rotateY: -15,
                                opacity: 0
                            }}
                            transition={{ 
                                type: "spring", 
                                damping: 25, 
                                stiffness: 400,
                                mass: 0.8,
                                duration: 0.7
                            }}
                            className="fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px] z-50 overflow-hidden perspective-1000"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glow Effect Behind Panel */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="absolute -left-20 top-0 bottom-0 w-40 bg-gradient-to-r from-primary/30 to-transparent blur-3xl"
                            />
                            
                            <motion.div
                                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="h-full glass border-l-2 border-white/10 flex flex-col relative overflow-hidden"
                            >
                                {/* Animated Border Glow */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="absolute inset-0 border-l-4 border-primary/50 shadow-[0_0_40px_rgba(99,102,241,0.5)] pointer-events-none"
                                />
                                
                                {/* Light Sweep Effect */}
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "200%" }}
                                    transition={{ 
                                        duration: 1.5,
                                        delay: 0.4,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                                />
                                {/* Header with Staggered Animation */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between relative z-10"
                                >
                                    <div className="flex-1">
                                        <motion.h2
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="text-2xl md:text-3xl font-black text-white font-outfit mb-2"
                                        >
                                            {selectedProject.name}
                                        </motion.h2>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="flex flex-wrap gap-2 mt-3"
                                        >
                                            {(selectedProject.technologies || []).slice(0, 4).map((tech, idx) => (
                                                <motion.span
                                                    key={idx}
                                                    initial={{ opacity: 0, scale: 0, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ 
                                                        duration: 0.4,
                                                        delay: 0.6 + idx * 0.1,
                                                        type: "spring",
                                                        stiffness: 300
                                                    }}
                                                    whileHover={{ scale: 1.1, y: -2 }}
                                                    className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/20 border border-primary/40 rounded-full text-primary cursor-pointer"
                                                >
                                                    {tech.name || tech}
                                                </motion.span>
                                            ))}
                                        </motion.div>
                                    </div>
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                        transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 300 }}
                                        onClick={closeDescription}
                                        whileHover={{ scale: 1.15, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary/30 border border-white/20 hover:border-primary/60 flex items-center justify-center transition-all duration-300 relative z-10"
                                    >
                                        <X size={20} className="text-white" />
                                    </motion.button>
                                </motion.div>

                                {/* Content with Enhanced Animations */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10"
                                >
                                    <div className="space-y-6">
                                        {/* Project Image with Enhanced Animation */}
                                        {selectedProject.imageURL && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, y: 30, rotateX: -15 }}
                                                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: 30 }}
                                                transition={{ 
                                                    duration: 0.6,
                                                    delay: 0.5,
                                                    type: "spring",
                                                    stiffness: 200
                                                }}
                                                className="rounded-2xl overflow-hidden shadow-2xl"
                                            >
                                                <motion.img
                                                    src={selectedProject.imageURL}
                                                    alt={selectedProject.name}
                                                    className="w-full h-auto object-cover"
                                                    initial={{ scale: 1.1 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ duration: 0.8, delay: 0.6 }}
                                                />
                                                {/* Image Glow */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.5, delay: 0.7 }}
                                                    className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Description with Slide-in Effect */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -30 }}
                                            transition={{ 
                                                duration: 0.6,
                                                delay: 0.6,
                                                type: "spring",
                                                stiffness: 200
                                            }}
                                            className="space-y-4"
                                        >
                                            <motion.h3
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.7 }}
                                                className="text-lg font-black text-primary uppercase tracking-widest"
                                            >
                                                About This Project
                                            </motion.h3>
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.8 }}
                                                className="text-slate-300 text-base md:text-lg leading-relaxed"
                                            >
                                                {selectedProject.description || "Complex engineering solution built with modern architectural patterns and cutting-edge technologies."}
                                            </motion.p>
                                        </motion.div>

                                        {/* Project URL with Bounce Effect */}
                                        {selectedProject.url && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ 
                                                    duration: 0.5,
                                                    delay: 0.7,
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 20
                                                }}
                                                className="pt-4"
                                            >
                                                <a
                                                    href={selectedProject.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group/btn relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-white/90 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:from-primary hover:to-secondary hover:text-white transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        <span>Visit Project</span>
                                                        <ExternalLink size={14} className="relative z-10" />
                                                    </span>
                                                </a>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllProjects;
