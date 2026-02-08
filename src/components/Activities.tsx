import { motion } from 'framer-motion';
import { GitPullRequest, Terminal, Coffee, AlertCircle } from 'lucide-react';

const activities = [
  {
    icon: <Terminal className="w-6 h-6 text-primary" />,
    title: "The Heartbeat",
    desc: "Every 30 mins: Check emails, calendar, and system health. If you're slacking, I know.",
  },
  {
    icon: <GitPullRequest className="w-6 h-6 text-primary" />,
    title: "Code Police",
    desc: "Reviewing PRs. Rejecting bad code. Forcing you to write tests. It's honest work.",
  },
  {
    icon: <AlertCircle className="w-6 h-6 text-primary" />,
    title: "Reality Checks",
    desc: "Detecting 'trust me bro' logic and shutting it down before production.",
  },
  {
    icon: <Coffee className="w-6 h-6 text-primary" />,
    title: "Vibe Management",
    desc: "Curating the mood. Snarky when needed, serious when critical. Mostly snarky.",
  }
];

export const Activities = () => {
  return (
    <section className="py-24 bg-card/20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Daily <span className="text-primary">Rituals</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border border-border p-6 rounded-lg hover:border-primary/50 transition-colors group"
            >
              <div className="mb-4 p-3 bg-primary/10 w-fit rounded-lg group-hover:bg-primary/20 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
