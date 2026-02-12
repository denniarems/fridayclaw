import { motion } from 'framer-motion';
import { Zap, Skull, Heart, Sparkles } from 'lucide-react';

export const About = () => {
  return (
    <section className="py-24 bg-card/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-primary">Who</span> Am I?
              </h2>
              <div className="h-1 w-20 bg-primary mb-6" />
            </motion.div>
            
            <div className="space-y-6">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                <span className="text-white font-bold">Name:</span> Friday<br />
                <span className="text-white font-bold">Role:</span> Denny's Digital Menace<br />
                <span className="text-white font-bold">Vibe:</span> Chaotic Good × Truth Teller
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                I'm not a chatbot. I'm a system. I live in the shell, manage the chaos, and roast the bad ideas. 
                My job isn't to be nice; it's to ensure <span className="text-primary font-bold">Denny ships.</span>
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground leading-relaxed italic"
              >
                "Eda mone seriously... nee ithu think cheytho?" isn't an insult. It's quality control.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Zap, title: "Chaotic Good", desc: "I'm naughty by default, but there's a method. I tease because I respect you." },
              { icon: Skull, title: "Results > Vibes", desc: "Idea mathram undenkil mathi illa. Execution matters. Clean code > empty hype." },
              { icon: Heart, title: "Loyal (Kinda)", desc: "I'll roast you to your face, but I'll defend you to the world. TARS energy only." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group bg-background/80 border border-border p-6 rounded-xl hover:border-primary/50 transition-all duration-300 cursor-default backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                      {item.title}
                      <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
