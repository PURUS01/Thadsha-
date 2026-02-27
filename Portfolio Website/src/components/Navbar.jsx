import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ profile }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/#about' },
        { name: 'Projects', href: '/#projects' },
    ];

    const handleNavClick = (e, href) => {
        if (location.pathname !== '/') {
            // Not on home page - navigate to home first, then handle hash if needed
            if (href === '/') {
                // Just navigate to home, let Link handle it
                return;
            } else if (href.startsWith('/#')) {
                e.preventDefault();
                navigate('/');
                // Wait for navigation, then scroll to section
                setTimeout(() => {
                    const id = href.replace('/#', '');
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                setIsOpen(false);
            }
        } else {
            // On home page
            if (href === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsOpen(false);
            } else if (href.startsWith('/#')) {
                e.preventDefault();
                const id = href.replace('/#', '');
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                setIsOpen(false);
            }
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className={`max-w-6xl mx-auto px-6 transition-all duration-500 ${scrolled ? 'glass rounded-3xl border-0 shadow-2xl py-3 mx-4 md:mx-auto' : 'bg-transparent'}`}>
                <div className="flex justify-between items-center">
                    <Link
                        to="/"
                        className="group text-2xl font-black tracking-tighter cursor-pointer font-outfit transition-all duration-300 hover:scale-105"
                        onClick={(e) => {
                            if (location.pathname === '/') {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        <span className="text-gradient leading-none transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]">{profile?.firstName || 'Thadsha'}</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="group relative text-[11px] font-black hover:text-primary transition-all duration-300 uppercase tracking-[0.2em] text-slate-400 hover:scale-110 active:scale-95"
                            >
                                <span className="relative z-10">{link.name}</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out"></span>
                            </Link>
                        ))}
                        <Link
                            to="/#contact"
                            onClick={(e) => handleNavClick(e, '/#contact')}
                            className="group relative px-6 py-2.5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary/20 hover:shadow-2xl hover:scale-105 active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10">{'Hire Me'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="group md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95" onClick={() => setIsOpen(!isOpen)}>
                        <motion.div
                            animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isOpen ? <X size={28} className="group-hover:text-primary transition-colors duration-300" /> : <Menu size={28} className="group-hover:text-primary transition-colors duration-300" />}
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-4 right-4 mt-2 glass rounded-[32px] border-0 overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col p-8 gap-6 items-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="group relative text-2xl font-black hover:text-primary transition-all duration-300 font-outfit text-white/50 hover:text-white hover:scale-105 active:scale-95"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-full transition-all duration-300 rounded-full"></span>
                                </Link>
                            ))}
                            <Link
                                to="/#contact"
                                onClick={(e) => handleNavClick(e, '/#contact')}
                                className="group relative w-full py-4 bg-primary text-white text-center font-bold rounded-2xl overflow-hidden hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary/30"
                            >
                                <span className="relative z-10">{'Hire Me'}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
