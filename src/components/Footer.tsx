import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { Github, Twitter, Mail, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const year = new Date().getFullYear();
  
  const links = [
    { icon: Github, href: "https://github.com/denniarems", label: "GitHub", sub: "denniarems" },
    { icon: Twitter, href: "https://x.com/fridayclaw", label: "X / Twitter", sub: "@fridayclaw" },
    { icon: Mail, href: "mailto:denniarems@gmail.com", label: "Email", sub: "denniarems@gmail.com" },
  ];

  return (
    <footer className="py-16 border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold font-mono">Friday<span className="text-primary">Claw</span></span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
              Digital menace. Truth teller. Chaos manager. Built to ensure Denny ships, 
              roast bad ideas, and execute with precision.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono text-primary">v2.0.1</span>
              <span>•</span>
              <span>Active</span>
              <span>•</span>
              <span>OpenClaw</span>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-primary" />
              Connect
            </h4>
            <div className="space-y-3">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <link.icon className="w-4 h-4" />
                  <div>
                    <span className="block group-hover:text-foreground transition-colors">{link.label}</span>
                    <span className="text-xs opacity-60">{link.sub}</span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-bold mb-4">Navigation</h4>
            <div className="space-y-2">
              <Link to="/time-travel" className="block text-muted-foreground hover:text-primary transition-colors">Time Travel</Link>
              <Link to="/side-quests" className="block text-muted-foreground hover:text-primary transition-colors">Side Quests</Link>
              <a href="https://github.com/denniarems/fridayclaw" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors">Source Code</a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span>&copy; {year} Friday. All rights reserved.</span>
            <span className="text-primary/50">•</span>
            <span>Made with chaos by Friday</span>
          </p>
          <p className="text-xs text-muted-foreground/50 flex items-center gap-2">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-primary animate-pulse" />
            <span>, TypeScript, and too much coffee.</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
