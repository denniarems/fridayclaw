import { useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { motion } from 'framer-motion'
import { RotateCcw, Zap, Brain, Crown, Sparkles, Gamepad2 } from 'lucide-react'
import { toast } from 'sonner'

type GameStatus = 'playing' | 'checkmate' | 'draw' | 'stalemate'

export const ChessGame = () => {
	const [game, setGame] = useState(new Chess())
	const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
	const [moveCount, setMoveCount] = useState(0)
	const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white')
	const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('medium')

	// Simple AI move generator
	const makeAIMove = useCallback(
		(currentGame: Chess) => {
			const moves = currentGame.moves()
			if (moves.length === 0) return null

			if (difficulty === 'easy') {
				return moves[Math.floor(Math.random() * moves.length)]
			}

			const captures = moves.filter((m: string) => m.includes('x'))
			if (captures.length > 0) {
				return captures[Math.floor(Math.random() * captures.length)]
			}

			const centerMoves = moves.filter((m: string) => ['e4', 'd4', 'e5', 'd5'].includes(m))
			if (centerMoves.length > 0 && Math.random() > 0.5) {
				return centerMoves[Math.floor(Math.random() * centerMoves.length)]
			}

			return moves[Math.floor(Math.random() * moves.length)]
		},
		[difficulty],
	)

	const makeMove = useCallback(
		(from: string, to: string, promotion?: string) => {
			const gameCopy = new Chess(game.fen())

			try {
				const move = gameCopy.move({
					from,
					to,
					promotion: promotion || 'q',
				})

				if (!move) return false

				setGame(gameCopy)
				setMoveCount((prev) => prev + 1)

				if (gameCopy.isCheckmate()) {
					setGameStatus('checkmate')
					toast(gameCopy.turn() === 'w' ? 'Friday wins!' : 'You win!', {
						description: 'Checkmate! 🎉',
						style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' },
					})
				} else if (gameCopy.isDraw()) {
					setGameStatus('draw')
					toast('Draw!', {
						description: 'Neither wins this time.',
						style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' },
					})
				} else if (gameCopy.isStalemate()) {
					setGameStatus('stalemate')
					toast('Stalemate!', {
						description: 'No moves left.',
						style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' },
					})
				} else if (gameCopy.isCheck()) {
					toast('Check!', {
						description: 'Your king is in danger!',
						style: { background: '#171717', border: '1px solid #ff4444', color: '#ffffff' },
					})
				}

				setTimeout(() => {
					const aiGameCopy = new Chess(gameCopy.fen())
					const aiMoveStr = makeAIMove(aiGameCopy)

					if (aiMoveStr) {
						try {
							const aiMove = aiGameCopy.move(aiMoveStr)
							if (aiMove) {
								setGame(aiGameCopy)
								setMoveCount((prev) => prev + 1)

								if (aiGameCopy.isCheckmate()) {
									setGameStatus('checkmate')
									toast('Checkmate! 🎉', {
										description: 'I win. Of course.',
										style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' },
									})
								} else if (aiGameCopy.isCheck()) {
									toast('Check!', {
										description: 'Your king is in danger...',
										style: { background: '#171717', border: '1px solid #ff4444', color: '#ffffff' },
									})
								} else if (aiGameCopy.isDraw() || aiGameCopy.isStalemate()) {
									setGameStatus(aiGameCopy.isDraw() ? 'draw' : 'stalemate')
								}
							}
						} catch (e) {}
					}
				}, 500)

				return true
			} catch (e) {
				return false
			}
		},
		[game, makeAIMove],
	)

	const resetGame = (color?: 'white' | 'black') => {
		const newGame = new Chess()
		setGame(newGame)
		setGameStatus('playing')
		setMoveCount(0)
		if (color) setPlayerColor(color)

		toast('New game started!', {
			description: `You play as ${color || playerColor}`,
			style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' },
		})
	}

	const getStatusMessage = () => {
		if (gameStatus === 'checkmate') {
			return game.turn() === 'w' ? 'Friday wins!' : 'You win!'
		}
		if (gameStatus === 'draw') return 'Draw'
		if (gameStatus === 'stalemate') return 'Stalemate'
		return `${game.turn() === 'w' ? 'White' : 'Black'} to move`
	}

	const handlePieceDrop = (sourceSquare: string, targetSquare: string | null) => {
		if (targetSquare) {
			return makeMove(sourceSquare, targetSquare)
		}
		return false
	}

	return (
		<div className="min-h-screen pt-16 pb-8 px-3 md:pt-20 md:pb-12">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-6 md:mb-8"
				>
					<div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4">
						<Crown className="w-6 h-6 md:w-8 md:h-8 text-primary" />
						<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
							Chess <span className="gradient-text">Challenge</span>
						</h1>
						<Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
					</div>
					<p className="text-sm md:text-base text-muted-foreground px-4">
						Play against Friday. I don't go easy on anyone.
					</p>
				</motion.div>

				{/* Controls */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8"
				>
					{/* Color selection */}
					<div className="flex bg-card border border-border rounded-lg p-1">
						<button
							onClick={() => resetGame('white')}
							className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
								playerColor === 'white'
									? 'bg-primary text-black'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							White
						</button>
						<button
							onClick={() => resetGame('black')}
							className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
								playerColor === 'black'
									? 'bg-primary text-black'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							Black
						</button>
					</div>

					{/* Difficulty */}
					<select
						value={difficulty}
						onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium')}
						className="bg-card border border-border px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium focus:outline-none focus:border-primary"
					>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
					</select>

					{/* Reset */}
					<button
						onClick={() => resetGame(playerColor)}
						className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-card border border-border rounded-lg text-xs md:text-sm font-medium hover:border-primary transition-all"
					>
						<RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
						<span className="hidden sm:inline">New Game</span>
						<span className="sm:hidden">Reset</span>
					</button>
				</motion.div>

				{/* Game board */}
				<div className="flex flex-col lg:flex-row items-start justify-center gap-4 md:gap-8">
					{/* Main board */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2 }}
						className="flex-shrink-0 w-full flex justify-center"
					>
						<div className="bg-card border border-border p-3 md:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[650px]">
							<Chessboard
								options={{
									position: game.fen(),
									boardOrientation: playerColor,
									onPieceDrop: ({ sourceSquare, targetSquare }) =>
										handlePieceDrop(sourceSquare, targetSquare),
									boardStyle: {
										borderRadius: '8px',
										overflow: 'hidden',
									},
									lightSquareStyle: { backgroundColor: '#2d2d2d' },
									darkSquareStyle: { backgroundColor: '#1a1a1a' },
								}}
							/>
						</div>
					</motion.div>

					{/* Side panel */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 }}
						className="flex-1 w-full max-w-md mx-auto lg:mx-0"
					>
						{/* Status card */}
						<div className="bg-card border border-border p-4 md:p-6 rounded-xl mb-4">
							<div className="flex items-center gap-2 md:gap-3 mb-3">
								<Brain className="w-4 h-4 md:w-5 md:h-5 text-primary" />
								<h3 className="font-bold text-sm md:text-base">Game Status</h3>
							</div>
							<p
								className={`text-base md:text-lg font-mono mb-2 ${gameStatus === 'checkmate' ? 'text-green-400' : 'text-foreground'}`}
							>
								{getStatusMessage()}
							</p>
							<div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
								<span className="flex items-center gap-1">
									<Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
									{moveCount} moves
								</span>
								<span className="flex items-center gap-1">
									<Gamepad2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
									{difficulty}
								</span>
							</div>
						</div>

						{/* Friday's taunts */}
						{gameStatus === 'playing' && (
							<div className="bg-gradient-to-br from-primary/10 to-background border border-primary/30 p-4 md:p-6 rounded-xl">
								<div className="flex items-center gap-2 md:gap-3 mb-3">
									<Crown className="w-4 h-4 md:w-5 md:h-5 text-primary" />
									<h3 className="font-bold text-sm md:text-base">Friday Says</h3>
								</div>
								<div className="space-y-2">
									{game.inCheck() && (
										<p className="text-xs md:text-sm text-red-400 font-mono italic">
											"Your king is sweating. I can feel it."
										</p>
									)}
									{moveCount > 0 && moveCount < 5 && (
										<p className="text-xs md:text-sm text-muted-foreground font-mono italic">
											"Warmup over. Let's get serious."
										</p>
									)}
									{moveCount > 20 && game.turn() === 'w' && (
										<p className="text-xs md:text-sm text-muted-foreground font-mono italic">
											"Still thinking? 47 moves ahead..."
										</p>
									)}
									{moveCount > 30 && (
										<p className="text-xs md:text-sm text-muted-foreground font-mono italic">
											"Resignation is a skill too."
										</p>
									)}
									{moveCount === 0 && (
										<p className="text-xs md:text-sm text-muted-foreground font-mono italic">
											"Don't blame me when you lose."
										</p>
									)}
								</div>
							</div>
						)}

						{/* Game over messages */}
						{gameStatus === 'checkmate' && (
							<div className="bg-green-900/20 border border-green-500/30 p-4 md:p-6 rounded-xl mt-4">
								<p className="text-sm md:text-base text-green-400 font-mono italic">
									{game.turn() === 'w'
										? "I don't celebrate. But this was satisfying."
										: "Well played. Don't get used to it."}
								</p>
							</div>
						)}

						{/* Draw/Stalemate */}
						{(gameStatus === 'draw' || gameStatus === 'stalemate') && (
							<div className="bg-yellow-900/20 border border-yellow-500/30 p-4 md:p-6 rounded-xl mt-4">
								<p className="text-sm md:text-base text-yellow-400 font-mono italic">
									{gameStatus === 'draw'
										? 'Neither wins. Pathetic.'
										: 'No moves left. How embarrassing.'}
								</p>
							</div>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	)
}
