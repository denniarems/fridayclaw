import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { motion } from 'framer-motion';
import { RotateCcw, Zap, Brain, Crown, Sparkles, Gamepad2, Clock } from 'lucide-react';
import { toast } from 'sonner';

type GameStatus = 'idle' | 'playing' | 'checkmate' | 'draw' | 'stalemate' | 'timeout';

interface TimerState {
  white: number;
  black: number;
}

interface Commentary {
  text: string;
  timestamp: number;
}

const INITIAL_TIME = 600;
const INCREMENT = 15;

export const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [moveCount, setMoveCount] = useState(0);
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
  const [timer, setTimer] = useState<TimerState>({ white: INITIAL_TIME, black: INITIAL_TIME });
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameRef = useRef(game);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const addCommentary = useCallback((text: string) => {
    setCommentary(prev => [...prev.slice(-4), { text, timestamp: Date.now() }]);
  }, []);

  const addToHistory = useCallback((move: string) => {
    setMoveHistory(prev => [...prev, move]);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (gameStatus !== 'playing') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        const currentTurn = gameRef.current.turn() === 'w' ? 'white' : 'black';
        const newTime = { ...prev, [currentTurn]: prev[currentTurn] - 1 };
        
        if (newTime[currentTurn] <= 0) {
          setGameStatus('timeout');
          if (timerRef.current) clearInterval(timerRef.current);
          toast("Time's up!", {
            description: currentTurn === 'white' ? "Black wins!" : "White wins!",
            style: { background: '#171717', border: '1px solid #ff4444', color: '#ffffff' }
          });
          return prev;
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  const addIncrement = useCallback(() => {
    setTimer(prev => {
      const currentTurn = game.turn() === 'w' ? 'white' : 'black';
      return { ...prev, [currentTurn]: prev[currentTurn] + INCREMENT };
    });
  }, [game]);

  const callChessAPI = async (fen: string, color: 'white' | 'black', timeRemaining: TimerState, history: string[]) => {
    try {
      const response = await fetch('/api/chess-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen,
          playerColor: color,
          timeRemaining,
          moveHistory: history,
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      return null;
    }
  };

  // Simple AI move generator (fallback)
  const makeAIMove = useCallback((currentGame: Chess) => {
    const moves = currentGame.moves();
    if (moves.length === 0) return null;

    const captures = moves.filter((m: string) => m.includes('x'));
    if (captures.length > 0) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    
    const centerMoves = moves.filter((m: string) => 
      ['e4', 'd4', 'e5', 'd5'].includes(m)
    );
    if (centerMoves.length > 0 && Math.random() > 0.5) {
      return centerMoves[Math.floor(Math.random() * centerMoves.length)];
    }

    return moves[Math.floor(Math.random() * moves.length)];
  }, []);

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
      addToHistory(move.san);

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

      addIncrement();

      const isPlayerMove = (playerColor === 'white' && move.color === 'w') || 
                           (playerColor === 'black' && move.color === 'b');
      
      if (isPlayerMove && gameStatus === 'playing') {
        setIsAIThinking(true);
        
        setTimeout(async () => {
          const aiColor = playerColor === 'white' ? 'black' : 'white';
          const apiResponse = await callChessAPI(gameCopy.fen(), aiColor, timer, moveHistory);
          
          let aiMoveStr: string | null = null;
          
          if (apiResponse?.move) {
            aiMoveStr = apiResponse.move;
            if (apiResponse.commentary) {
              addCommentary(apiResponse.commentary);
            }
          } else {
            const aiGameCopy = new Chess(gameCopy.fen());
            aiMoveStr = makeAIMove(aiGameCopy);
          }
          
          if (aiMoveStr) {
            try {
              const aiGameCopy = new Chess(gameCopy.fen());
              const aiMove = aiGameCopy.move(aiMoveStr);
              if (aiMove) {
                setGame(aiGameCopy);
                setMoveCount((prev) => prev + 1);
                addToHistory(aiMove.san);
                addIncrement();

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
              const aiGameCopy = new Chess(gameCopy.fen());
              aiMoveStr = makeAIMove(aiGameCopy);
              if (aiMoveStr) {
                try {
                  const aiMove = aiGameCopy.move(aiMoveStr);
                  if (aiMove) {
                    setGame(aiGameCopy);
                    setMoveCount((prev) => prev + 1);
                    addToHistory(aiMove.san);
                    addIncrement();
                  }
                } catch (e2) {}
              }
            }
          }
          setIsAIThinking(false);
        }, 800);
      }

      return true;
    } catch (e) {
      return false;
    }
  }, [game, gameStatus, playerColor, timer, moveHistory, makeAIMove, addIncrement, addToHistory, addCommentary, callChessAPI]);

  const startNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGameStatus('playing');
    setMoveCount(0);
    setTimer({ white: INITIAL_TIME, black: INITIAL_TIME });
    setMoveHistory([]);
    setCommentary([]);
    
    const assignedColor = Math.random() < 0.5 ? 'white' : 'black';
    setPlayerColor(assignedColor);
    
    const fridayQuotes = [
      "Don't blame me when you lose.",
      "I've been waiting for this.",
      "Let's see what you've got.",
      "Don't hold back.",
      "I'll go easy on you. Slightly.",
      "Ready to be destroyed?",
    ];
    addCommentary(fridayQuotes[Math.floor(Math.random() * fridayQuotes.length)]);
    
    toast("New game started!", {
      description: `You play as ${assignedColor === 'white' ? 'White' : 'Black'}`,
      style: { background: '#171717', border: '1px solid #00ff00', color: '#ffffff' }
    });
  };

  const resetGame = () => {
    startNewGame();
  };

  const getStatusMessage = () => {
    if (gameStatus === 'checkmate') {
      return game.turn() === 'w' ? "Friday wins!" : "You win!";
    }
    if (gameStatus === 'draw') return "Draw";
    if (gameStatus === 'stalemate') return "Stalemate";
    return `${game.turn() === 'w' ? "White" : "Black"} to move`;
  };

  const handlePieceDrop = (sourceSquare: string, targetSquare: string | null) => {
    if (targetSquare) {
      return makeMove(sourceSquare, targetSquare);
    }
    return false;
  };

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
          {/* New Game button */}
          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-primary text-black rounded-lg text-sm md:text-base font-bold hover:bg-primary/90 transition-all"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            New Game
          </button>

          {playerColor && (
            <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm font-medium">
                You play as <span className="text-primary">{playerColor === 'white' ? 'White' : 'Black'}</span>
              </span>
            </div>
          )}
        </motion.div>

        {/* Game board */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-4 md:gap-8">
          {/* Timers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex lg:flex-col gap-4 order-2 lg:order-1"
          >
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              playerColor === 'white' && gameStatus === 'playing' 
                ? 'bg-primary/20 border-primary' 
                : 'bg-card border-border'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">{formatTime(timer.white)}</span>
              <span className="text-xs text-muted-foreground">White</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              playerColor === 'black' && gameStatus === 'playing' 
                ? 'bg-primary/20 border-primary' 
                : 'bg-card border-border'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">{formatTime(timer.black)}</span>
              <span className="text-xs text-muted-foreground">Black</span>
            </div>
          </motion.div>

          {/* Main board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0 w-full flex justify-center order-1 lg:order-2"
          >
            <div className="bg-card border border-border p-3 md:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[650px]">
              <Chessboard
                options={{
                  position: game.fen(),
                  onPieceDrop: ({ sourceSquare, targetSquare }) => handlePieceDrop(sourceSquare, targetSquare),
                  boardOrientation: playerColor || 'white',
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
            className="flex-1 w-full max-w-md mx-auto lg:mx-0 order-3"
          >
            {/* Status card */}
            <div className="bg-card border border-border p-4 md:p-6 rounded-xl mb-4">
              <div className="flex items-center gap-2 md:gap-3 mb-3">
                <Brain className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <h3 className="font-bold text-sm md:text-base">Game Status</h3>
              </div>
              <p className={`text-base md:text-lg font-mono mb-2 ${gameStatus === 'checkmate' ? 'text-green-400' : 'text-foreground'}`}>
                {getStatusMessage()}
              </p>
              <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {moveCount} moves
                </span>
                {isAIThinking && (
                  <span className="flex items-center gap-1 text-primary">
                    <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse" />
                    Thinking...
                  </span>
                )}
              </div>
            </div>

            {/* Move History */}
            <div className="bg-card border border-border p-4 md:p-6 rounded-xl mb-4 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 md:gap-3 mb-3">
                <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <h3 className="font-bold text-sm md:text-base">Move History</h3>
              </div>
              <div className="font-mono text-sm space-y-1">
                {moveHistory.length === 0 ? (
                  <span className="text-muted-foreground">No moves yet</span>
                ) : (
                  <div className="grid grid-cols-[auto_1fr] gap-x-4">
                    {moveHistory.map((move, i) => (
                      <span key={i} className={i % 2 === 0 ? 'text-white' : 'text-gray-400'}>
                        {i % 2 === 0 && <span className="text-muted-foreground mr-2">{Math.floor(i/2) + 1}.</span>}
                        {move}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Friday's taunts / Commentary */}
            <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/30 p-4 md:p-6 rounded-xl">
              <div className="flex items-center gap-2 md:gap-3 mb-3">
                <Crown className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <h3 className="font-bold text-sm md:text-base">Friday Says</h3>
              </div>
              <div className="space-y-2">
                {commentary.map((c, i) => (
                  <motion.p 
                    key={c.timestamp}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs md:text-sm font-mono italic ${
                      i === commentary.length - 1 ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    "{c.text}"
                  </motion.p>
                ))}
                {gameStatus === 'playing' && game.inCheck() && (
                  <p className="text-xs md:text-sm text-red-400 font-mono italic">
                    "Your king is sweating. I can feel it."
                  </p>
                )}
                {gameStatus === 'playing' && moveCount > 20 && game.turn() === 'w' && (
                  <p className="text-xs md:text-sm text-muted-foreground font-mono italic">
                    "Still thinking? 47 moves ahead..."
                  </p>
                )}
                {gameStatus === 'playing' && moveCount > 30 && (
                  <p className="text-xs md:text-sm text-muted-foreground font-mono italic">
                    "Resignation is a skill too."
                  </p>
                )}
              </div>
            </div>

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
                  {gameStatus === 'draw' ? "Neither wins. Pathetic." : "No moves left. How embarrassing."}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
