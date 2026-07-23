# DevTrack - Developer Productivity Dashboard

A unified developer progress tracker that pulls data from **GitHub**, **LeetCode**, and **Codeforces**, calculates a **Job Match Score**, and displays everything in a beautiful dashboard with charts, streaks, and weekly insights.

## Features

- **User Authentication** — Register/login with JWT, persistent sessions
- **GitHub Integration** — Profile overview, commit activity, language breakdown, top repositories
- **LeetCode Tracker** — Problem-solving stats, weekly progress, topic distribution, difficulty breakdown
- **Codeforces Integration** — Rating history, rank, solved problems distribution
- **Job Match Score** — Algorithm that computes readiness for 6 top tech companies
- **Activity Heatmap** — GitHub-style contribution calendar
- **Streak Tracker** — 28-day coding streak visualization
- **Skill Bars** — Calculated skill levels based on actual activity
- **Weekly Report** — AI-generated recommendations based on weak areas
- **Persistent Data** — All fetched data cached in MongoDB
- **Fully responsive** — Works on desktop and mobile

## Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Tailwind CSS v3
- Recharts (charts)
- react-calendar-heatmap
- lucide-react (icons)
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (bcryptjs + jsonwebtoken)
- Axios
- dotenv, cors, helmet, morgan, express-validator

## Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Clone

```bash
git clone <repo-url>
cd devtrack
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devtrack
JWT_SECRET=your_random_jwt_secret_here
GITHUB_TOKEN=ghp_your_github_token  # optional, increases rate limit
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** — register an account and connect your developer profiles.

## Deployment

### Backend (Render)

1. Push to GitHub
2. Create a **Web Service** on Render
3. Connect your repo, set:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node server.js`
4. Add environment variables in Render dashboard:
   - `MONGODB_URI`, `JWT_SECRET`, `GITHUB_TOKEN`, `CLIENT_URL`

### Frontend (Vercel)

1. Create a **Static Site** on Vercel
2. Set:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL

### Docker

```bash
docker build -t devtrack .
docker run -p 5000:5000 --env-file server/.env devtrack
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (auth) |

### Profile (all require auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get full profile with cached data |
| PUT | `/api/profile/usernames` | Update connected usernames |
| POST | `/api/profile/refresh/github` | Fetch & cache GitHub data |
| POST | `/api/profile/refresh/leetcode` | Fetch & cache LeetCode data |
| POST | `/api/profile/refresh/codeforces` | Fetch & cache Codeforces data |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/github/:username` | Get GitHub profile (no auth) |
| GET | `/api/leetcode/:username` | Get LeetCode stats (no auth) |
| POST | `/api/jobmatch` | Calculate job match score |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Server port |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens |
| `GITHUB_TOKEN` | No | - | GitHub PAT (increases rate limit) |
| `CLIENT_URL` | No | http://localhost:5173 | CORS origin |

## Project Structure

```
devtrack/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # API client modules
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Helpers & scoring algorithm
│   ├── package.json
│   └── vite.config.js
├── server/                  # Express backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── models/
│   └── server.js
├── Dockerfile
├── render.yaml
└── README.md
```

## Extending DevTrack

<!-- TODO: LinkedIn integration — fetch profile data and add to job match score -->
<!-- TODO: Weekly email reports — send digest via nodemailer -->
<!-- TODO: Codeforces — already integrated! -->
<!-- TODO: Multi-user teams — compare stats with teammates -->
<!-- TODO: Dark mode — add theme toggle with Tailwind dark mode -->
<!-- TODO: Export dashboard as PDF — generate report cards using jspdf -->
<!-- TODO: OAuth login — GitHub/Google OAuth for seamless auth -->
<!-- TODO: Webhook sync — auto-refresh data on GitHub push events -->

## License

MIT
