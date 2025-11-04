# 🚀 Quick Start Guide

Get the Katapayadi Learning Platform running in 5 minutes!

## Prerequisites

- **Node.js 18+** and npm installed
- **AI Provider API Key**: Choose one or both:
  - **OpenAI**: https://platform.openai.com/api-keys (Recommended)
  - **Google Gemini**: https://aistudio.google.com/app/apikey (Free tier available)

## Step 1: Clone and Setup Frontend

```bash
# Navigate to project root
cd Intern-Katapayadi

# Install frontend dependencies
npm install

# (Optional) Create frontend .env file
cp .env.example .env
# Edit .env if needed, but defaults work fine for local development
```

## Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment template
cp .env.example .env
```

**Edit `backend/.env` and configure your AI provider:**

**Option 1: Using OpenAI (Recommended)**
```env
PORT=5000
NODE_ENV=development
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-openai-key-here
FRONTEND_URL=http://localhost:5173
```

**Option 2: Using Google Gemini (Free tier available)**
```env
PORT=5000
NODE_ENV=development
AI_PROVIDER=gemini
GEMINI_API_KEY=your-actual-gemini-key-here
FRONTEND_URL=http://localhost:5173
```

**Option 3: Configure both (OpenAI as default)**
```env
PORT=5000
NODE_ENV=development
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=your-gemini-key-here
FRONTEND_URL=http://localhost:5173
```

## Step 3: Start Both Servers

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🤖 AI Provider: OPENAI (or GEMINI)
✅ OpenAI embedding service initialized (or Gemini)
✅ OpenAI quiz generator initialized (or Gemini)
✅ Server running on port 5000
RAG service initialized successfully
```

### Terminal 2 - Frontend Server

```bash
# From project root
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

## Step 4: Test the Application

1. **Open browser**: http://localhost:5173
2. **Navigate to**: Self Quizzing page
3. **Check status**: You should see "Backend Online" badge
4. **Generate quiz**: 
   - Select subject (e.g., Maths)
   - Select class (e.g., 8)
   - Select difficulty (Medium)
   - Click "Generate New Question"

## Troubleshooting

### Backend not starting?

**Error: Cannot find module 'express'**
```bash
cd backend
npm install
```

**Error: OPENAI_API_KEY not set** or **GEMINI_API_KEY not set**
- Check `backend/.env` file exists
- Ensure API key is correct format
  - OpenAI: `sk-...`
  - Gemini: Usually starts with `AI...`
- Verify `AI_PROVIDER` matches the key you configured

### Quiz generation failing?

**Check AI Provider:**
```bash
curl http://localhost:5000/api/quiz/provider
```

Should show which provider is active and configured.

**OpenAI Issues:**
- Verify key is valid at https://platform.openai.com/api-keys
- Ensure you have credits/billing enabled
- Rate limits: 3 requests/min on free tier

**Gemini Issues:**
- Verify key at https://aistudio.google.com/app/apikey
- Check quota limits in AI Studio
- Free tier: 60 requests/min

**Switch Providers:**
If one provider fails, edit `backend/.env`:
```env
# Switch from OpenAI to Gemini
AI_PROVIDER=gemini
```
Then restart backend server.

**Fallback mode:**
- If both AI providers fail, backend returns sample questions automatically
- Check backend console for error messages

### Frontend showing "Backend Offline"?

**Check backend is running:**
```bash
# Test backend health
curl http://localhost:5000/health
```

Should return:
```json
{"status":"healthy","timestamp":"2025-10-30T..."}
```

**Check CORS settings:**
- Ensure `backend/.env` has `FRONTEND_URL=http://localhost:5173`

## Ports Summary

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 5000 | http://localhost:5000 |

## API Endpoints (for testing)

```bash
# Health check
curl http://localhost:5000/health

# Get AI provider info
curl http://localhost:5000/api/quiz/provider

# Get RAG stats
curl http://localhost:5000/api/quiz/stats

# Generate quiz (POST)
curl -X POST http://localhost:5000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"subject":"maths","class":8,"difficulty":"medium","numberOfQuestions":3}'
```

## AI Provider Comparison

| Feature | OpenAI | Gemini |
|---------|--------|--------|
| **Cost** | Paid (from $0.0001/1K tokens) | Free tier available |
| **Speed** | Fast | Very Fast |
| **Embedding Quality** | Excellent (1536 dims) | Very Good (768 dims) |
| **Setup** | Credit card required | Free to start |
| **Rate Limits** | 3 req/min (free tier) | 60 req/min (free tier) |
| **Best For** | Production apps | Development/testing |

**Recommendation**: Start with Gemini for free testing, upgrade to OpenAI for production.

## Next Steps

- ✅ Explore different subjects and classes
- ✅ Try different difficulty levels
- ✅ Switch between OpenAI and Gemini providers
- ✅ Check `backend/README.md` for API documentation
- ✅ Read main `README.md` for architecture details
- ✅ Add your own NCERT content in `backend/src/services/documentLoader.ts`

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
# Set environment variable: VITE_API_URL=https://your-backend-url.com
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd backend
npm run build
# Deploy with Node.js
# Set environment variables in hosting platform
```

## Need Help?

- **Backend API docs**: See `backend/README.md`
- **Architecture**: See main `README.md`
- **Issues**: Check console logs in both terminal windows
