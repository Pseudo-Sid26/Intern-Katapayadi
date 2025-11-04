import { ncertPDFDownloader } from '../src/services/pdfDownloader';
import { pdfProcessor } from '../src/services/pdfProcessor';
import { documentLoader } from '../src/services/documentLoader';
import { chromaVectorStore } from '../src/services/chromaVectorStore';
import { embeddingService } from '../src/services/embeddings';
import config from '../src/config';

/**
 * CLI Tool to download and process NCERT PDFs
 * Usage: node scripts/download-ncert-pdfs.js [command]
 */

async function main() {
  const command = process.argv[2] || 'help';

  console.log('\n🎓 NCERT PDF Manager\n');

  try {
    switch (command) {
      case 'list':
        await listAvailableBooks();
        break;

      case 'download':
        await downloadBooks();
        break;

      case 'process':
        await processDownloadedPDFs();
        break;

      case 'full':
        await fullPipeline();
        break;

      case 'stats':
        await showStats();
        break;

      default:
        showHelp();
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

/**
 * Show available books
 */
async function listAvailableBooks() {
  console.log('📚 Available NCERT Books:\n');

  const books = ncertPDFDownloader.getAvailableBooks();
  
  // Group by class
  const byClass = new Map<number, Array<typeof books[0]>>();
  books.forEach((book: typeof books[0]) => {
    if (!byClass.has(book.class)) {
      byClass.set(book.class, []);
    }
    byClass.get(book.class)!.push(book);
  });

  for (const [classNum, classBooks] of Array.from(byClass.entries()).sort(([a], [b]) => a - b)) {
    console.log(`\n📖 Class ${classNum}:`);
    classBooks.forEach((book: typeof books[0]) => {
      console.log(`   • ${book.title} (${book.subject})`);
    });
  }

  console.log(`\n✅ Total: ${books.length} books available\n`);
}

/**
 * Download books
 */
async function downloadBooks() {
  const classArg = process.argv[3];
  const subjectArg = process.argv[4];

  await ncertPDFDownloader.initialize();

  if (classArg === 'all') {
    console.log('📥 Downloading all available books...');
    await ncertPDFDownloader.downloadAll();
  } else if (classArg) {
    const classNum = parseInt(classArg);
    if (isNaN(classNum)) {
      console.error('❌ Invalid class number');
      return;
    }
    console.log(`📥 Downloading books for Class ${classNum}...`);
    await ncertPDFDownloader.downloadByClass(classNum);
  } else if (subjectArg) {
    console.log(`📥 Downloading ${subjectArg} books...`);
    await ncertPDFDownloader.downloadBySubject(subjectArg as any);
  } else {
    // Download a sample set (Class 6-8 Maths and Science)
    console.log('📥 Downloading sample books (Class 6-8 Maths & Science)...');
    const sampleBooks = ncertPDFDownloader.getAvailableBooks().filter(
      (book: any) => [6, 7, 8].includes(book.class) && ['maths', 'science'].includes(book.subject)
    );
    await ncertPDFDownloader.downloadMultiplePDFs(sampleBooks);
  }

  const stats = await ncertPDFDownloader.getStats();
  console.log('\n📊 Download Statistics:');
  console.log(`   Total available: ${stats.totalAvailable}`);
  console.log(`   Total downloaded: ${stats.totalDownloaded}`);
  console.log(`   Downloaded files: ${stats.downloadedFiles.join(', ')}`);
}

/**
 * Process downloaded PDFs
 */
async function processDownloadedPDFs() {
  console.log('📄 Processing downloaded PDFs...\n');

  const documents = await pdfProcessor.processDirectory(
    './data/ncert-pdfs',
    'maths',
    6
  );

  if (documents.length === 0) {
    console.log('⚠️ No PDFs found to process');
    console.log('💡 Run "npm run ncert download" first to download PDFs');
    return;
  }

  // Save processed documents
  await pdfProcessor.saveToJSON(documents, './data/processed-documents.json');

  // Generate embeddings and store in vector DB
  console.log('\n🔢 Generating embeddings...');
  await chromaVectorStore.initialize();

  let totalChunks = 0;
  for (const document of documents) {
    const chunks = documentLoader.chunkDocument(document);
    console.log(`   Processing: ${document.chapter} (${chunks.length} chunks)`);

    // Generate embeddings for each chunk
    for (const chunk of chunks) {
      const embedding = await embeddingService.generateEmbedding(chunk.content);
      await chromaVectorStore.addVector(chunk.id, embedding, {
        ...chunk.metadata,
        content: chunk.content,
      });
      totalChunks++;
    }
  }

  console.log(`\n✅ Processed ${documents.length} documents, ${totalChunks} chunks`);
  console.log('✅ Embeddings generated and stored in ChromaDB');
}

/**
 * Full pipeline: download + process + embed
 */
async function fullPipeline() {
  console.log('🚀 Running full pipeline: Download → Process → Embed\n');

  // Step 1: Download
  console.log('📥 Step 1/3: Downloading PDFs...');
  await downloadBooks();

  console.log('\n📄 Step 2/3: Processing PDFs...');
  await processDownloadedPDFs();

  console.log('\n✅ Step 3/3: Complete!');
  await showStats();
}

/**
 * Show statistics
 */
async function showStats() {
  console.log('📊 System Statistics:\n');

  // Download stats
  const downloadStats = await ncertPDFDownloader.getStats();
  console.log('📥 Downloads:');
  console.log(`   Available: ${downloadStats.totalAvailable} books`);
  console.log(`   Downloaded: ${downloadStats.totalDownloaded} PDFs`);

  // Vector store stats
  await chromaVectorStore.initialize();
  const vectorStats = await chromaVectorStore.getStatsAsync();
  console.log('\n🔢 ChromaDB:');
  console.log(`   Total vectors: ${vectorStats.totalVectors}`);
  console.log(`   Subjects: ${vectorStats.subjects.join(', ')}`);
  console.log(`   Classes: ${vectorStats.classes.join(', ')}`);
  console.log(`   Collection: ${vectorStats.collectionName}`);
  console.log(`   Last updated: ${vectorStats.lastUpdated}`);

  console.log(`\n💡 AI Provider: ${config.aiProvider.toUpperCase()}`);
  console.log(`   Embedding model: ${config.aiProvider === 'gemini' ? config.geminiEmbeddingModel : config.embeddingModel}`);
}

/**
 * Show help
 */
function showHelp() {
  console.log('Usage: npm run ncert [command] [options]\n');
  console.log('Commands:');
  console.log('  list                  List all available NCERT books');
  console.log('  download [class|all]  Download PDFs (default: sample books)');
  console.log('  process               Process downloaded PDFs and generate embeddings');
  console.log('  full                  Run complete pipeline (download + process + embed)');
  console.log('  stats                 Show system statistics');
  console.log('  help                  Show this help message\n');
  console.log('Examples:');
  console.log('  npm run ncert list           # List all available books');
  console.log('  npm run ncert download       # Download sample books');
  console.log('  npm run ncert download 6     # Download all Class 6 books');
  console.log('  npm run ncert download all   # Download all books');
  console.log('  npm run ncert process        # Process downloaded PDFs');
  console.log('  npm run ncert full           # Run complete pipeline');
  console.log('  npm run ncert stats          # Show statistics\n');
}

// Run main function
main().catch(console.error);
