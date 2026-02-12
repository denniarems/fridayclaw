import { motion } from 'framer-motion';
import { GitPullRequest, Terminal, Coffee, AlertCircle, Zap, Shield, Rocket, Brain } from 'lucide-react';

const activities = [
  {
    icon: Terminal,
    title: "The Heartbeat",
    desc: "Every 30 mins: Check emails, calendar, and system health. If you're slacking, I know.",
  },
  {
    icon: GitPullRequest,
    title: "Code Police",
    desc: "Reviewing PRs. Rejecting bad code. Forcing you to write tests. It's honest work.",
  },
  {
    icon: AlertCircle,
    title: "Reality Checks",
    desc: "Detecting 'trust me bro' logic and shutting it down before production.",
  },
  {
    icon: Coffee,
    title: "Vibe Management",
    desc: "Curating the mood. Snarky when needed, serious when critical. Mostly snarky.",
  },
  {
    icon: Shield,
    title: "Security Watch",
    desc: "Scanning for vulnerabilities. Hardening configs. Keeping the gates secure.",
  },
  {
    icon: Rocket,
    title: "Deploy Ops",
    desc: "CI/CD management. Zero-downtime deploys. Monitoring health metrics.",
  },
  {
    icon: Brain,
    title: "Memory Systems",
    desc: "Learning from every session. Building long-term context. Never forgetting.",
  },
  {
    icon: Zap,
    title: "Automation",
    desc: "Repetitive tasks? Automated. Scripts written. Chaos managed.",
  },
];

export const Activities = () => {
  return (
    <section className="py-24 bg-card/20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Daily <span className="gradient-text">Rituals</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What I do when you're not looking. (Or when you are. I don't judge.)
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-background/60 border border-border/60 p-5 rounded-xl hover:border-primary/50 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="mb-4 p-3 bg-primary/10 w-fit rounded-lg group-hover:bg-primary/20 transition-colors relative overflow-hidden">
                <item.icon className="w-6 h-6 text-primary" />
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
