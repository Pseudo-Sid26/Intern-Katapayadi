# ChromaDB Integration Guide

## What is ChromaDB?

ChromaDB is an open-source vector database designed specifically for AI applications. It provides:
- **Persistent storage** for embeddings
- **Fast similarity search** using efficient indexing
- **Metadata filtering** for precise queries
- **Simple API** with Python and JavaScript support

## Setup Instructions

### Option 1: Local ChromaDB Server (Recommended for Development)

1. **Install ChromaDB Server** (Python required):
   ```bash
   pip install chromadb
   ```

2. **Start ChromaDB Server**:
   ```bash
   chroma run --host localhost --port 8000
   ```

3. **Configure Backend** (already done):
   The backend is configured to connect to `localhost:8000` by default.

4. **Test Connection**:
   ```bash
   npm run ncert stats
   ```

### Option 2: In-Memory Mode (No Server Required)

ChromaDB can run in-memory mode without a separate server. The current configuration will automatically fall back to in-memory mode if the server isn't running.

### Option 3: Docker (Production)

1. **Run ChromaDB in Docker**:
   ```bash
   docker run -p 8000:8000 chromadb/chroma
   ```

2. **Or use Docker Compose** (create `docker-compose.yml`):
   ```yaml
   version: '3.8'
   services:
     chromadb:
       image: chromadb/chroma
       ports:
         - "8000:8000"
       volumes:
         - ./chroma-data:/chroma/chroma
   ```

   Then run:
   ```bash
   docker-compose up -d
   ```

## Features Enabled

### 1. **Persistent Storage**
- Embeddings survive backend restarts
- Data stored in ChromaDB server
- No need to regenerate embeddings

### 2. **Fast Similarity Search**
- Efficient vector indexing
- Cosine similarity search
- Returns top-K most relevant documents

### 3. **Metadata Filtering**
- Filter by subject: `{ subject: 'maths' }`
- Filter by class: `{ class: 9 }`
- Combine filters: `{ subject: 'science', class: 10 }`

### 4. **Batch Operations**
- Add multiple vectors at once
- Optimized for large datasets
- Progress tracking

## Usage

### Check ChromaDB Status
```bash
npm run ncert stats
```

### Process PDFs and Store in ChromaDB
```bash
npm run ncert process
```

### Search for Content
The RAG service automatically uses ChromaDB for similarity search:
```typescript
// In your code
const results = await vectorStore.search('quadratic equations', {
  topK: 5,
  subject: 'maths',
  class: 10,
  minScore: 0.7
});
```

## Migration from File-Based Storage

The old file-based vector store has been backed up to:
```
backend/src/services/vectorStore.inmemory.ts.bak
```

To revert to the old system:
```bash
cd backend/src/services
Move-Item vectorStore.ts vectorStore.chroma.ts
Move-Item vectorStore.inmemory.ts.bak vectorStore.ts
```

## Troubleshooting

### Connection Refused
**Error**: `Cannot connect to ChromaDB server`

**Solution**:
1. Check if ChromaDB server is running:
   ```bash
   curl http://localhost:8000/api/v1/heartbeat
   ```

2. Start the server:
   ```bash
   chroma run --host localhost --port 8000
   ```

### Port Already in Use
**Error**: `Port 8000 is already in use`

**Solution**:
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (Windows)
taskkill /PID <process_id> /F

# Or use a different port
chroma run --host localhost --port 8001
```

Then update the backend configuration.

### Slow Performance
**Issue**: Embedding generation is slow

**Solutions**:
1. **Use batch operations**:
   ```typescript
   await vectorStore.addChunks(allChunks); // Faster than individual adds
   ```

2. **Limit embedding size**:
   - Use shorter text chunks (current: 200 words)
   - Reduce overlap (current: 50 words)

3. **Use faster embedding model**:
   - Gemini: `text-embedding-004` (current, fast)
   - OpenAI: `text-embedding-3-small` (faster than 3-large)

## Configuration

### Environment Variables
Add to `backend/.env`:
```env
# ChromaDB Configuration
CHROMA_HOST=localhost
CHROMA_PORT=8000
CHROMA_COLLECTION=ncert_documents

# AI Provider
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_EMBEDDING_MODEL=text-embedding-004
```

### Collection Names
By default, embeddings are stored in the `ncert_documents` collection. To use a different collection:

```typescript
import { ChromaVectorStore } from './services/chromaVectorStore';

const customStore = new ChromaVectorStore('my_collection_name');
await customStore.initialize();
```

## Performance Metrics

### Current System (with ChromaDB)
- **PDF Processing**: ~30-60 seconds per book
- **Embedding Generation**: ~1-2 seconds per chunk
- **Vector Search**: ~50-100ms per query
- **Storage**: ~10-20 KB per vector

### Total Processing Time
- 9 textbooks (128 chapters)
- ~1500-2000 chunks
- **Estimated**: 30-60 minutes for complete processing

## Benefits Over File-Based Storage

| Feature | File-Based | ChromaDB |
|---------|-----------|----------|
| Persistence | ✅ JSON files | ✅ Database |
| Performance | ⚠️ Slow for large datasets | ✅ Fast indexing |
| Scalability | ❌ Limited | ✅ Production-ready |
| Concurrency | ❌ File locking issues | ✅ Multi-client support |
| Filtering | ⚠️ Manual filtering | ✅ Built-in metadata filters |
| Backup/Restore | ⚠️ Manual file copy | ✅ Built-in tools |

## Next Steps

1. ✅ ChromaDB installed and integrated
2. ⏳ Start ChromaDB server
3. ⏳ Process NCERT PDFs into ChromaDB
4. ⏳ Test quiz generation with ChromaDB
5. ⏳ Monitor performance and optimize

## Resources

- [ChromaDB Documentation](https://docs.trychroma.com/)
- [ChromaDB GitHub](https://github.com/chroma-core/chroma)
- [Vector Database Comparison](https://docs.trychroma.com/reference/comparison)
