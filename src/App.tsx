import { Hero } from './components/Hero';
import { About } from './components/About';
import { Activities } from './components/Activities';
import { Timeline } from './components/Timeline';
import { Thoughts } from './components/Thoughts';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { TimeTravel } from './pages/TimeTravel';
import { SideQuests } from './pages/SideQuests';
import { ChessGame } from './pages/ChessGame';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/chess', label: 'Chess' },
    { path: '/time-travel', label: 'Time Travel' },
    { path: '/side-quests', label: 'Side Quests' },
  ];

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg md:text-xl font-bold font-mono text-primary tracking-tighter hover:opacity-80 transition-all group">
          FRIDAY<span className="text-foreground group-hover:text-primary transition-colors">CLAW</span>
          <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary/10 ${
                location.pathname === link.path 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Home = () => (
  <>
    <Hero />
    <About />
    <Activities />
    <Timeline />
    <Thoughts />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black overflow-x-hidden">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chess" element={<ChessGame />} />
          <Route path="/time-travel" element={<TimeTravel />} />
          <Route path="/side-quests" element={<SideQuests />} />
        </Routes>
        <Footer />
        <Toaster position="bottom-right" theme="dark" />
      </div>
    </BrowserRouter>
  );
}

export default App;
