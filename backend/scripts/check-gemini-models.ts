import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not set in the .env file.');
  process.exit(1);
}

async function listAvailableModels() {
  try {
    console.log('Fetching available Gemini models...');

    const { data } = await axios.get(
      'https://generativelanguage.googleapis.com/v1beta/models',
      {
        params: { key: apiKey },
      }
    );

    const models = data.models || [];

    if (!models.length) {
      console.log('No models returned. Please double-check that the Generative Language API is enabled for your project.');
      return;
    }

    console.log('--- Models available for your API key ---');

    let foundGenerativeModel = false;

    for (const model of models) {
      const supportsGenerate = (model.supportedGenerationMethods || []).includes('generateContent');

      console.log(`\nModel Name: ${model.name}`);
      console.log(`  - Display Name: ${model.displayName || 'N/A'}`);
      console.log(`  - Description: ${(model.description || '').slice(0, 120)}${(model.description || '').length > 120 ? '...' : ''}`);
      console.log(`  - Supports "generateContent": ${supportsGenerate ? 'Yes' : 'No'}`);

      if (supportsGenerate) {
        foundGenerativeModel = true;
      }
    }

    if (!foundGenerativeModel) {
      console.log('\nNo models supporting "generateContent" found for your API key.');
      console.log('This is likely the cause of the 404 errors.');
      console.log('Please ensure the Generative Language API is enabled and your key has permission to call generateContent.');
    } else {
      console.log('\n--- Recommendation ---');
      console.log('Use one of the model names listed above that supports "generateContent" in your config file.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Request failed with status:', error.response?.status, error.response?.statusText);
      console.error('Details:', error.response?.data);
    } else {
      console.error('An unexpected error occurred while fetching the models:', error);
    }
  }
}

listAvailableModels();
