import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // AI Provider ('openai' or 'gemini')
  aiProvider: (process.env.AI_PROVIDER || 'openai') as 'openai' | 'gemini',
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  
  // Google Gemini
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // OpenAI Models
  embeddingModel: 'text-embedding-3-small',
  chatModel: 'gpt-4o-mini',
  
  // Gemini Models (discovered via scripts/check-gemini-models.ts)
  // For embeddings: use specialized embedding model
  geminiEmbeddingModel: 'text-embedding-004',
  // For quiz generation: use Gemini 2.5 Pro for best reasoning and JSON output
  // Gemini 2.5 Pro offers:
  // - Large context window (up to 2M tokens) - perfect for RAG
  // - Superior reasoning for question/answer generation
  // - Structured JSON output for easy parsing
  geminiChatModel: 'gemini-2.5-pro',
  
  // RAG Configuration
  chunkSize: 500,
  chunkOverlap: 50,
  topK: 3,
  minSimilarityScore: 0.6,
};

// Validation
if (config.nodeEnv === 'production') {
  if (!config.openaiApiKey && !config.geminiApiKey) {
    console.warn('WARNING: No AI API keys configured. RAG features will use fallback mode.');
  }
  
  if (config.aiProvider === 'openai' && !config.openaiApiKey) {
    console.warn('WARNING: AI_PROVIDER is set to "openai" but OPENAI_API_KEY is not set.');
  }
  
  if (config.aiProvider === 'gemini' && !config.geminiApiKey) {
    console.warn('WARNING: AI_PROVIDER is set to "gemini" but GEMINI_API_KEY is not set.');
  }
}

console.log(`🤖 AI Provider: ${config.aiProvider.toUpperCase()}`);

export default config;
