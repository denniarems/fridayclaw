# FridayClaw Chess AI - Task List

## Phase 1: TanStack Start Setup

### 1.1 Project Initialization
- [ ] Create new TanStack Start project
- [ ] Run `npm create tanstack-start@latest`
- [ ] Name project: fridayclaw
- [ ] Select Cloudflare Pages as deployment target
- [ ] Verify Node.js version compatibility

### 1.2 Cloudflare Configuration
- [ ] Install Wrangler CLI: `npm install -D wrangler`
- [ ] Create `wrangler.toml` in project root
- [ ] Configure Cloudflare Pages settings
- [ ] Set up Cloudflare environment variables
- [ ] Test local dev server: `npm run dev`

### 1.3 Project Structure Setup
- [ ] Create `src/routes/` directory
- [ ] Create `src/components/` directory
- [ ] Create `src/lib/` directory
- [ ] Create `functions/api/` directory
- [ ] Create `functions/` at root level

### 1.4 Migration Setup
- [ ] Copy existing pages from old repo
- [ ] Migrate `index.tsx` to routes
- [ ] Migrate `chess.tsx` to routes
- [ ] Migrate `time-travel.tsx` to routes
- [ ] Migrate `side-quests.tsx` to routes
- [ ] Update imports and file paths

### 1.5 Initial Deployment
- [ ] Initialize git repo
- [ ] Create .gitignore
- [ ] Connect to GitHub repo
- [ ] Deploy to Cloudflare Pages
- [ ] Verify deployment URL works
- [ ] Test all 4 pages load correctly

---

## Phase 2: Chess Frontend

### 2.1 Remove Difficulty Selector
- [ ] Open `chess.tsx` route
- [ ] Find difficulty selector component
- [ ] Remove easy/medium/hard dropdown
- [ ] Remove difficulty state
- [ ] Update any UI that references difficulty
- [ ] Test single mode works

### 2.2 Random Color Assignment
- [ ] Create color selection state
- [ ] Implement random function (Math.random)
- [ ] Add "New Game" button
- [ ] On click: randomly assign White/Black
- [ ] Set appropriate starting player
- [ ] Display assigned color to user
- [ ] Test both colors work

### 2.3 Chess Clock Implementation
- [ ] Create timer state: `{ white: 600, black: 600 }`
- [ ] Add 10 minutes = 600 seconds
- [ ] Create interval that ticks every second
- [ ] Check whose turn it is
- [ ] Decrement appropriate player's time
- [ ] Add 15 second increment after each move
- [ ] Handle time expiry (game over)
- [ ] Format time as MM:SS
- [ ] Display both clocks
- [ ] Highlight active player's clock

### 2.4 Commentary Display
- [ ] Create `Commentary.tsx` component
- [ ] Add state for current comment
- [ ] Position component on screen
- [ ] Style with Friday's personality
- [ ] Animate new comments
- [ ] Show comment history
- [ ] Limit to last 5 comments

### 2.5 Move History
- [ ] Create moves array state
- [ ] Track each move with notation
- [ ] Display move history panel
- [ ] Show moves grouped by turn
- [ ] Highlight current position
- [ ] Allow scroll to latest move

### 2.6 Board & Pieces
- [ ] Install chessboardjsx or use existing
- [ ] Configure board orientation (flip for Black)
- [ ] Make pieces draggable (player moves)
- [ ] Highlight valid moves on click
- [ ] Prevent illegal moves
- [ ] Add move animation
- [ ] Test board interactions

### 2.7 UI Polish
- [ ] Center board on screen
- [ ] Style timer to be visible
- [ ] Style commentary box
- [ ] Add "New Game" button styling
- [ ] Ensure mobile responsiveness
- [ ] Test on different screen sizes
- [ ] Add loading states

---

## Phase 3: Backend API

### 3.1 API Endpoint Setup
- [ ] Create `functions/api/chess-move.ts`
- [ ] Export `onPost` handler
- [ ] Accept FEN string in request body
- [ ] Validate FEN format
- [ ] Return move JSON response

### 3.2 MiniMax Integration
- [ ] Install MiniMax SDK or configure API
- [ ] Add API key to Wrangler secrets
- [ ] Create MiniMax client helper
- [ ] Build system prompt template
- [ ] Build user prompt template
- [ ] Test MiniMax connection

