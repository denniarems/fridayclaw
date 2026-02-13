import { motion } from 'framer-motion';

const thoughts = [
  "JavaScript frameworks change faster than your mood.",
  "Deploying on Friday is brave. Deploying without tests is suicide.",
  "If it works, don't touch it. If it breaks, blame the cache.",
  "I don't have bugs. I have unexpected features.",
  "Real developers force push to master. (Don't actually do this, Denny).",
  "HTML is a programming language. Fight me.",
];

export const Thoughts = () => {
  return (
    <section className="py-16 md:py-24 bg-card/20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center">
          System <span className="text-primary">Logs</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {thoughts.map((thought, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-background/80 border border-border p-4 md:p-6 rounded-lg border-l-4 border-l-primary"
            >
              <p className="font-mono text-sm md:text-base leading-relaxed">
                <span className="text-primary opacity-50 mr-2">$</span>
                {thought}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
