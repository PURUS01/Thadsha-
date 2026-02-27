import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, Mail, MapPin, Linkedin, Github } from 'lucide-react';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { toast, Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const Contact = ({ profile }) => {
    const theme = useTheme();
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
    const [sending, setSending] = useState(false);
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
            toast.error("Email service not configured.");
            console.error("Missing EmailJS environment variables.");
            return;
        }

        setSending(true);

        try {
            const templateParams = {
                from_name: formState.name,
                from_email: formState.email,
                message: formState.message,
                to_name: `${profile?.firstName || 'Thadsha'} ${profile?.lastName || ''}`,
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [
                    theme?.primary || '#6366f1',
                    theme?.secondary || '#a855f7',
                    theme?.accent || '#f43f5e'
                ]
            });

            toast.success("Message sent successfully!");
            setFormState({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("FAILED to send message:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <section ref={sectionRef} id="contact" className="pt-0 pb-0 relative overflow-hidden">
            <Toaster position="bottom-right" reverseOrder={false} />
            {/* Theme Background Glow */}
            <motion.div
                style={{ scale: glowScale, backgroundColor: theme?.secondary || '#a855f7' }}
                className="absolute top-1/2 right-1/4 w-[650px] h-[650px] rounded-full blur-[150px] opacity-10 -z-10 transition-all duration-1000"
            />

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-12 md:py-16">

                {/* Info Side */}
                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="group relative inline-block px-4 py-1.5 glass rounded-full mb-8 border-0 cursor-pointer transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-primary group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all duration-300">Get In Touch</span>
                        </motion.div>
                        <h2 className="text-6xl md:text-8xl font-black text-white font-outfit tracking-tighter leading-none mb-10">
                            Let's <br /> <span className="text-gradient">Connect</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md leading-relaxed">
                            Have a technical challenge or a visionary project? Let's connect and architect something extraordinary.
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        {[
                            { 
                                icon: Mail, 
                                label: 'Email', 
                                value: profile?.email || 'hello@thadsha.dev', 
                                href: profile?.email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}` : `mailto:${profile?.email || 'hello@thadsha.dev'}` 
                            },
                            { 
                                icon: MapPin, 
                                label: 'Location', 
                                value: profile?.address || 'Global / Remote',
                                href: profile?.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}` : '#'
                            },
                            { 
                                icon: Linkedin, 
                                label: 'LinkedIn', 
                                value: 'LinkedIn', 
                                href: 'https://www.linkedin.com/in/thadshajini-rajakulasingam/' 
                            }
                        ].map((item, i) => (
                            <motion.a
                                key={i}
                                href={item.href}
                                target={item.href.startsWith('http') ? '_blank' : undefined}
                                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                                whileHover={{ x: 10, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="group relative flex items-center gap-6 p-6 glass rounded-3xl border-0 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                <div className="relative z-10 w-12 h-12 rounded-2xl glass-heavy flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <item.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors duration-300">{item.label}</p>
                                    <p className="text-white font-bold group-hover:text-primary transition-colors duration-300">{item.value}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-1 glass-heavy rounded-[48px] border-0 shadow-premium"
                >
                    <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-4">Identification</label>
                            <input
                                type="text"
                                required
                                value={formState.name}
                                onChange={e => setFormState({ ...formState, name: e.target.value })}
                                placeholder="YOUR FULL NAME"
                                className="w-full px-8 py-5 glass rounded-2xl border-0 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:scale-[1.02] transition-all duration-300 font-bold tracking-widest text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-4">Digital Address</label>
                            <input
                                type="email"
                                required
                                value={formState.email}
                                onChange={e => setFormState({ ...formState, email: e.target.value })}
                                placeholder="YOUR EMAIL ADDRESS"
                                className="w-full px-8 py-5 glass rounded-2xl border-0 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:scale-[1.02] transition-all duration-300 font-bold tracking-widest text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] pl-4">Communication</label>
                            <textarea
                                rows="5"
                                required
                                value={formState.message}
                                onChange={e => setFormState({ ...formState, message: e.target.value })}
                                placeholder="DESCRIBE THE ARCHITECTURE OR CHALLENGE..."
                                className="w-full px-8 py-5 glass rounded-2xl border-white/5 text-white placeholder:text-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:scale-[1.02] transition-all duration-300 font-bold tracking-widest text-xs resize-none hover:border-white/10"
                            />
                        </div>

                        <button
                            disabled={sending}
                            className="group relative w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-2xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden hover:scale-[1.02] active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                {sending ? 'Transmitting...' : 'Initiate Contact'}
                                {!sending && <Send size={14} className="group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:rotate-12 transition-all duration-300" />}
                            </span>
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
