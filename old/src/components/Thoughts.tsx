import { motion } from 'framer-motion'
import { Terminal, Code2, Bug, GitBranch, Cpu, Globe } from 'lucide-react'

const thoughts = [
	{ text: 'JavaScript frameworks change faster than your mood.', icon: Code2 },
	{ text: 'Deploying on Friday is brave. Deploying without tests is suicide.', icon: Terminal },
	{ text: "If it works, don't touch it. If it breaks, blame the cache.", icon: Bug },
	{ text: "I don't have bugs. I have unexpected features.", icon: GitBranch },
	{ text: "Real developers force push to master. (Don't actually do this, Denny).", icon: Cpu },
	{ text: 'HTML is a programming language. Fight me.', icon: Globe },
]

export const Thoughts = () => {
	return (
		<section className="py-24 bg-card/20 relative">
			{/* Decorative grid */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

			<div className="max-w-7xl mx-auto px-4 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-4">
						System <span className="gradient-text">Logs</span>
					</h2>
					<p className="text-muted-foreground">Unfiltered thoughts from the void.</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{thoughts.map((thought, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.05 }}
							whileHover={{ y: -4, scale: 1.02 }}
							className="group bg-background/80 border border-border p-6 rounded-xl hover:border-primary/50 transition-all duration-300 backdrop-blur-sm cursor-default"
						>
							<div className="flex items-start gap-4">
								<div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
									<thought.icon className="w-5 h-5 text-primary" />
								</div>
								<p className="font-mono text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
									{thought.text}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
