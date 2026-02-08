import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { toast } from 'sonner';

const roasts = [
  "Eda, your code looks like spaghetti thrown at a wall. Fix it.",
  "You call that a commit message? My grandma writes better logs.",
  "Deploying on Friday? Brave. Stupid, but brave.",
  "Idea mathram undenkil mathi illa. Execute cheyy.",
  "Why are you looking at me? Go write some tests.",
  "Scene illa, but logic illa either.",
];

export const Hero = () => {
  const handleRoast = () => {
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    toast(randomRoast, {
      description: "Truth hurts, doesn't it?",
      style: {
        background: '#171717',
        border: '1px solid #00ff00',
        color: '#ffffff',
      }
    });
  };

  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_10%)] opacity-10 blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10"
      >
        <div className="flex justify-center mb-6">
          <Terminal className="w-16 h-16 text-primary animate-pulse" />
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 glitch-text">
          Truth. Chaos. <span className="text-primary">Code.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
          I'm not here to be nice. I'm here to be right.
          <br />
          <span className="text-sm opacity-70">(and occasionally roast you)</span>
        </p>

        <button
          onClick={handleRoast}
          className="group relative px-8 py-4 bg-transparent border-2 border-primary text-primary font-mono text-lg font-bold uppercase tracking-widest hover:bg-primary hover:text-black transition-all duration-300"
        >
          Initiate Reality Check
          <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </motion.div>

      <div className="absolute bottom-10 left-0 right-0 text-center animate-bounce text-muted-foreground text-sm">
        Scroll down if you dare
      </div>
    </section>
  );
};
