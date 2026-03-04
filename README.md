# Chef Claude 🍽️

An AI-powered recipe generator built with React and Express. Users add ingredients they have on hand and Chef Claude suggests a recipe using the Anthropic Claude API.

🔗 **Live Demo:** [https://chef-claude-repo-1.onrender.com](https://chef-claude-repo-1.onrender.com)

---

## Features

- Add up to 10 ingredients from your kitchen
- AI-generated recipes based on your specific ingredients
- "Try Another Recipe" button for alternative suggestions
- Save recipes to revisit later
- Recipes persist across sessions so you never lose what you were looking at
- Remove ingredients individually with a hover-reveal delete button
- Error handling for failed API requests
- Input validation to prevent empty or duplicate ingredients

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| AI | Anthropic Claude API (claude-sonnet-4-5) |
| Styling | CSS |
| Deployment | Render (frontend + backend) |

---

## Architecture

```
User (React Frontend)
        ↓
  Adds ingredients and clicks "Get a Recipe"
        ↓
Express Backend (Node.js)
  - Receives ingredients via POST /api/recipe
  - Passes ingredients to Anthropic SDK
        ↓
Anthropic Claude API
  - Generates a recipe based on the ingredients
  - Returns markdown-formatted response
        ↓
React Frontend
  - Renders the recipe using ReactMarkdown
  - Saves current recipe to localStorage
```

The frontend and backend are deployed as separate services on Render. The backend never exposes the API key to the client — all communication with Anthropic happens server-side.

---

## Running Locally

### Prerequisites
- Node.js installed
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Steps

1. Clone the repository
```bash
git clone https://github.com/btallakson27/Chef-Claude
cd Chef-Claude
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
cd ..
```

4. Create a `.env` file inside the `server` folder
```
ANTHROPIC_API_KEY=your_api_key_here
```

5. Start the backend server
```bash
cd server
node index.js
```

6. In a separate terminal, start the frontend
```bash
npm run dev
```

7. Open [http://localhost:5173](http://localhost:5173) in your browser

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your secret key from the Anthropic console |

Environment variables are stored in a `.env` file that is never committed to GitHub (it is listed in `.gitignore`). This keeps your API key secure and off of version control. On Render, environment variables are set directly in the service dashboard.

---

## Deployment

Both the frontend and backend are deployed on [Render](https://render.com).

- The **backend** runs as a Node.js web service and exposes a single endpoint: `POST /api/recipe`
- The **frontend** is built with `npm run build` and served as a static site
- CORS is configured on the backend to only accept requests from the deployed frontend URL

---

## Known Limitations

- The Render free tier spins down after inactivity — the first request after a period of no use may take 30–60 seconds while the server wakes up
- Saved recipes are stored in localStorage, meaning they are device and browser specific — clearing browser data will remove them
- There is currently no user authentication, so saved recipes are not synced across devices
- Ingredient list resets on page refresh — only the generated recipe persists