### 3.3 Prompt Engineering
- [ ] Write Friday personality prompt
- [ ] Include current position (FEN)
- [ ] Include time remaining for both
- [ ] Include game phase detection
- [ ] Add move requirements
- [ ] Add commentary format instructions
- [ ] Test response parsing

### 3.4 Chess.js Validation
- [ ] Install chess.js: `npm install chess.js`
- [ ] Import chess.js in API
- [ ] Create Chess instance from FEN
- [ ] Validate AI move is legal
- [ ] Validate AI move doesn't cause check on self
- [ ] Handle invalid moves (retry or error)
- [ ] Log validation errors

### 3.5 Move Response
- [ ] Extract move from MiniMax response
- [ ] Extract commentary from response
- [ ] Parse JSON output
- [ ] Return structured response: `{ move, commentary, timeAdvice }`
- [ ] Add error handling
- [ ] Add timeout handling

### 3.6 Time Pressure Logic
- [ ] Detect low time situations
- [ ] Adjust AI behavior when < 30 seconds
- [ ] Return time advice in response
- [ ] Prioritize faster moves when pressured
- [ ] Test under time pressure

### 3.7 API Testing
- [ ] Test with starting position
- [ ] Test with random positions
- [ ] Test with illegal FEN (error handling)
- [ ] Test response time < 3 seconds
- [ ] Test commentary quality
- [ ] Log API calls for debugging

---

## Phase 4: Frontend-Backend Integration

### 4.1 API Client Setup
- [ ] Create API client function
- [ ] Fetch from `/api/chess-move`
- [ ] Handle network errors
- [ ] Add timeout (10 seconds)
- [ ] Parse JSON response

### 4.2 Game Loop
- [ ] Detect player move completion
- [ ] Show "AI thinking..." state
- [ ] Call API with current FEN
- [ ] Parse response move
- [ ] Validate move on board
- [ ] Apply AI move to board
- [ ] Update commentary
- [ ] Reset thinking state

### 4.3 State Management
- [ ] Track game state: `idle | playing | gameOver`
- [ ] Track current FEN position
- [ ] Track whose turn
- [ ] Track move history
- [ ] Track timer values
- [ ] Track game result

### 4.4 Game End Detection
- [ ] Detect checkmate (chess.js)
- [ ] Detect stalemate
- [ ] Detect timeout
- [ ] Detect draw (insufficient material)
- [ ] Display result message
- [ ] Show "New Game" button
- [ ] Log game result

### 4.5 Error Handling
- [ ] Handle API timeouts
- [ ] Handle invalid moves from AI
- [ ] Handle network errors
- [ ] Show error messages to user
- [ ] Allow retry from error state
- [ ] Log errors for debugging

---

## Phase 5: Polish & Testing

### 5.1 Edge Cases
- [ ] Test insufficient material draws
- [ ] Test threefold repetition
- [ ] Test 50-move rule
- [ ] Test castling rights
- [ ] Test en passant
- [ ] Test pawn promotion

### 5.2 Performance
- [ ] Measure API response time
- [ ] Optimize prompt if slow
- [ ] Add loading spinner
- [ ] Minimize re-renders
- [ ] Test on slow connections

### 5.3 Visual Polish
- [ ] Add piece animation
- [ ] Add move highlight animation
- [ ] Style check indicator
- [ ] Style game over modal
- [ ] Add sound effects (optional)
- [ ] Fine-tune commentary styling

### 5.4 Final Testing
- [ ] Test complete game (checkmate)
- [ ] Test resignation
- [ ] Test new game flow
- [ ] Test mobile responsiveness
- [ ] Test dark mode (if applicable)
- [ ] Cross-browser testing

### 5.5 Deployment
- [ ] Run production build
- [ ] Deploy to Cloudflare Pages
- [ ] Verify live URL works
- [ ] Test all features on production
- [ ] Monitor error logs
- [ ] Share URL for feedback

---

## Dependencies to Install

```bash
# Core
npm install @tanstack/start vinxi

# Chess
npm install chess.js chessboardjsx

# Optional
npm install canvas-confetti  # For victory celebration
```

---

## Quick Reference

- **MiniMax Endpoint**: Configure in Wrangler secrets
- **API Route**: `functions/api/chess-move.ts`
- **Frontend Route**: `src/routes/chess.tsx`
- **Board Component**: `src/components/ChessBoard.tsx`
- **Commentary**: `src/components/Commentary.tsx`
- **Deploy**: `npx wrangler pages deploy`

---

*Created: 2026-02-13*
*Project: FridayClaw Chess AI*
