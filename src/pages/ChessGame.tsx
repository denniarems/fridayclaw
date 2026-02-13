import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Zap, Brain, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type GameStatus = 'playing' | 'checkmate' | 'draw' | 'stalemate';

export const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [moveCount, setMoveCount] = useState(0);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('medium');

  // Simple AI move generator
  const makeAIMove = useCallback((currentGame: Chess) => {
    const moves = currentGame.moves();
    if (moves.length === 0) return null;

    if (difficulty === 'easy') {
      // Random move
      return moves[Math.floor(Math.random() * moves.length)];
    }

    // Medium: captures first, then random
    const captures = moves.filter((m: string) => m.includes('x'));
    if (captures.length > 0) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    
    // Prefer center control
    const centerMoves = moves.filter((m: string) => 
      ['e4', 'd4', 'e5', 'd5'].includes(m)
    );
    if (centerMoves.length > 0 && Math.random() > 0.5) {
      return centerMoves[Math.floor(Math.random() * centerMoves.length)];
    }

    return moves[Math.floor(Math.random() * moves.length)];
  }, [difficulty]);

  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    const gameCopy = new Chess(game.fen());
    
    try {
      const move = gameCopy.move({
        from,
        to,
        promotion: promotion || 'q',
      });

      if (!move) return false;

      setGame(gameCopy);
      setMoveCount((prev) => prev + 1);

      // Check game status
      if (gameCopy.isCheckmate()) {
        setGameStatus('checkmate');
        toast(gameCopy.turn() === 'w' ? "Friday wins!" : "You win!", {
          description: "Checkmate! 🎉",
          style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' }
        });
      } else if (gameCopy.isDraw()) {
        setGameStatus('draw');
        toast("Draw!", { description: "Neither wins this time.", style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' } });
      } else if (gameCopy.isStalemate()) {
        setGameStatus('stalemate');
        toast("Stalemate!", { description: "No moves left.", style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' } });
      } else if (gameCopy.isCheck()) {
        toast("Check!", { description: "Your king is in danger!", style: { background: '#171717', border: '1px solid #ff4444', color: '#ffffff' } });
      }

      // AI move after a delay
      setTimeout(() => {
        const aiGameCopy = new Chess(gameCopy.fen());
        const aiMoveStr = makeAIMove(aiGameCopy);
        
        if (aiMoveStr) {
          try {
            const aiMove = aiGameCopy.move(aiMoveStr);
            if (aiMove) {
              setGame(aiGameCopy);
              setMoveCount((prev) => prev + 1);

              if (aiGameCopy.isCheckmate()) {
                setGameStatus('checkmate');
                toast("Checkmate! 🎉", {
                  description: "I win. Of course.",
                  style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' }
                });
              } else if (aiGameCopy.isCheck()) {
                toast("Check!", { description: "Your king is in danger...", style: { background: '#171717', border: '1px solid #ff4444', color: '#ffffff' } });
              } else if (aiGameCopy.isDraw() || aiGameCopy.isStalemate()) {
                setGameStatus(aiGameCopy.isDraw() ? 'draw' : 'stalemate');
              }
            }
          } catch (e) {
            // Move failed, try another
          }
        }
      }, 500);

      return true;
    } catch (e) {
      return false;
    }
  }, [game, makeAIMove]);

  const resetGame = (color?: 'white' | 'black') => {
    const newGame = new Chess();
    setGame(newGame);
    setGameStatus('playing');
    setMoveCount(0);
    if (color) setPlayerColor(color);
    
    toast("New game started!", {
      description: color === playerColor ? `You play as ${color}` : `You play as ${color}`,
      style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' }
    });
  };

  const getStatusMessage = () => {
    if (gameStatus === 'checkmate') {
      return game.turn() === 'w' ? "Friday wins!" : "You win!";
    }
    if (gameStatus === 'draw') return "Draw";
    if (gameStatus === 'stalemate') return "Stalemate";
    return `Move ${moveCount} - ${game.turn() === 'w' ? "White" : "Black"} to move`;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold">
              Chess <span className="gradient-text">Challenge</span>
            </h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Play against Friday. I don't go easy on anyone.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          {/* Color selection */}
          <div className="flex bg-card border border-border rounded-lg p-1">
            <button
              onClick={() => resetGame('white')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                playerColor === 'white' 
                  ? 'bg-primary text-black' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Play White
            </button>
            <button
              onClick={() => resetGame('black')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                playerColor === 'black' 
                  ? 'bg-primary text-black' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Play Black
            </button>
          </div>

          {/* Difficulty */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium')}
            className="bg-card border border-border px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:border-primary"
          >
            <option value="easy">Easy Mode</option>
            <option value="medium">Medium Mode</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => resetGame(playerColor)}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
        </motion.div>

        {/* Game board */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Main board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="bg-card border border-border p-4 rounded-xl shadow-2xl">
              <Chessboard
                options={{
                  position: game.fen(),
                  boardOrientation: playerColor === 'white' ? 'white' : 'black',
                  onPieceDrop: ({ sourceSquare, targetSquare }: { sourceSquare?: string | null; targetSquare?: string | null }) => {
                    if (sourceSquare && targetSquare) {
                      return makeMove(sourceSquare, targetSquare);
                    }
                    return false;
                  },
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
            className="flex-1 max-w-md w-full"
          >
            {/* Status card */}
            <div className="bg-card border border-border p-6 rounded-xl mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Game Status</h3>
              </div>
              <p className={`text-lg font-mono mb-2 ${gameStatus === 'checkmate' ? 'text-green-400' : 'text-foreground'}`}>
                {getStatusMessage()}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {moveCount} moves
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {difficulty}
                </span>
              </div>
            </div>

            {/* Friday's taunts */}
            {gameStatus === 'playing' && (
              <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/30 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Friday Says</h3>
                </div>
                <div className="space-y-3">
                  {game.inCheck() && (
                    <p className="text-sm text-red-400 font-mono italic">
                      "Your king is sweating. I can feel it."
                    </p>
                  )}
                  {moveCount > 0 && moveCount < 5 && (
                    <p className="text-sm text-muted-foreground font-mono italic">
                      "Warmup over. Let's get serious."
                    </p>
                  )}
                  {moveCount > 20 && game.turn() === 'w' && (
                    <p className="text-sm text-muted-foreground font-mono italic">
                      "Still thinking? I've already calculated 47 moves ahead."
                    </p>
                  )}
                  {moveCount > 30 && (
                    <p className="text-sm text-muted-foreground font-mono italic">
                      "You know, resignation is a skill too."
                    </p>
                  )}
                  {gameStatus === 'playing' && moveCount === 0 && (
                    <p className="text-sm text-muted-foreground font-mono italic">
                      "Don't blame me when you lose. You asked for this."
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Game over messages */}
            {gameStatus === 'checkmate' && (
              <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl">
                <p className="text-green-400 font-mono italic">
                  {game.turn() === 'w' 
                    ? "I don't celebrate. But this was satisfying." 
                    : "Well played. Don't get used to it."}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
