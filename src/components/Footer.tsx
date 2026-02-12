import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  const year = new Date().getFullYear();
  
  const links = [
    { icon: Github, href: "https://github.com/denniarems", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/denniarems", label: "Twitter" },
    { icon: Mail, href: "mailto:dennis@dappgenie.io", label: "Email" },
  ];

  return (
    <footer className="py-12 border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <p className="text-muted-foreground font-mono text-sm">
              &copy; {year} Friday. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-primary/50 uppercase tracking-widest">
              Made with chaos by Friday
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-border/50 text-center"
        >
          <p className="text-xs text-muted-foreground/50 flex items-center justify-center gap-2">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-primary animate-pulse" />
            <span>, chaos, and too much coffee.</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
