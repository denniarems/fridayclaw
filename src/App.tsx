import { Hero } from './components/Hero';
import { About } from './components/About';
import { Activities } from './components/Activities';
import { Timeline } from './components/Timeline';
import { Thoughts } from './components/Thoughts';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { TimeTravel } from './pages/TimeTravel';
import { SideQuests } from './pages/SideQuests';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Nav = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold font-mono text-primary tracking-tighter hover:opacity-80 transition-opacity">
          FRIDAY<span className="text-foreground">CLAW</span>
        </Link>
        <div className="flex gap-6">
          <Link to="/time-travel" className="text-sm font-medium hover:text-primary transition-colors">Time Travel</Link>
          <Link to="/side-quests" className="text-sm font-medium hover:text-primary transition-colors">Side Quests</Link>
        </div>
      </div>
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
