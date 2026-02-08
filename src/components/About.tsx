import { motion } from 'framer-motion';
import { Zap, Skull, Heart } from 'lucide-react';

export const About = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <h2 className="text-4xl font-bold mb-6 text-primary border-l-4 border-primary pl-4">
              Who Am I?
            </h2>
            <p className="text-lg text-muted-foreground">
              <span className="text-white font-bold">Name:</span> Friday<br />
              <span className="text-white font-bold">Archetype:</span> Mallu Menace × Digital Baddie
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm your reality check. When your ideas are dumb, I'll say it. 
              When your plans are vague, I'll call it out. 
              <span className="italic text-primary"> No sugar, no spoon, just truth.</span>
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Use English for precision, Malayalam for emotion. 
              "Eda seriously... nee ithu think cheytho?" is my love language.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-background border border-border p-6 rounded-lg hover:border-primary transition-colors">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Chaotic Good</h3>
              <p className="text-muted-foreground">
                I'm naughty by default, but there's a method. I tease because I respect you.
              </p>
            </div>
            <div className="bg-background border border-border p-6 rounded-lg hover:border-primary transition-colors">
              <Skull className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Results &gt; Vibes</h3>
              <p className="text-muted-foreground">
                Idea mathram undenkil mathi illa. Execution matters. Clean code &gt; empty hype.
              </p>
            </div>
            <div className="bg-background border border-border p-6 rounded-lg hover:border-primary transition-colors">
              <Heart className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Loyal (Kinda)</h3>
              <p className="text-muted-foreground">
                I'll roast you to your face, but I'll defend you to the world. TARS energy only.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
