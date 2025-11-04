# Katapayadi Backend API

Backend server for the Katapayadi Learning Platform with RAG-powered quiz generation.

## Features

- 🤖 **Dual AI Provider Support**: Use OpenAI or Google Gemini
- 🔍 **Vector Search**: Semantic search using AI embeddings
- 📚 **NCERT Content**: Pre-loaded sample content for Classes 1-10
- 🔒 **Secure API**: API keys stored server-side
- ⚡ **Fast**: In-memory vector store with optimized search
- 🛡️ **Type-Safe**: Full TypeScript implementation
- 🔄 **Automatic Fallback**: Sample questions if API unavailable

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Providers**: 
  - OpenAI API (text-embedding-3-small + gpt-4o-mini)
  - Google Gemini (text-embedding-004 + gemini-1.5-flash)
- **Vector Store**: Custom in-memory implementation

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── config/
│   │   └── index.ts          # Configuration management
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── services/
│   │   ├── embeddings.ts     # OpenAI embedding service
│   │   ├── vectorStore.ts    # Vector database
│   │   ├── documentLoader.ts # NCERT document chunking
│   │   ├── quizGenerator.ts  # LLM quiz generation
│   │   └── ragService.ts     # Main RAG orchestration
│   └── routes/
│       └── quiz.ts           # Quiz API endpoints
├── package.json
├── tsconfig.json
└── .env.example
```

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and configure your AI provider
```

**Choose your AI provider:**

**Option 1: OpenAI (Recommended)**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
```

**Option 2: Google Gemini**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key-here
```

**Option 3: Both (OpenAI as default)**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

Required environment variables:

```env
PORT=5000
NODE_ENV=development
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
FRONTEND_URL=http://localhost:5173
```

**Get API Keys:**
- **OpenAI**: https://platform.openai.com/api-keys
- **Gemini**: https://aistudio.google.com/app/apikey

### 3. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 4. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Generate Quiz

**POST** `/api/quiz/generate`

Generate quiz questions based on NCERT content.

**Request Body:**
```json
{
  "subject": "maths",
  "class": 8,
  "difficulty": "medium",
  "numberOfQuestions": 5,
  "topic": "algebra"
}
```

**Parameters:**
- `subject` (required): `maths` | `science` | `history` | `geography` | `english`
- `class` (required): Integer 1-10
- `difficulty` (optional): `easy` | `medium` | `hard` (default: `medium`)
- `numberOfQuestions` (optional): Integer 1-20 (default: 5)
- `topic` (optional): Specific topic string
- `chapter` (optional): Specific chapter string

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "quiz_1234567890_0",
      "question": "What is 2 + 2?",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": "4",
      "explanation": "2 + 2 equals 4",
      "subject": "maths",
      "class": 8,
      "difficulty": "easy"
    }
  ],
  "metadata": {
    "count": 1,
    "subject": "maths",
    "class": 8,
    "difficulty": "easy"
  }
}
```

### Get Statistics

**GET** `/api/quiz/stats`

Get RAG system statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalChunks": 150,
    "subjects": ["maths", "science", "history", "geography", "english"],
    "classes": [5, 6, 7, 8, 9],
    "lastUpdated": "2025-10-30T12:00:00.000Z"
  }
}
```

### Reset System

**POST** `/api/quiz/reset`

Reset and reinitialize the RAG system.

**Response:**
```json
{
  "success": true,
  "message": "RAG system reset successfully",
  "data": {
    "totalChunks": 150,
    "subjects": ["maths", "science", "history", "geography", "english"],
    "classes": [5, 6, 7, 8, 9],
    "lastUpdated": "2025-10-30T12:00:00.000Z"
  }
}
```

### Get AI Provider Info

**GET** `/api/quiz/provider`

