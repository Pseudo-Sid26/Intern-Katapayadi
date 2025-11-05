// Document Loader and Chunker for NCERT Content
import { NCERTDocument, DocumentChunk } from './types';

class DocumentLoader {
  /**
   * Chunk a document into smaller pieces for embedding
   */
  chunkDocument(
    document: NCERTDocument,
    chunkSize: number = 500,
    overlap: number = 50
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const content = document.content;
    let startIndex = 0;
    let chunkIndex = 0;

    while (startIndex < content.length) {
      const endIndex = Math.min(startIndex + chunkSize, content.length);
      const chunkContent = content.slice(startIndex, endIndex);

      chunks.push({
        id: `${document.id}-chunk-${chunkIndex}`,
        documentId: document.id,
        content: chunkContent.trim(),
        metadata: {
          ...document.metadata,
          subject: document.subject,
          class: document.class,
        },
      });

      startIndex += chunkSize - overlap;
      chunkIndex++;
    }

    return chunks;
  }

  /**
   * Load sample NCERT content (for demonstration)
   * In production, this would load from PDFs or a database
   */
  async loadSampleDocuments(): Promise<NCERTDocument[]> {
    return [
      // Mathematics samples
      {
        id: 'math-class5-ch1',
        subject: 'maths',
        class: 5,
        chapter: 'Chapter 1: Numbers',
        content: `
          Understanding Large Numbers
          
          We use numbers every day - to count, measure, and calculate. In this chapter, we will learn about large numbers and how to work with them.
          
          Place Value System:
          Our number system is based on place value. The place or position of a digit in a number determines its value. For example, in the number 5,432:
          - 5 is in the thousands place (5 × 1000 = 5000)
          - 4 is in the hundreds place (4 × 100 = 400)
          - 3 is in the tens place (3 × 10 = 30)
          - 2 is in the ones place (2 × 1 = 2)
          
          Reading Numbers:
          To read large numbers, we group digits in threes from right to left. These groups are called periods: Ones, Thousands, Lakhs, Crores.
          
          Example: 5,43,21,456 is read as "Five crore, forty-three lakh, twenty-one thousand, four hundred fifty-six"
          
          Comparing Numbers:
          To compare two numbers, we start comparing from the leftmost digit. The number with more digits is greater.
          
          Roman Numerals:
          Romans used letters to write numbers. I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000
        `,
        metadata: {
          title: 'Understanding Large Numbers',
          pageNumber: 1,
          section: 'Place Value and Number System',
        },
      },
      {
        id: 'math-class6-ch2',
        subject: 'maths',
        class: 6,
        chapter: 'Chapter 2: Fractions',
        content: `
          Introduction to Fractions
          
          A fraction represents a part of a whole. When we divide a whole into equal parts, each part is called a fraction.
          
          Parts of a Fraction:
          - Numerator: The top number showing how many parts we have
          - Denominator: The bottom number showing total equal parts
          
          Types of Fractions:
          1. Proper Fraction: Numerator < Denominator (e.g., 3/4, 2/5)
          2. Improper Fraction: Numerator ≥ Denominator (e.g., 5/4, 7/3)
          3. Mixed Fraction: A whole number and a proper fraction (e.g., 2 1/2, 3 2/3)
          
          Equivalent Fractions:
          Fractions that represent the same value are called equivalent fractions.
          Example: 1/2 = 2/4 = 3/6 = 4/8
          
          To find equivalent fractions, multiply or divide both numerator and denominator by the same number.
          
          Simplifying Fractions:
          To simplify a fraction, divide both numerator and denominator by their HCF (Highest Common Factor).
          Example: 8/12 = (8÷4)/(12÷4) = 2/3
          
          Adding Fractions:
          To add fractions with the same denominator, add the numerators and keep the denominator same.
          Example: 2/7 + 3/7 = (2+3)/7 = 5/7
        `,
        metadata: {
          title: 'Introduction to Fractions',
          pageNumber: 15,
          section: 'Understanding Fractions',
        },
      },
      // Science samples
      {
        id: 'science-class7-ch1',
        subject: 'science',
        class: 7,
        chapter: 'Chapter 1: Nutrition in Plants',
        content: `
          Nutrition in Plants - Photosynthesis
          
          All living organisms need food to survive. Plants make their own food through a process called photosynthesis.
          
          What is Photosynthesis?
          Photosynthesis is the process by which green plants make food using sunlight, water, and carbon dioxide.
          
          The Process:
          6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
          (Carbon dioxide + Water + Light energy → Glucose + Oxygen)
          
          Requirements for Photosynthesis:
          1. Chlorophyll: The green pigment in leaves that captures sunlight
          2. Sunlight: Provides energy for the process
          3. Carbon Dioxide: Taken from air through stomata
          4. Water: Absorbed by roots from soil
          
          Where does it happen?
          Photosynthesis mainly occurs in leaves. Leaves are green because of chlorophyll present in chloroplasts.
          
          Products of Photosynthesis:
          1. Glucose: Used by plant for energy and growth, excess stored as starch
          2. Oxygen: Released into air through stomata
          
          Importance:
          - Plants are called producers as they produce food
          - All animals depend on plants directly or indirectly for food
          - Oxygen released is essential for respiration
        `,
        metadata: {
          title: 'Nutrition in Plants',
          pageNumber: 1,
          section: 'Photosynthesis',
        },
      },
      {
        id: 'science-class8-ch2',
        subject: 'science',
        class: 8,
        chapter: 'Chapter 2: Force and Pressure',
        content: `
          Understanding Force and Pressure
          
          Force:
          A force is a push or pull that can change the state of motion or shape of an object.
          
          Effects of Force:
          1. Can make a stationary object move
          2. Can stop a moving object
          3. Can change the speed of a moving object
          4. Can change the direction of a moving object
          5. Can change the shape and size of an object
          
          Types of Forces:
          1. Contact Forces: Forces that act only when objects are in contact
             - Muscular Force: Force applied by muscles
             - Frictional Force: Force that opposes motion
          
          2. Non-Contact Forces: Forces that act from a distance
             - Magnetic Force: Force exerted by magnets
             - Electrostatic Force: Force between charged objects
             - Gravitational Force: Force of attraction between objects with mass
          
          Pressure:
          Pressure is the force acting on a unit area of a surface.
          Pressure = Force / Area
          
          Unit: Pascal (Pa) or Newton per square meter (N/m²)
          
          Key Points:
          - Same force acting on smaller area produces more pressure
          - Nails are pointed to increase pressure for easy penetration
          - Broad straps of school bags reduce pressure on shoulders
          
          Atmospheric Pressure:
          The pressure exerted by the atmosphere on Earth's surface due to the weight of air above.
        `,
        metadata: {
          title: 'Force and Pressure',
          pageNumber: 20,
          section: 'Understanding Forces',
        },
      },
      // History samples
      {
        id: 'history-class7-ch1',
        subject: 'history',
        class: 7,
        chapter: 'Chapter 1: Medieval India',
        content: `
          The Medieval Period in India
          
          The medieval period in Indian history spans from around 8th century CE to 18th century CE.
          
          Important Dynasties:
          
          1. Delhi Sultanate (1206-1526):
          - Founded by Qutub-ud-din Aibak
          - Five dynasties ruled: Slave, Khilji, Tughlaq, Sayyid, and Lodi
          - Built many monuments including Qutub Minar
          - Introduced new administrative systems
          
          2. Mughal Empire (1526-1857):
          - Founded by Babur after defeating Ibrahim Lodi in 1526
          - Greatest emperor: Akbar the Great
          - Known for art, architecture, and cultural synthesis
          - Built Taj Mahal, Red Fort, Fatehpur Sikri
          
          Administration:
          Medieval rulers developed sophisticated administrative systems:
          - Land revenue system (important source of income)
          - Military organization
          - Justice system with qazis (judges)
          
          Cultural Developments:
          - Persian became court language
          - Development of Indo-Islamic architecture
          - Growth of regional languages and literature
          - Bhakti and Sufi movements promoted harmony
          
          Society:
          - Feudal system with nobles and peasants
          - Craftsmen organized in guilds
          - Trade flourished both inland and overseas
        `,
        metadata: {
          title: 'Medieval India',
          pageNumber: 1,
          section: 'Introduction to Medieval Period',
        },
      },
      // Geography samples
      {
        id: 'geography-class9-ch1',
        subject: 'geography',
        class: 9,
        chapter: 'Chapter 1: India - Size and Location',
        content: `
          India: Size and Location
          
          Location:
          India is located in the Northern Hemisphere. The mainland extends between latitudes 8°4'N and 37°6'N and longitudes 68°7'E and 97°25'E.
          
          Size:
          - Total area: 3.28 million square kilometers
          - 7th largest country in the world
          - Land boundary: 15,200 km
          - Coastline: 7,516.6 km (including islands)
          
          Neighboring Countries:
          - Northwest: Pakistan and Afghanistan
          - North: China, Nepal, and Bhutan
          - East: Myanmar and Bangladesh
          - Island neighbors: Sri Lanka and Maldives
          
          Strategic Location:
          - Located between East and West Asia
          - Central position in Indian Ocean
          - Historic trade routes passed through India
          - Deccan Peninsula protrudes into Indian Ocean
          
          Time Zone:
          - Indian Standard Time (IST) = GMT + 5:30
          - 82°30'E longitude is the standard meridian
          
          Physical Features:
          1. The Himalayan Mountains in the North
          2. The Northern Plains
          3. The Peninsular Plateau
          4. The Coastal Plains
          5. The Islands (Andaman & Nicobar, Lakshadweep)
          
          Importance of Location:
          - Controls Indian Ocean routes
          - Strategic position for trade
          - Influenced by both southwest and northeast monsoons
        `,
        metadata: {
          title: 'India - Size and Location',
          pageNumber: 1,
          section: 'Location and Extent',
        },
      },
      // English samples
      {
        id: 'english-class6-ch1',
        subject: 'english',
        class: 6,
        chapter: 'Chapter 1: Grammar Basics',
        content: `
          Parts of Speech
          
          Words in English can be classified into eight parts of speech based on their function:
          
          1. Noun:
          A noun is a naming word. It names a person, place, thing, or idea.
          Types: Proper noun, Common noun, Collective noun, Abstract noun
          Examples: Ravi, city, book, happiness
          
          2. Pronoun:
          A pronoun replaces a noun.
          Examples: he, she, it, they, we, you, I
          
          3. Verb:
          A verb shows action or state of being.
          Examples: run, eat, is, was, have
          
          4. Adjective:
          An adjective describes a noun or pronoun.
          Examples: beautiful, tall, blue, five
          
          5. Adverb:
          An adverb describes a verb, adjective, or another adverb.
          Examples: quickly, very, here, now
          
          6. Preposition:
          A preposition shows relationship between noun/pronoun and other words.
          Examples: in, on, at, by, with, from, to
          
          7. Conjunction:
          A conjunction joins words or groups of words.
          Examples: and, but, or, because, although
          
          8. Interjection:
          An interjection expresses sudden feeling or emotion.
          Examples: Oh! Wow! Alas! Hurray!
          
          Sentence Structure:
          A sentence must have:
          - Subject (who or what the sentence is about)
          - Predicate (what is said about the subject)
          
          Example: The cat (subject) sat on the mat (predicate).
        `,
        metadata: {
          title: 'Grammar Basics',
          pageNumber: 1,
          section: 'Parts of Speech',
        },
      },
    ];
  }

  /**
   * Initialize vector store with sample documents
   */
  async initializeVectorStore() {
    const documents = await this.loadSampleDocuments();
    const allChunks: DocumentChunk[] = [];

    for (const doc of documents) {
      const chunks = this.chunkDocument(doc);
      allChunks.push(...chunks);
    }

    return allChunks;
  }
}

export const documentLoader = new DocumentLoader();
