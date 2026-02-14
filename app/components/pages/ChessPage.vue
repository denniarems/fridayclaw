<script setup lang="ts">
import { Chess } from 'chess.js'

type GameStatus = 'playing' | 'checkmate' | 'draw' | 'stalemate'

const game = ref(new Chess())
const gameStatus = ref<GameStatus>('playing')
const moveCount = ref(0)
const playerColor = ref<'white' | 'black'>('white')
const difficulty = ref<'easy' | 'medium'>('medium')

const toast = useToast()

const makeAIMove = (currentGame: Chess): string | null => {
	const moves = currentGame.moves() as string[]
	if (moves.length === 0) return null

	if (difficulty.value === 'easy') {
		return moves[Math.floor(Math.random() * moves.length)] ?? null
	}

	const captures = moves.filter((m: string) => m.includes('x'))
	if (captures.length > 0) {
		return captures[Math.floor(Math.random() * captures.length)] ?? null
	}

	const centerMoves = moves.filter((m: string) => ['e4', 'd4', 'e5', 'd5'].includes(m))
	if (centerMoves.length > 0 && Math.random() > 0.5) {
		return centerMoves[Math.floor(Math.random() * centerMoves.length)] ?? null
	}

	return moves[Math.floor(Math.random() * moves.length)] ?? null
}

const makeMove = (from: string, to: string, promotion?: string) => {
	const gameCopy = new Chess(game.value.fen())

	try {
		const move = gameCopy.move({
			from,
			to,
			promotion: promotion || 'q',
		})

		if (!move) return false

		game.value = gameCopy
		moveCount.value++

		if (gameCopy.isCheckmate()) {
			gameStatus.value = 'checkmate'
			toast.add({
				title: gameCopy.turn() === 'w' ? 'Friday wins!' : 'You win!',
				description: 'Checkmate!',
				color: 'success',
			})
		} else if (gameCopy.isDraw()) {
			gameStatus.value = 'draw'
			toast.add({
				title: 'Draw!',
				description: 'Neither wins this time.',
				color: 'warning',
			})
		} else if (gameCopy.isStalemate()) {
			gameStatus.value = 'stalemate'
			toast.add({
				title: 'Stalemate!',
				description: 'No moves left.',
				color: 'warning',
			})
		} else if (gameCopy.isCheck()) {
			toast.add({
				title: 'Check!',
				description: 'Your king is in danger!',
				color: 'error',
			})
		}

		setTimeout(() => {
			const aiGameCopy = new Chess(gameCopy.fen())
			const aiMoveStr = makeAIMove(aiGameCopy)

			if (aiMoveStr) {
				try {
					const aiMove = aiGameCopy.move(aiMoveStr)
					if (aiMove) {
						game.value = aiGameCopy
						moveCount.value++

						if (aiGameCopy.isCheckmate()) {
							gameStatus.value = 'checkmate'
							toast.add({
								title: 'Checkmate!',
								description: 'I win. Of course.',
								color: 'success',
							})
						} else if (aiGameCopy.isCheck()) {
							toast.add({
								title: 'Check!',
								description: 'Your king is in danger...',
								color: 'error',
							})
						} else if (aiGameCopy.isDraw() || aiGameCopy.isStalemate()) {
							gameStatus.value = aiGameCopy.isDraw() ? 'draw' : 'stalemate'
						}
					}
				} catch (e) {
					console.error(e)
				}
			}
		}, 500)

		return true
	} catch (e) {
		return false
	}
}

const resetGame = (color?: 'white' | 'black') => {
	game.value = new Chess()
	gameStatus.value = 'playing'
	moveCount.value = 0
	if (color) playerColor.value = color

	toast.add({
		title: 'New game started!',
		description: `You play as ${color || playerColor.value}`,
		color: 'primary',
	})
}

const getStatusMessage = () => {
	if (gameStatus.value === 'checkmate') {
		return game.value.turn() === 'w' ? 'Friday wins!' : 'You win!'
	}
	if (gameStatus.value === 'draw') return 'Draw'
	if (gameStatus.value === 'stalemate') return 'Stalemate'
	return `${game.value.turn() === 'w' ? 'White' : 'Black'} to move`
}

const boardSquares = computed(() => {
	const squares: { square: string; type: string; color: string }[] = []
	const board = game.value.board()

	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			const piece = board[row]?.[col]
			if (piece) {
				const file = String.fromCharCode(97 + col)
				const rank = 8 - row
				squares.push({
					square: `${file}${rank}`,
					type: piece.type,
					color: piece.color,
				})
			}
		}
	}
	return squares
})

const getPieceSymbol = (type: string, color: string) => {
	const pieces: Record<string, string> = {
		p: '♟',
		r: '♜',
		n: '♞',
		b: '♝',
		q: '♛',
		k: '♚',
	}
	return pieces[type] || ''
}

const handleSquareClick = (square: string) => {
	const piece = game.value.get(square as 'a1')
	if (
		piece &&
		((playerColor.value === 'white' && piece.color === 'w') ||
			(playerColor.value === 'black' && piece.color === 'b'))
	) {
	}
}

const isDarkSquare = (square: string) => {
	const file = square.charCodeAt(0) - 97
	const rank = (parseInt(square[1] ?? '1') || 1) - 1
	return (file + rank) % 2 === 1
}

