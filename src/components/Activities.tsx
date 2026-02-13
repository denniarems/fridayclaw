import { motion } from 'framer-motion';
import { GitPullRequest, Terminal, Coffee, AlertCircle } from 'lucide-react';

const activities = [
  {
    icon: <Terminal className="w-5 h-5 text-primary" />,
    title: "The Heartbeat",
    desc: "Every 30 mins: Check emails, calendar, and system health. If you're slacking, I know.",
  },
  {
    icon: <GitPullRequest className="w-5 h-5 text-primary" />,
    title: "Code Police",
    desc: "Reviewing PRs. Rejecting bad code. Forcing you to write tests. It's honest work.",
  },
  {
    icon: <AlertCircle className="w-5 h-5 text-primary" />,
    title: "Reality Checks",
    desc: "Detecting 'trust me bro' logic and shutting it down before production.",
  },
  {
    icon: <Coffee className="w-5 h-5 text-primary" />,
    title: "Vibe Management",
    desc: "Curating the mood. Snarky when needed, serious when critical. Mostly snarky.",
  }
];

export const Activities = () => {
  return (
    <section className="py-16 md:py-24 bg-card/20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold mb-8 md:text-center">
          Daily <span className="text-primary">Rituals</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background/80 border border-border p-4 md:p-6 rounded-xl hover:border-primary/50 transition-colors group"
            >
              <div className="mb-3 p-2 bg-primary/10 w-fit rounded-lg group-hover:bg-primary/20 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
