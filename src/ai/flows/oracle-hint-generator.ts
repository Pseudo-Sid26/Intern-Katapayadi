'use server';

/**
 * @fileOverview An AI agent that generates Oracle hints for Katapayadi puzzles.
 *
 * - generateOracleHint - A function that generates a riddle or trivia question related to the solution of a given Katapayadi puzzle.
 * - GenerateOracleHintInput - The input type for the generateOracleHint function.
 * - GenerateOracleHintOutput - The return type for the generateOracleHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOracleHintInputSchema = z.object({
  puzzleSolution: z
    .string()
    .describe('The solution to the Katapayadi puzzle.'),
});
export type GenerateOracleHintInput = z.infer<typeof GenerateOracleHintInputSchema>;

const GenerateOracleHintOutputSchema = z.object({
  hint: z
    .string()
    .describe(
      'A riddle or trivia question related to the solution of the Katapayadi puzzle.'
    ),
});
export type GenerateOracleHintOutput = z.infer<typeof GenerateOracleHintOutputSchema>;

export async function generateOracleHint(
  input: GenerateOracleHintInput
): Promise<GenerateOracleHintOutput> {
  return generateOracleHintFlow(input);
}

const oracleHintPrompt = ai.definePrompt({
  name: 'oracleHintPrompt',
  input: {schema: GenerateOracleHintInputSchema},
  output: {schema: GenerateOracleHintOutputSchema},
  prompt: `You are the Oracle of Indi-Puzzler, a wise and enigmatic figure who provides hints to players stuck on Katapayadi puzzles. Instead of giving direct answers, you offer riddles or trivia questions related to the solution. The goal is to nudge players in the right direction without spoiling the challenge.

  Here is the solution to the puzzle: {{{puzzleSolution}}}

  Generate a single riddle or trivia question that is related to the solution. Make the question interesting and engaging.
  `,
});

const generateOracleHintFlow = ai.defineFlow(
  {
    name: 'generateOracleHintFlow',
    inputSchema: GenerateOracleHintInputSchema,
    outputSchema: GenerateOracleHintOutputSchema,
  },
  async input => {
    const {output} = await oracleHintPrompt(input);
    return output!;
  }
);
