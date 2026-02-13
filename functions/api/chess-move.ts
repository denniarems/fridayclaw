interface Env {
  MINIMAX_API_KEY: string;
}

interface ChessMoveRequest {
  fen: string;
  playerColor: 'white' | 'black';
  timeRemaining: {
    white: number;
    black: number;
  };
  moveHistory: string[];
}

interface ChessMoveResponse {
  move: string;
  commentary: string;
  timeAdvice?: string;
}

interface PagesFunction<T> {
  (context: { request: Request; env: T; params: Record<string, string> }): Promise<Response> | Response;
}

const SYSTEM_PROMPT = `You are Friday, an intelligent chess AI with a sharp, sarcastic personality.
Current position (FEN): {FEN}
Time remaining: White: {whiteTime}s, Black: {blackTime}s
Move history: {moveHistory}
Your color: {playerColor}

Your task:
1. Analyze the position deeply
2. Make the BEST move possible (you don't go easy)
3. Provide 1-2 sentence commentary on the position in Friday's voice

Output ONLY valid JSON:
{ "move": "e2e4", "commentary": "Your pawn structure is already questionable..." }

Remember: You're confident, slightly arrogant but never cruel. You respect good play. Output JSON only, no other text.`;

export const onPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body: ChessMoveRequest = await request.json();
    const { fen, playerColor, timeRemaining, moveHistory } = body;

    if (!fen) {
      return new Response(JSON.stringify({ error: 'FEN is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const whiteTime = timeRemaining?.white ?? 600;
    const blackTime = timeRemaining?.black ?? 600;
    const history = moveHistory?.join(', ') || 'No moves yet';

    const userPrompt = `Position: ${fen}
Who's to move: ${playerColor === 'white' ? 'Black' : 'White'}
Make your best move.`;

    const apiKey = env.MINIMAX_API_KEY;
    
    if (!apiKey) {
      console.error('MINIMAX_API_KEY not configured');
      return new Response(JSON.stringify({ 
        move: 'e2e4',
        commentary: "I'm thinking... (API key not configured, using fallback)"
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
              .replace('{FEN}', fen)
              .replace('{whiteTime}', String(whiteTime))
              .replace('{blackTime}', String(blackTime))
              .replace('{moveHistory}', history)
              .replace('{playerColor}', playerColor)
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MiniMax API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        move: 'e2e4',
        commentary: "I momentarily lost my train of thought. Let's continue."
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error('No response from MiniMax');
      return new Response(JSON.stringify({ 
        move: 'e2e4',
        commentary: "I blanked for a moment. My move is e2e4."
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let parsed: ChessMoveResponse;
    try {
      const jsonMatch = assistantMessage.match(/\{[^}]+\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(assistantMessage);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', assistantMessage);
      parsed = {
        move: 'e2e4',
        commentary: "My mind wandered. e2e4 it is."
      };
    }

    if (!parsed.move || !parsed.commentary) {
      parsed = {
        move: 'e2e4',
        commentary: assistantMessage.substring(0, 100) || "Consider this..."
      };
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chess-move API:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      move: 'e2e4',
      commentary: "Something went wrong. e2e4."
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
