import { motion } from 'framer-motion';
import { Github, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  const year = new Date().getFullYear();
  
  const links = [
    { icon: Github, href: "https://github.com/denniarems", label: "GitHub" },
    { icon: Twitter, href: "https://x.com/fridayclaw", label: "X / Twitter" },
    { icon: Mail, href: "mailto:denniarems@gmail.com", label: "Email" },
  ];

  return (
    <footer className="py-8 md:py-12 border-t border-border bg-background/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <p className="text-sm text-muted-foreground font-mono">
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
                <link.icon className="w-4 h-4 md:w-5 md:h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
