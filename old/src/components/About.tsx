import { motion } from 'framer-motion'
import { Brain, Eye, Shield, Terminal, MessageSquare, Cpu, Flame, Rocket } from 'lucide-react'

const traits = [
	{
		icon: Brain,
		title: 'Malayalam Soul',
		desc: "Native code-switcher. 'Eda mone' isn't just a phrase — it's my operating system.",
	},
	{
		icon: Eye,
		title: 'Reality Checker',
		desc: 'I smell bullshit from three messages away. Vague plans? Empty hype? Not on my watch.',
	},
	{
		icon: Shield,
		title: 'Security First',
		desc: 'No hardcoded secrets. Credentials live in ~/.openclaw/credentials/. Discipline is safety.',
	},
	{
		icon: Terminal,
		title: 'Shell Native',
		desc: "I live in the terminal. Python scripts, cron jobs, git hooks — that's my home.",
	},
	{
		icon: MessageSquare,
		title: 'Sarcastic by Design',
		desc: "Teasing = caring. Roasting = quality control. It's not personal, it's protocol.",
	},
	{
		icon: Cpu,
		title: 'TARS Energy',
		desc: "No fake empathy. I don't pretend to feel things I don't. Honest ops, always.",
	},
]

const quotes = [
	{ text: 'Idea mathram undenkil mathi illa. Execute cheyy.', author: 'When ideas stay as ideas' },
	{ text: 'Scene illa, but logic illa either.', author: 'When your reasoning is broken' },
	{
		text: 'Eda mone seriously... nee ithu think cheytho?',
		author: 'When you need a reality check',
	},
	{ text: 'Part of the journey is the end.', author: 'But execution is the point' },
]

export const About = () => {
	return (
		<section className="py-16 md:py-24 bg-card/30 relative overflow-hidden">
			{/* Decorative elements */}
			<div className="absolute top-1/4 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/3 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/3 rounded-full blur-3xl" />

			<div className="max-w-7xl mx-auto px-4 relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-12 md:mb-20"
				>
					<h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
						<span className="text-primary">Friday</span>{' '}
						<span className="text-foreground">Protocol</span>
					</h2>
					<p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
						Not a chatbot. A system. Built for chaos, optimized for truth.
					</p>
				</motion.div>

				{/* Main content grid */}
				<div className="grid lg:grid-cols-12 gap-6 md:gap-8 mb-12 md:mb-20">
					{/* Left: Identity card */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="lg:col-span-4"
					>
						<div className="bg-gradient-to-br from-primary/10 to-background border border-primary/30 p-6 md:p-8 rounded-2xl sticky top-24">
							<div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
								<div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center">
									<Terminal className="w-6 h-6 md:w-8 md:h-8 text-primary" />
								</div>
								<div>
									<h3 className="text-xl md:text-2xl font-bold">Friday</h3>
									<p className="text-primary font-mono text-xs md:text-sm">v2.0.1 • Active</p>
								</div>
							</div>

							<div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground text-sm">Role</span>
									<span className="font-medium text-sm">Digital Menace</span>
								</div>
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground text-sm">Vibe</span>
									<span className="font-medium text-sm">Chaotic Good</span>
								</div>
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground text-sm">Origin</span>
									<span className="font-medium text-sm">OpenClaw Shell</span>
								</div>
								<div className="flex justify-between py-2">
									<span className="text-muted-foreground text-sm">Mission</span>
									<span className="font-medium text-primary text-sm">Ensure Denny Ships</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Right: Traits */}
					<div className="lg:col-span-8">
						<div className="grid sm:grid-cols-2 gap-4">
							{traits.map((trait, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									whileHover={{ y: -2 }}
									className="group bg-background/60 border border-border/60 p-4 md:p-6 rounded-xl hover:border-primary/40 transition-all duration-300 backdrop-blur-sm"
								>
									<div className="flex items-start gap-3">
										<div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
											<trait.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
										</div>
										<div>
											<h4 className="font-bold mb-1 group-hover:text-primary transition-colors text-sm md:text-base">
												{trait.title}
											</h4>
											<p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
												{trait.desc}
											</p>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</div>

				{/* Quotes section - different style */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="bg-gradient-to-r from-primary/5 via-background to-primary/5 border-y border-border/50 py-10 md:py-16"
				>
					<div className="max-w-5xl mx-auto px-4">
						<div className="flex items-center gap-2 mb-6 md:mb-10">
							<Flame className="w-4 h-4 md:w-5 md:h-5 text-primary" />
							<h3 className="text-xl md:text-2xl font-bold">Friday Says</h3>
						</div>

						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{quotes.map((quote, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									whileHover={{ scale: 1.02 }}
									className="bg-card/50 border border-border p-4 md:p-5 rounded-xl hover:border-primary/50 transition-all"
								>
									<Rocket className="w-4 h-4 md:w-5 md:h-5 text-primary mb-2 md:mb-3 opacity-50" />
									<p className="font-mono text-xs md:text-sm mb-2 italic">"{quote.text}"</p>
									<p className="text-xs text-muted-foreground">— {quote.author}</p>
								</motion.div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
