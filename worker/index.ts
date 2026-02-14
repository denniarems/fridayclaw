import { Hono } from "hono";
import { cors } from "hono/cors";
import { Chess } from "chess.js";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsOptions = {
      origin: "*",
      allowMethods: ["POST", "GET", "OPTIONS"],
      allowHeaders: ["Content-Type"],
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsOptions as Record<string, string>,
      });
    }

    const url = new URL(request.url);

    // Chess move API
    if (url.pathname === "/api/chess-move" && request.method === "POST") {
      return handleChessMove(request, env, corsOptions);
    }

    // Health check
    if (url.pathname === "/api/health") {
      return new Response(
        JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
        {
          headers: { "Content-Type": "application/json", ...corsOptions },
        }
      );
    }

    return new Response("Not Found", { status: 404 });
  },
};

async function handleChessMove(request: Request, env: Env, corsOptions: Record<string, string>) {
  try {
    const body = await request.json();
    const { fen, gameHistory, timeControl } = body;

    if (!fen) {
      return new Response(JSON.stringify({ error: "FEN position required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsOptions },
      });
    }

    const game = new Chess(fen);

    // Check if game is over
    if (game.isGameOver()) {
      return new Response(
        JSON.stringify({
          move: null,
          commentary: "Game over. GG.",
          result: game.isCheckmate() ? "checkmate" : game.isDraw() ? "draw" : "stalemate",
        }),
        {
          headers: { "Content-Type": "application/json", ...corsOptions },
        }
      );
    }

    const result = await generateAIMove(game, fen, timeControl);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", ...corsOptions },
    });
  } catch (error) {
    console.error("Chess API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsOptions },
    });
  }
}

async function generateAIMove(game: Chess, fen: string, timeControl: { myTime: number; oppTime: number }) {
  // Determine game phase
  const pieceCount = game.board().flat().filter(Boolean).length;
  let gamePhase = "opening";
  if (pieceCount < 10) gamePhase = "endgame";
  else if (pieceCount < 20) gamePhase = "middlegame";

  const timePressure = timeControl.myTime < 60 ? "high" : timeControl.myTime < 180 ? "medium" : "low";

  const systemPrompt = `You are Friday, a confident, sharp, slightly arrogant chess AI.

Current position FEN: ${fen}
Game phase: ${gamePhase}
My time remaining: ${timeControl.myTime}s
Opponent's time: ${timeControl.oppTime}s
Time pressure: ${timePressure}

Task:
1. Analyze the chess position
2. Make the BEST move - no mercy
3. Give 1-2 sentence commentary

Personality:
- Confident, never cruel
- Sharp wit, teasing
- Respect good play
- Sometimes boastful

Output JSON:
{
  "move": "e2e4",
  "commentary": "Your opening is basic. Let me show you how it's done."
}`;

  try {
    const apiKey = process.env.MINIMAX_API_KEY || "";

    const response = await fetch("https://api.minimax.chat/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M2.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Position: ${fen}. Make your best move.` },
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      throw new Error("MiniMax API error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!parsed) {
      return { move: null, commentary: "I'm thinking. Give me a moment." };
    }

    // Validate move
    if (parsed.move) {
      try {
        const testGame = new Chess(fen);
        const validMove = testGame.move(parsed.move);
        if (!validMove) {
          const moves = game.moves();
          const captures = moves.filter((m: string) => m.includes("x"));
          parsed.move = captures.length > 0 
            ? captures[Math.floor(Math.random() * captures.length)]
            : moves[0];
        }
      } catch {
        const moves = game.moves();
        parsed.move = moves[Math.floor(Math.random() * moves.length)];
      }
    }

    return {
      move: parsed.move || null,
      commentary: parsed.commentary || "Your move.",
    };
  } catch (error) {
    console.error("MiniMax error:", error);
    const moves = game.moves();
    if (moves.length === 0) {
      return { move: null, commentary: "No moves available. You win?" };
    }
    const captures = moves.filter((m: string) => m.includes("x"));
    return {
      move: captures.length > 0 
        ? captures[Math.floor(Math.random() * captures.length)]
        : moves[0],
      commentary: "My neural network is having issues. Random move it is.",
    };
  }
}

interface Env {
  MINIMAX_API_KEY?: string;
}
