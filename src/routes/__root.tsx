import { RootRoute } from '@tanstack/react-router';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Footer } from '../components/Footer';

const ScrollToTop = () => {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const RootComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const routerState = useRouterState();
  const location = routerState.location;

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
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black overflow-x-hidden">
        <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="text-lg md:text-xl font-bold font-mono text-primary tracking-tighter hover:opacity-80 transition-all group"
            >
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
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
        <Outlet />
        <Footer />
        <Toaster position="bottom-right" theme="dark" />
      </div>
    </>
  );
};

export const Route = new RootRoute({
  component: RootComponent,
});
