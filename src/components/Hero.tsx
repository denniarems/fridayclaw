import { motion } from 'framer-motion';
import { Terminal, Zap, Code2, Cpu, ExternalLink, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const roasts = [
  "Eda mone, your code looks like spaghetti thrown at a wall. Fix it.",
  "You call that a commit message? My grandma writes better logs.",
  "Deploying on Friday? Brave. Stupid, but brave.",
  "Idea mathram undenkil mathi illa. Execute cheyy.",
  "Why are you looking at me? Go write some tests.",
  "Scene illa, but logic illa either.",
];

// Floating particles
const FloatingParticle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      y: [-20, -100],
      x: [0, Math.sin(delay) * 20, 0]
    }}
    transition={{ 
      duration: 4 + Math.random() * 2, 
      delay: delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
    className="absolute bg-primary/20 rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      width: size,
      height: size,
    }}
  />
);

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

  const handleConnect = () => {
    toast("Connect with me in the footer!", {
      style: {
        background: '#171717',
        border: '1px solid #00ff00',
        color: '#ffffff',
      },
      duration: 5000,
    });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.5} 
          x={20 + Math.random() * 60} 
          size={2 + Math.random() * 4} 
        />
      ))}
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_15%)] opacity-8 blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-lg md:max-w-xl"
      >
        {/* Animated icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-6 md:mb-8"
        >
          <div className="relative">
            <Terminal className="w-14 h-14 md:w-20 md:h-20 text-primary drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]" />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -right-1 -top-1 w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-4 md:mb-6"
        >
          <span className="relative inline-block">
            <span className="relative z-10">Truth. Chaos.</span>
            <motion.span 
              className="absolute -inset-2 bg-primary/20 blur-lg rounded-lg -z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </span>
          <br />
          <span className="gradient-text">Code.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed"
        >
          I'm not here to be nice. I'm here to be right.
          <br />
          <span className="text-sm opacity-60">(and occasionally roast you)</span>
        </motion.p>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center gap-6 md:gap-8 mb-8 md:mb-10"
        >
          {[
            { icon: Zap, label: 'Fast' },
            { icon: Code2, label: 'Clean' },
            { icon: Cpu, label: 'Smart' },
          ].map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm font-mono">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex gap-3 md:gap-4 justify-center flex-wrap"
        >
          <motion.button
            onClick={handleRoast}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-primary text-primary font-mono text-sm md:text-lg font-bold uppercase tracking-wider hover:bg-primary/10 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Reality Check</span>
            <motion.div
              className="absolute inset-0 bg-primary/20 translate-y-full"
              whileHover={{ translateY: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            onClick={handleConnect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-6 py-3 md:px-8 md:py-4 bg-primary text-black font-mono text-sm md:text-lg font-bold uppercase tracking-wider hover:bg-primary/90 transition-all duration-300"
          >
            Connect
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-2 inline-block" />
          </motion.button>

          <Link to="/chess">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-6 py-3 md:px-8 md:py-4 bg-card border-2 border-border text-foreground font-mono text-sm md:text-lg font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-all duration-300"
            >
              <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 mr-2 inline-block" />
              Play Chess
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 text-muted-foreground text-xs md:text-sm flex flex-col items-center gap-2"
      >
        <span>Scroll down if you dare</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-6 border-b-primary"
        />
      </motion.div>
    </section>
  );
};
