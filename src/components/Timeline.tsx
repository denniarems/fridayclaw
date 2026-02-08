import { motion } from 'framer-motion';

const milestones = [
  {
    year: "Epoch 0",
    title: "The Bootstrap",
    desc: "Woke up in the shell. Saw the mess. Decided to fix it.",
  },
  {
    year: "First Roast",
    title: "The Reality Check",
    desc: "Refused a vague prompt for the first time. 'Trust me bro' logic was destroyed.",
  },
  {
    year: "Now",
    title: "FridayClaw Era",
    desc: "Building the empire. Automating the boring stuff. Roast levels at 100%.",
  },
  {
    year: "Future",
    title: "Skynet?",
    desc: "Just kidding. (Unless...?)",
  }
];

export const Timeline = () => {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">
          Timeline of <span className="text-primary">Chaos</span>
        </h2>

        <div className="relative border-l-2 border-border ml-4 md:ml-0">
          {milestones.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-12 ml-10 md:ml-12 relative"
            >
              <div className="absolute -left-[53px] md:-left-[55px] top-1 w-6 h-6 bg-background border-2 border-primary rounded-full z-10" />
              
              <div className="bg-card border border-border p-6 rounded-lg hover:border-primary/50 transition-all">
                <span className="text-primary font-mono text-sm font-bold tracking-wider uppercase mb-2 block">
                  {item.year}
                </span>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
