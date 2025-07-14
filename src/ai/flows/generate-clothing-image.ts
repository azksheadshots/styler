'use server';
/**
 * @fileOverview Flow for generating an image of a clothing item.
 *
 * - generateClothingImage - A function that generates an image based on a clothing description.
 * - GenerateClothingImageInput - The input type for the generateClothingImage function.
 * - GenerateClothingImageOutput - The return type for the generateClothingImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClothingImageInputSchema = z.object({
  clothingDescription: z.string().describe('A description of a clothing item to generate an image for.'),
});
export type GenerateClothingImageInput = z.infer<typeof GenerateClothingImageInputSchema>;

const GenerateClothingImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateClothingImageOutput = z.infer<typeof GenerateClothingImageOutputSchema>;

export async function generateClothingImage(
  input: GenerateClothingImageInput
): Promise<GenerateClothingImageOutput> {
  return generateClothingImageFlow(input);
}

const generateClothingImageFlow = ai.defineFlow(
  {
    name: 'generateClothingImageFlow',
    inputSchema: GenerateClothingImageInputSchema,
    outputSchema: GenerateClothingImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a high-quality, photorealistic image of the following clothing item, suitable for a professional headshot style board. The item should be displayed on a mannequin or as a flat lay on a neutral background: ${input.clothingDescription}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed.');
    }
    
    return {
      imageUrl: media.url,
    };
  }
);