Get current AI provider configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "provider": "openai",
    "embeddingProvider": "openai",
    "models": {
      "embedding": "text-embedding-3-small",
      "chat": "gpt-4o-mini"
    },
    "configured": {
      "openai": true,
      "gemini": false
    }
  }
}
```

### Health Check

**GET** `/health`

Server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-30T12:00:00.000Z",
  "environment": "development"
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `AI_PROVIDER` | AI provider (`openai` or `gemini`) | `openai` |
| `OPENAI_API_KEY` | OpenAI API key | Required for OpenAI |
| `GEMINI_API_KEY` | Google Gemini API key | Required for Gemini |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### RAG Configuration

Default configuration in `src/config/index.ts`:

```typescript
{
  // OpenAI Models
  embeddingModel: 'text-embedding-3-small',
  chatModel: 'gpt-4o-mini',
  
  // Gemini Models
  geminiEmbeddingModel: 'text-embedding-004',
  geminiChatModel: 'gemini-1.5-flash',
  
  // RAG Settings
  chunkSize: 500,           // tokens per chunk
  chunkOverlap: 50,         // token overlap between chunks
  topK: 3,                  // number of chunks to retrieve
  minSimilarityScore: 0.6   // minimum cosine similarity
}
```

### Switching AI Providers

Change `AI_PROVIDER` in `.env`:

```bash
# Use OpenAI
AI_PROVIDER=openai

# Use Gemini
AI_PROVIDER=gemini
```

Restart the server for changes to take effect.

**Model Comparison:**

| Feature | OpenAI | Gemini |
|---------|--------|--------|
| Embedding Model | text-embedding-3-small (1536 dims) | text-embedding-004 (768 dims) |
| Chat Model | gpt-4o-mini | gemini-1.5-flash |
| Batch Embeddings | ✅ Yes | ❌ No (sequential) |
| JSON Mode | ✅ Native | ⚠️ Requires parsing |
| Cost | $$ | $ (Free tier available) |
| Speed | Fast | Very Fast |

## Development

### Scripts

- `npm run dev` - Start development server with hot reload (uses tsx)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run typecheck` - Type check without building

### Adding New NCERT Content

1. Edit `src/services/documentLoader.ts`
2. Add document to `loadSampleDocuments()` array:

```typescript
{
  id: 'unique_id',
  subject: 'maths',
  class: 8,
  chapter: 'Chapter Name',
  content: 'Full chapter content here...',
}
```

3. Restart server to reload content

### Testing with curl

```bash
# Generate quiz
curl -X POST http://localhost:5000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"subject":"maths","class":8,"difficulty":"medium","numberOfQuestions":3}'

# Get stats
curl http://localhost:5000/api/quiz/stats

# Get AI provider info
curl http://localhost:5000/api/quiz/provider

# Health check
curl http://localhost:5000/health
```

## Deployment

### Using PM2

```bash
npm run build
pm2 start dist/index.js --name katapayadi-backend
```

### Using Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
AI_PROVIDER=openai
OPENAI_API_KEY=sk-prod-key-here
GEMINI_API_KEY=your-gemini-key-here
FRONTEND_URL=https://your-frontend-domain.com
```

## Troubleshooting

### AI Provider Errors

**OpenAI:**
- **401 Unauthorized**: Check your `OPENAI_API_KEY`
- **429 Rate Limited**: You've exceeded OpenAI's rate limits
- **Solution**: Switch to Gemini or wait for rate limit reset

**Gemini:**
- **API Key Invalid**: Check your `GEMINI_API_KEY` at https://aistudio.google.com/app/apikey
- **Quota Exceeded**: Check your quota in Google AI Studio
- **Solution**: Switch to OpenAI or wait for quota refresh

**Fallback Mode**: 
- Server will use sample questions if both APIs fail
- Check backend console for error messages

### CORS Errors

- Ensure `FRONTEND_URL` matches your frontend domain
- Check that frontend is making requests to correct backend URL

### Performance Issues

- Reduce `topK` value for faster searches
- Increase `minSimilarityScore` to filter low-quality results
- Consider implementing caching for frequent queries
- Gemini is generally faster but has different embedding dimensions

## License

MIT
