import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not set in the .env file.');
  process.exit(1);
}

async function run() {
  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const result = await model.generateContent([
      'You are a diagnostic bot. Reply with a short phrase "Gemini 2.5 Pro OK" if this message is received.'
    ]);

    console.log('Model response:', result.response.text());
  } catch (error) {
    console.error('Error invoking Gemini model:', error);
  }
}

run();