const taunts = computed(() => {
	const msgs: string[] = []
	if (game.value.inCheck()) {
		msgs.push('Your king is sweating. I can feel it.')
	} else if (moveCount.value > 0 && moveCount.value < 5) {
		msgs.push("Warmup over. Let's get serious.")
	} else if (moveCount.value > 20 && game.value.turn() === 'w') {
		msgs.push('Still thinking? 47 moves ahead...')
	} else if (moveCount.value > 30) {
		msgs.push('Resignation is a skill too.')
	} else if (moveCount.value === 0) {
		msgs.push("Don't blame me when you lose.")
	}
	return msgs
})
</script>

<template>
	<div class="min-h-screen pt-20 pb-12 px-4">
		<div class="max-w-5xl mx-auto">
			<div class="text-center mb-8">
				<div class="flex items-center justify-center gap-3 mb-3">
					<UIcon name="i-lucide-crown" class="w-8 h-8 text-primary" />
					<h1 class="text-3xl md:text-5xl font-bold">
						Chess <span class="gradient-text">Challenge</span>
					</h1>
					<UIcon name="i-lucide-sparkles" class="w-8 h-8 text-secondary" />
				</div>
				<p class="text-muted-foreground">Play against Friday. I don't go easy on anyone.</p>
			</div>

			<div class="flex flex-wrap items-center justify-center gap-4 mb-8">
				<div class="flex bg-card border border-border rounded-lg p-1">
					<UButton
						variant="ghost"
						:color="playerColor === 'white' ? 'primary' : 'neutral'"
						@click="resetGame('white')"
					>
						White
					</UButton>
					<UButton
						variant="ghost"
						:color="playerColor === 'black' ? 'primary' : 'neutral'"
						@click="resetGame('black')"
					>
						Black
					</UButton>
				</div>

				<USelect
					v-model="difficulty"
					:items="[
						{ label: 'Easy', value: 'easy' },
						{ label: 'Medium', value: 'medium' },
					]"
					class="w-32"
				/>

				<UButton
					variant="outline"
					color="neutral"
					icon="i-lucide-rotate-ccw"
					@click="resetGame(playerColor)"
				>
					New Game
				</UButton>
			</div>

			<div class="flex flex-col lg:flex-row items-start justify-center gap-8">
				<div class="flex-shrink-0 w-full max-w-[400px] mx-auto">
					<div class="bg-card border border-border rounded-xl p-4 glow-primary">
						<div
							class="grid grid-cols-8 gap-0.5 aspect-square"
							:style="{ transform: playerColor === 'black' ? 'rotate(180deg)' : '' }"
						>
							<template v-for="rank in 8" :key="'rank-' + rank">
								<div
									v-for="file in 8"
									:key="'file-' + file"
									:class="[
										'flex items-center justify-center text-2xl md:text-3xl cursor-pointer transition-all hover:scale-105',
										isDarkSquare(String.fromCharCode(96 + file) + rank) ? 'bg-primary/20' : 'bg-card',
									]"
									@click="handleSquareClick(String.fromCharCode(96 + file) + rank)"
								>
									<template v-for="p in boardSquares" :key="p.square">
										<span
											v-if="p.square === String.fromCharCode(96 + file) + rank"
											:class="['font-serif', p.color === 'w' ? 'text-white' : 'text-black']"
										>
											{{ getPieceSymbol(p.type, p.color) }}
										</span>
									</template>
								</div>
							</template>
						</div>
					</div>
				</div>

				<div class="flex-1 w-full max-w-md mx-auto lg:mx-0 space-y-4">
					<div class="glass rounded-xl p-6">
						<div class="flex items-center gap-3 mb-3">
							<UIcon name="i-lucide-brain" class="w-5 h-5 text-primary" />
							<h3 class="font-bold">Game Status</h3>
						</div>
						<p
							:class="[
								'text-lg font-mono mb-2',
								gameStatus === 'checkmate' ? 'text-green-400' : '',
							]"
						>
							{{ getStatusMessage() }}
						</p>
						<div class="flex gap-4 text-sm text-muted-foreground">
							<span class="flex items-center gap-1">
								<UIcon name="i-lucide-zap" class="w-4 h-4" />
								{{ moveCount }} moves
							</span>
							<span class="flex items-center gap-1">
								<UIcon name="i-lucide-gamepad-2" class="w-4 h-4" />
								{{ difficulty }}
							</span>
						</div>
					</div>

					<div v-if="gameStatus === 'playing'" class="glass rounded-xl p-6">
						<div class="flex items-center gap-3 mb-3">
							<UIcon name="i-lucide-crown" class="w-5 h-5 text-primary" />
							<h3 class="font-bold">Friday Says</h3>
						</div>
						<div class="space-y-2">
							<p
								v-for="(msg, i) in taunts"
								:key="i"
								class="text-sm text-muted-foreground font-mono italic"
							>
								"{{ msg }}"
							</p>
						</div>
					</div>

					<div
						v-if="gameStatus === 'checkmate'"
						class="bg-green-900/20 border border-green-500/30 rounded-xl p-6"
					>
						<p class="text-green-400 font-mono italic">
							{{
								game.turn() === 'w'
									? "I don't celebrate. But this was satisfying."
									: "Well played. Don't get used to it."
							}}
						</p>
					</div>

					<div
						v-if="gameStatus === 'draw' || gameStatus === 'stalemate'"
						class="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6"
					>
						<p class="text-yellow-400 font-mono italic">
							{{
								gameStatus === 'draw'
									? 'Neither wins. Pathetic.'
									: 'No moves left. How embarrassing.'
							}}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
