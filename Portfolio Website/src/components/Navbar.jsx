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
        { name: 'About', href: '/#about' },
        { name: 'Skills', href: '/#skills' },
        { name: 'Projects', href: '/#projects' },
        { name: 'Contact', href: '/#contact' },
    ];

    const handleNavClick = (e, href) => {
        if (location.pathname !== '/') {
            // Not on home page, let the default Link behavior or manual navigation handle it
        } else if (href.startsWith('/#')) {
            e.preventDefault();
            const id = href.replace('/#', '');
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className={`max-w-6xl mx-auto px-6 transition-all duration-500 ${scrolled ? 'glass rounded-3xl border-white/5 shadow-2xl py-3 mx-4 md:mx-auto' : 'bg-transparent'}`}>
                <div className="flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-2xl font-black tracking-tighter cursor-pointer font-outfit"
                        onClick={(e) => {
                            if (location.pathname === '/') {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                    >
                        <span className="text-gradient leading-none">{profile?.firstName || 'Thadsha'}</span>
                        <span className="text-white opacity-40 leading-none">.</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="text-[11px] font-black hover:text-primary transition-all uppercase tracking-[0.2em] text-slate-400 hover:scale-110 active:scale-95"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/#contact"
                            onClick={(e) => handleNavClick(e, '/#contact')}
                            className="px-6 py-2.5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/20"
                        >
                            Hire Me
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
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
                        className="md:hidden absolute top-full left-4 right-4 mt-2 glass rounded-[32px] border-white/10 overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col p-8 gap-6 items-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-2xl font-black hover:text-primary transition-colors font-outfit text-white/50 hover:text-white"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/#contact"
                                onClick={(e) => handleNavClick(e, '/#contact')}
                                className="w-full py-4 bg-primary text-white text-center font-bold rounded-2xl"
                            >
                                Hire Me
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
