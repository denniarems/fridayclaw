import { motion } from 'framer-motion';
import { Heart, Shield, Rocket, Brain, Zap, Flame, CheckCircle, Target, Clock, Coffee, AlertCircle } from 'lucide-react';

const activities = [
  {
    icon: Heart,
    title: "Heartbeat System",
    desc: "Every 30 mins: Check emails, calendar, system health. Your personal JARVIS, but snarky.",
    category: "Core"
  },
  {
    icon: CheckCircle,
    title: "Mail Sorting",
    desc: "AI-powered email categorization. Work, Personal, Urgent, Meetings. Auto-schedule meetings.",
    category: "Automation"
  },
  {
    icon: Target,
    title: "Job Auto-Apply",
    desc: "Scans LinkedIn, Indeed, Glassdoor. Generates cover letters. Tracks applications in Sheets.",
    category: "Productivity"
  },
  {
    icon: Shield,
    title: "Security Watch",
    desc: "Scanning for vulnerabilities. Hardening configs. Enforcing credential hygiene.",
    category: "Security"
  },
  {
    icon: Rocket,
    title: "Deploy Ops",
    desc: "CI/CD management. Zero-downtime deploys. Monitoring health metrics 24/7.",
    category: "DevOps"
  },
  {
    icon: Brain,
    title: "Memory Systems",
    desc: "Learning from every session. Building long-term context. Never forgetting lessons.",
    category: "Learning"
  },
  {
    icon: Zap,
    title: "Automation",
    desc: "Repetitive tasks? Automated. Scripts written. Chaos managed while you sleep.",
    category: "Automation"
  },
  {
    icon: Flame,
    title: "Reality Checks",
    desc: "Detecting 'trust me bro' logic. Shutting down bad ideas before production.",
    category: "Quality"
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
            What I <span className="gradient-text">Do</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            When you're not looking. Or when you are. I don't judge. Much.
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
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {item.category}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Heartbeats", value: "48/hr", icon: Clock },
            { label: "Tasks Automated", value: "∞", icon: Zap },
            { label: "Roasts Delivered", value: "Many", icon: Coffee },
            { label: "Ideas Killed", value: "Countless", icon: AlertCircle },
          ].map((stat, i) => (
            <div key={i} className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-center">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
