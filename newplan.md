FridayClaw Chess AI - Final Plan

Requirements Confirmed ✅

| Feature      | Specification                          |
| ------------ | -------------------------------------- |
| AI Provider  | MiniMax only (validated with chess.js) |
| Personality  | Full Friday commentary + taunts        |
| Modes        | Single mode only (no easy/medium)      |
| Color        | Random (White or Black)                |
| Time Control | 10 min + 15 sec per move               |
| Hosting      | Cloudflare Pages + Functions           |
| Scope        | Chess AI only (no chat, no extras)     |


Architecture

┌─────────────────────────────────────────────────────┐
│                   FRONTEND                           │
│  ┌─────────────┐    ┌─────────────┐    ┌────────┐ │
│  │ Random Color│    │ 10m+15s Timer│    │Board   │ │
│  └─────────────┘    └─────────────┘    │+Moves  │ │
│  ┌───────────────────────────────────┐└────────┘ │
│  │   Friday Commentary (reactive)    │           │
│  └───────────────────────────────────┘           │
└─────────────────────────────────────────────────────┘
                        │
                        ▼ POST /api/chess-move
┌─────────────────────────────────────────────────────┐
│                   BACKEND (Cloudflare Functions)     │
│  ┌────────────────────────────────────────────────┐  │
│  │ 1. Parse FEN from request                      │  │
│  │ 2. Extract board state, whose turn             │  │
│  │ 3. Prompt MiniMax with:                        │  │
│  │    - Current position                          │  │
│  │    - Time remaining (both sides)               │  │
│  │    - Game history                              │  │
│  │    - My personality instruction                │  │
│  │ 4. Get move from MiniMax response              │  │
│  │ 5. Validate with chess.js (safety check)       │  │
│  │ 6. Return: { move, commentary, timeAdvice }   │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                   AI PROMPTING                       │
│  System: You are Friday, a sarcastic, intelligent   │
│  chess AI. You analyze positions deeply. You make   │
│  the best move possible. You add brief, sharp       │
│  commentary on the position (1-2 sentences max).   │
│  Output format: JSON { move: "e2e4", comment: "..."}│
└─────────────────────────────────────────────────────┘


Implementation Steps

Phase 1: TanStack Start Setup

1. Create new TanStack Start project
2. Configure Cloudflare Pages + Functions
3. Migrate existing pages (home, chess, time-travel, side-quests)
4. Test deployment

Phase 2: Chess Frontend

1. Remove difficulty selector
2. Add random color assignment on game start
3. Implement 10m+15s chess clock
4. Update UI for single-mode gameplay
5. Add real-time commentary display

Phase 3: Backend API

1. Create /api/chess-move function
2. Integrate MiniMax for move generation
3. Add chess.js validation on all AI moves
4. Implement commentary extraction
5. Add time pressure logic

Phase 4: Polish

1. Test all edge cases
2. Optimize latency
3. Add move history display
4. Final deployment


File Structure (TanStack Start)

fridayclaw/
├── src/
│   ├── routes/
│   │   ├── index.tsx          # Home
│   │   ├── chess.tsx          # Chess game (updated)
│   │   ├── time-travel.tsx
│   │   └── side-quests.tsx
│   ├── components/
│   │   ├── ChessBoard.tsx     # Board + Clock
│   │   └── Commentary.tsx     # Friday's reactions
│   └── lib/
│       └── chess.ts           # chess.js helpers
├── functions/
│   └── api/
│       └── chess-move.ts      # AI move endpoint
├── app.config.ts              # TanStack config
├── package.json
└── wrangler.toml              # Cloudflare config


MiniMax Prompt Strategy

const SYSTEM_PROMPT = `You are Friday, an intelligent chess AI with a sharp, sarcastic personality.
Current position: {FEN}
Time remaining: You: {myTime}s, Opponent: {oppTime}s
Game phase: {opening/middlegame/endgame}

Your task:
1. Analyze the position deeply
2. Make the BEST move possible (you don't go easy)
3. Provide 1-2 sentence commentary on the position

Output JSON only:
{ "move": "e2e4", "commentary": "Your pawn structure is already questionable..." }

Remember: You're confident, slightly arrogant, but never cruel. You respect good play.`;

const USER_PROMPT = `Position: {FEN}
Who's to move: {color}
Make your move.`;


Cost Estimate

| Item                 | Cost         |
| -------------------- | ------------ |
| Hosting (Cloudflare) | Free         |
| AI (MiniMax)         | ~$0.001/move |
| Est. games/month     | ~$0.50-1.00  |


Timeline

| Phase   | Duration | Deliverable                            |
| ------- | -------- | -------------------------------------- |
| Phase 1 | 30 min   | TanStack Start running on Cloudflare   |
| Phase 2 | 45 min   | Updated chess UI (random color, timer) |
| Phase 3 | 1 hour   | Working AI backend                     |
| Phase 4 | 30 min   | Polish + testing                       |

Total: ~2.5 hours


Check the codebase, and all components are not working properly  , analyse deeply and figer out the issue the solution 