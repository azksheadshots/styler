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
  role: z.string().describe('The user’s job role.'),
  stylePreferences:
    z.string().describe('The user’s personal style preferences.'),
});
export type SuggestClothingStylesInput = z.infer<typeof SuggestClothingStylesInputSchema>;

const SuggestClothingStylesOutputSchema = z.object({
  clothingSuggestions: z
    .string()
    .describe(
      'A list of suggested clothing styles, tailored to the user’s role and style preferences. Each suggestion should be on a new line.'
    ),
  reasoning: z.string().describe('The reasoning behind the suggested clothing styles.'),
});
export type SuggestClothingStylesOutput = z.infer<typeof SuggestClothingStylesOutputSchema>;

export async function suggestClothingStyles(
  input: SuggestClothingStylesInput
): Promise<SuggestClothingStylesOutput> {
  return suggestClothingStylesFlow(input);
}

const suggestClothingStylesFlow = ai.defineFlow(
  {
    name: 'suggestClothingStylesFlow',
    inputSchema: SuggestClothingStylesInputSchema,
    outputSchema: SuggestClothingStylesOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: `You are a professional stylist helping a user choose the best clothing for their headshot.

      Based on the user's role and personal style preferences, suggest a list of clothing items appropriate for a professional headshot. Provide reasoning for your suggestions.

      Role: ${input.role}
      Style Preferences: ${input.stylePreferences}

      For the 'clothingSuggestions' field, respond with a list of items. Each item must be on a new line. Do not use any special formatting like bullet points, numbers, or asterisks.
      For the 'reasoning' field, provide a brief explanation for your choices.`,
      output: { schema: SuggestClothingStylesOutputSchema },
    });
    return output!;
  }
);
