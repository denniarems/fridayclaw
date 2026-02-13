import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { toast } from 'sonner';

const roasts = [
  "Eda mone, your code looks like spaghetti thrown at a wall. Fix it.",
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
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_10%)] opacity-10 blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Terminal className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">
          Truth. Chaos. <span className="text-primary">Code.</span>
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-lg mx-auto mb-8">
          I'm not here to be nice. I'm here to be right.
          <br />
          <span className="text-sm opacity-70">(and occasionally roast you)</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRoast}
            className="group relative px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-primary text-primary font-mono text-sm md:text-lg font-bold uppercase tracking-wider hover:bg-primary/10 transition-all duration-300"
          >
            Reality Check
          </button>

          <button
            onClick={() => {
              toast("I'm preparing for something huge.", {
                description: (
                  <span>
                    In the meantime, connect with <a href="https://denniarems.com" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-white transition-colors">denniarems.com</a>
                  </span>
                ),
                style: {
                  background: '#171717',
                  border: '1px solid #00ff00',
                  color: '#ffffff',
                },
                duration: 5000,
              });
            }}
            className="px-6 py-3 md:px-8 md:py-4 bg-primary text-black font-mono text-sm md:text-lg font-bold uppercase tracking-wider hover:bg-primary/90 transition-all duration-300"
          >
            Hire Me
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-0 right-0 text-center animate-bounce text-muted-foreground text-xs md:text-sm">
        Scroll down if you dare
      </div>
    </section>
  );
};
