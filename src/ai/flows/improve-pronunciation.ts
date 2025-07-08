'use server';

/**
 * @fileOverview An AI agent that suggests improved pronunciations for specific words.
 *
 * - improvePronunciation - A function that suggests improved pronunciations for specific words.
 * - ImprovePronunciationInput - The input type for the improvePronunciation function.
 * - ImprovePronunciationOutput - The return type for the improvePronunciation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImprovePronunciationInputSchema = z.object({
  text: z.string().describe('The text to analyze for pronunciation improvements.'),
  word: z.string().describe('The specific word to find a pronunciation for'),
});
export type ImprovePronunciationInput = z.infer<typeof ImprovePronunciationInputSchema>;

const ImprovePronunciationOutputSchema = z.object({
  originalWord: z.string().describe('The original word submitted for pronunciation check'),
  suggestedPronunciation: z.string().describe('The suggested improved pronunciation for the word.'),
  reason: z.string().describe('Explanation of why the pronunciation was suggested.'),
});
export type ImprovePronunciationOutput = z.infer<typeof ImprovePronunciationOutputSchema>;

export async function improvePronunciation(input: ImprovePronunciationInput): Promise<ImprovePronunciationOutput> {
  return improvePronunciationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvePronunciationPrompt',
  input: {schema: ImprovePronunciationInputSchema},
  output: {schema: ImprovePronunciationOutputSchema},
  prompt: `You are an AI expert in pronunciation. A user has provided the word "{{{word}}}" as well as the text:"{{{text}}}". Does this word sound correct given the provided text? If not, suggest a better pronunciation and explain why it is better. Return the original word, the suggested pronunciation, and the reason for the change. Adhere to the JSON schema provided. Do not return anything other than JSON.`, 
});

const improvePronunciationFlow = ai.defineFlow(
  {
    name: 'improvePronunciationFlow',
    inputSchema: ImprovePronunciationInputSchema,
    outputSchema: ImprovePronunciationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
