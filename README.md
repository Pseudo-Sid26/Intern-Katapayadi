# Katapayadi Detectives

A gamified educational platform to learn, compete, and enhance your skills with a touch of Indian culture.

## 🚀 Quick Start

### Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will run at: **http://localhost:5173**

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment file and add your OpenAI API key
cp .env.example .env

# Start backend server
npm run dev
```

The backend API will run at: **http://localhost:5000**

**Important**: Both frontend and backend must be running for the RAG quiz system to work!

## 📋 Available Scripts

### Frontend

```bash
npm run dev       # Start frontend development server
npm run build     # Build frontend for production
npm run preview   # Preview production build
npm run typecheck # TypeScript type checking
```

### Backend

```bash
cd backend
npm run dev       # Start backend with hot reload
npm run build     # Build backend for production
npm start         # Run production backend
npm run typecheck # TypeScript type checking
```

## 🎮 Features

- **Self Quizzing** - AI-powered RAG system generates questions from NCERT textbooks (Classes 1-10)
  - 5 subjects: Mathematics, Science, History, Geography, English
  - Vector similarity search for content retrieval
  - GPT-4o-mini powered question generation
  - Works offline with sample questions
- **Multiplayer** - Challenge friends in real-time quiz battles
- **Brain Enhancement** - Memory games, logic puzzles, and symbol decoding
- **Leaderboard** - Track rankings and compete with other players
- **Encoding Charts** - Learn the Katapayadi number encoding system
- **Profile** - Track your progress, badges, and achievements
- **Artifact Vault** - Collect and explore 3D historical artifacts
- **Dynasty Ledger** - Team-based dynasty competitions

## 🛠️ Tech Stack

- **React 18.3** + TypeScript
- **Vite** - Fast build tool
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible components
- **OpenAI API** - Embeddings (text-embedding-3-small) + Quiz Generation (GPT-4o-mini)
- **LangChain** - RAG framework support
- **Firebase** - Backend services
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Three.js** - 3D graphics

## 🤖 RAG System Architecture

The Self Quizzing feature uses a **client-server architecture** with a production-ready RAG system:

### Architecture

```
Frontend (React)          Backend (Express/Node.js)      External Services
├─ Quiz UI               ├─ REST API                    ├─ OpenAI API
├─ API Client            ├─ RAG Service                 │  ├─ Embeddings
└─ State Management      ├─ Vector Store (In-Memory)    │  └─ GPT-4o-mini
                         ├─ Document Loader             └─ (Optional)
                         └─ Quiz Generator
```

### Backend Components

1. **Document Loader** - Chunks NCERT content (500 tokens with 50 token overlap)
2. **Embeddings Service** - OpenAI text-embedding-3-small with cosine similarity
3. **Vector Store** - In-memory database with semantic search
4. **Quiz Generator** - GPT-4o-mini generates contextual MCQs
5. **REST API** - Express endpoints for quiz generation

### Frontend Components

1. **API Client** - HTTP client for backend communication
2. **Quiz UI** - Subject/class/difficulty selection interface
3. **Backend Status** - Real-time connection monitoring

### API Endpoints

- `POST /api/quiz/generate` - Generate quiz questions
- `GET /api/quiz/stats` - Get RAG system statistics
- `POST /api/quiz/reset` - Reset RAG system
- `GET /health` - Health check

See `backend/README.md` for detailed API documentation.

## 📁 Project Structure

```
Intern-Katapayadi/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── App.tsx          # Main app with routing
│   │   ├── main.tsx         # React entry point
│   │   ├── pages/           # Page components
│   │   │   └── SelfQuizzing.tsx  # RAG-powered quiz interface
│   │   ├── services/
│   │   │   └── apiClient.ts     # Backend API client
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/          # Shadcn UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # Express backend
│   ├── src/
│   │   ├── index.ts         # Server entry point
│   │   ├── config/          # Configuration
│   │   ├── types/           # TypeScript types
│   │   ├── services/        # RAG services
│   │   │   ├── embeddings.ts
│   │   │   ├── vectorStore.ts
│   │   │   ├── documentLoader.ts
│   │   │   ├── quizGenerator.ts
│   │   │   └── ragService.ts
│   │   └── routes/          # API routes
│   │       └── quiz.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md            # Backend API documentation
│
└── README.md                # This file
```

## 🎨 Design System

- **Primary Color**: Saffron (#FF9933)
- **Background**: Warm beige (#F2E6D9)
- **Accent**: Indigo (#4B0082)
- **Fonts**: Playfair Display (headlines), PT Sans (body)

See `docs/blueprint.md` for complete design guidelines.

## 🔧 Development

### Adding New Pages

1. Create component in `src/pages/`:
```tsx
export default function NewPage() {
  return <div>My New Page</div>
}
```

2. Add route in `src/App.tsx`:
```tsx
import NewPage from '@/pages/NewPage';
<Route path="/new-page" element={<NewPage />} />
```

3. Add navigation link in `src/components/main-nav.tsx`

## 🌐 Environment Variables

### Frontend (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# Firebase configuration (optional)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (backend/.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI API (required for quiz generation)
OPENAI_API_KEY=sk-your-api-key-here

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**Get OpenAI API Key**: [OpenAI Platform](https://platform.openai.com/api-keys)

**Note**: The backend handles all OpenAI API calls securely. The frontend never exposes API keys.

## 📦 Production Build

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment to any static hosting service.

---

**License**: Private and Proprietary
