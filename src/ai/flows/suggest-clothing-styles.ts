'use server';

/**
 * @fileOverview An AI agent to suggest clothing styles for professional headshots based on user inputs.
 *
 * - suggestClothingStyles - A function that suggests clothing styles based on role and style preferences.
 * - SuggestClothingStylesInput - The input type for the suggestClothingStyles function.
 * - SuggestClothingStylesOutput - The return type for the suggestClothingStyles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestClothingStylesInputSchema = z.object({
  role: z.string().describe('The user’s job role (e.g., software engineer, manager, designer).'),
  stylePreferences:
    z.string().describe('The user’s personal style preferences (e.g., modern, classic, casual).'),
});
export type SuggestClothingStylesInput = z.infer<typeof SuggestClothingStylesInputSchema>;

const SuggestClothingStylesOutputSchema = z.object({
  clothingSuggestions: z
    .string()
    .describe(
      'A list of suggested clothing styles, tailored to the user’s role and style preferences.'
    ),
  reasoning: z.string().describe('The reasoning behind the suggested clothing styles.'),
});
export type SuggestClothingStylesOutput = z.infer<typeof SuggestClothingStylesOutputSchema>;

export async function suggestClothingStyles(
  input: SuggestClothingStylesInput
): Promise<SuggestClothingStylesOutput> {
  return suggestClothingStylesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestClothingStylesPrompt',
  input: {schema: SuggestClothingStylesInputSchema},
  output: {schema: SuggestClothingStylesOutputSchema},
  prompt: `You are a professional stylist helping users choose the best clothing for their headshots.

Based on the user's role and personal style preferences, suggest clothing styles appropriate for a professional headshot. Provide reasoning for your suggestions.

Role: {{{role}}}
Style Preferences: {{{stylePreferences}}}

Respond with clothing suggestions and reasoning.
`,
});

const suggestClothingStylesFlow = ai.defineFlow(
  {
    name: 'suggestClothingStylesFlow',
    inputSchema: SuggestClothingStylesInputSchema,
    outputSchema: SuggestClothingStylesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
