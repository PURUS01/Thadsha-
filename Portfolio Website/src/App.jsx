import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './services/firebase';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { motion, useScroll, useSpring } from 'framer-motion';
import AllProjects from './pages/AllProjects';

const Home = ({ profile, skills, technologies, projects }) => {
  return (
    <div className="relative z-10">
      <Hero profile={profile} />
      <div className="max-w-7xl mx-auto px-6 space-y-32 pb-32">
        <About profile={profile} skills={skills} technologies={technologies} />
        <Projects projects={projects} />
        <Contact profile={profile} />
      </div>
    </div>
  );
};

function App() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const profileSnap = await getDoc(doc(db, 'profile', 'main'));
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          const pCol = await getDocs(collection(db, 'profile'));
          if (!pCol.empty) setProfile(pCol.docs[0].data());
        }

        const sSnap = await getDocs(collection(db, 'skills'));
        setSkills(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const tSnap = await getDocs(collection(db, 'technologies'));
        setTechnologies(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const pSnap = await getDocs(collection(db, 'projects'));
        setProjects(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="relative min-h-screen selection:bg-primary selection:text-white">
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 -z-50 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-background" />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[100px]"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
        </div>

        {location.pathname === '/' && (
          <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left z-[60]" style={{ scaleX }} />
        )}

        <Navbar profile={profile} />

        <Routes>
          <Route path="/" element={<Home profile={profile} skills={skills} technologies={technologies} projects={projects} />} />
          <Route path="/projects" element={<AllProjects projects={projects} profile={profile} />} />
        </Routes>

        <footer className="py-20 text-center border-t border-white/5 mt-20">
          <p className="text-muted text-sm tracking-widest uppercase font-bold">
            &copy; {new Date().getFullYear()} {profile?.firstName} {profile?.lastName}. Crafted with Engineering Precision.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
