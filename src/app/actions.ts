"use server";

import { improveSuggestionsWithFeedback, ImproveSuggestionsWithFeedbackInput } from "@/ai/flows/improve-suggestions-with-feedback";
import { suggestClothingStyles, SuggestClothingStylesInput, SuggestClothingStylesOutput } from "@/ai/flows/suggest-clothing-styles";

export async function handleStyleSuggestion(input: SuggestClothingStylesInput): Promise<SuggestClothingStylesOutput | null> {
  try {
    const result = await suggestClothingStyles(input);
    return result;
  } catch (error) {
    console.error("Error in handleStyleSuggestion:", error);
    return null;
  }
}

export async function handleFeedback(input: ImproveSuggestionsWithFeedbackInput): Promise<{ success: boolean }> {
  try {
    await improveSuggestionsWithFeedback(input);
    return { success: true };
  } catch (error) {
    console.error("Error in handleFeedback:", error);
    return { success: false };
  }
}
