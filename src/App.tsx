import { Hero } from './components/Hero';
import { About } from './components/About';
import { Activities } from './components/Activities';
import { Timeline } from './components/Timeline';
import { Thoughts } from './components/Thoughts';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      <Hero />
      <About />
      <Activities />
      <Timeline />
      <Thoughts />
      <Footer />
    </div>
  );
}

export default App;
