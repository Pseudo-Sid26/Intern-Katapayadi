# 🚀 Indi-Puzzler Setup Guide

Complete setup instructions for the Katapayadi Learning Platform with Multiplayer Quiz functionality.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (Atlas account or local installation)
- **Git**
- **Gemini API Key** (free at https://aistudio.google.com/app/apikey)

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Pseudo-Sid26/Intern-Katapayadi.git
cd Intern-Katapayadi
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your configuration (optional for frontend)
# VITE_API_URL=http://localhost:5000
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 4. Configure Environment Variables

Edit `backend/.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# AI Provider (use 'gemini' - it's free!)
AI_PROVIDER=gemini

# Gemini API Key (GET FREE: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your-actual-gemini-api-key-here

# MongoDB Configuration
# Option 1: MongoDB Atlas (Cloud - Recommended)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/katapayadi?retryWrites=true&w=majority

# Option 2: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/katapayadi

# JWT Secret (Generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-random-string-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### 🔑 Getting API Keys

**Gemini API Key (Free & Recommended):**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `GEMINI_API_KEY`

**MongoDB Atlas (Free Tier):**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<cluster>` with your values

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Wait for:
```
✅ MongoDB connected successfully
✅ Socket.IO server initialized
✅ Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
# From root directory
npm run dev
```

Open browser to: **http://localhost:5173**

## 🎮 Using the Application

### 1. Create an Account
- Click "Register" 
- Fill in username, email, display name, password
- Click "Create Account"

### 2. Play Solo Quiz
- Navigate to "Self-Quizzing"
- Select subject, class, difficulty
- Answer questions and earn XP

### 3. Play Multiplayer
- Navigate to "Multiplayer"
- **Create Room:** Set quiz parameters, share room code
- **Join Room:** Enter 6-character room code
- **Play:** Answer questions in real-time competition!

## 📁 Project Structure

```
Intern-Katapayadi/
├── backend/              # Express + Socket.IO server
│   ├── src/
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Socket.IO & RAG
│   │   ├── middleware/   # Auth middleware
│   │   └── index.ts      # Server entry
│   ├── .env.example      # Template for .env
│   └── package.json
│
├── src/                  # React + Vite frontend
│   ├── components/       # UI components
│   │   └── multiplayer/  # Multiplayer game components
│   ├── pages/            # Page components
│   ├── contexts/         # React Context (Auth)
│   ├── services/         # API clients
│   └── main.tsx          # App entry
│
├── docs/                 # Documentation
├── .env.example          # Frontend env template
└── package.json
```

## 🔒 Security Notes

### ⚠️ NEVER commit these files to Git:
- `backend/.env` (contains API keys & database credentials)
- `frontend/.env` (if created)
- `node_modules/`
- `data/embeddings-cache.json`
- `data/processed-documents.json`

### ✅ Safe to commit:
- `.env.example` files (templates without real credentials)
- All source code in `src/` and `backend/src/`
- Documentation files

## 🐛 Troubleshooting

### Backend won't start
- **MongoDB connection error:** Check `MONGODB_URI` is correct
- **Port already in use:** Change `PORT` in .env or kill process on port 5000
- **API key error:** Verify `GEMINI_API_KEY` is valid

### Frontend can't connect
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend .env (default: http://localhost:5000)
- Check browser console for CORS errors

### Multiplayer not working
- Ensure Socket.IO server initialized (check backend logs)
- Both players must be logged in
- Check network tab for WebSocket connection

### No questions generated
- Verify `GEMINI_API_KEY` is set correctly
- Check backend logs for API errors
- Ensure you have internet connection

## 📊 Database Collections

The MongoDB database uses these collections:
- **users**: User accounts and authentication
- **gamesessions**: Quiz game history
- **rooms**: Multiplayer game rooms

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Quiz
- `POST /api/quiz/generate` - Generate quiz questions
- `POST /api/quiz/session` - Save quiz session
- `GET /api/quiz/sessions/:userId` - Get user's quiz history

### User
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update user profile

## 🎯 Features

- ✅ User Authentication (JWT)
- ✅ Solo Quiz Mode
- ✅ Multiplayer Real-time Quiz
- ✅ Leaderboard & Rankings
- ✅ XP System & Leveling
- ✅ Socket.IO Real-time Updates
- ✅ AI-Generated Questions (Gemini)
- ✅ RAG-based Content Retrieval

## 📝 Development

```bash
# Run backend in dev mode (auto-reload)
cd backend
npm run dev

# Run frontend in dev mode
npm run dev

# Build for production
npm run build
```

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation in `/docs`
- Review `README.md` for more details

---

**Happy Learning! 🎓**
