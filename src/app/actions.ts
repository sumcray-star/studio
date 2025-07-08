"use server";

import {
  improvePronunciation,
  type ImprovePronunciationInput,
  type ImprovePronunciationOutput,
} from "@/ai/flows/improve-pronunciation";
import { z } from "zod";

const ImprovePronunciationInputSchema = z.object({
  text: z.string(),
  word: z.string(),
});

export async function checkPronunciation(
  input: ImprovePronunciationInput
): Promise<ImprovePronunciationOutput> {
  const parsedInput = ImprovePronunciationInputSchema.parse(input);
  try {
    const result = await improvePronunciation(parsedInput);
    return result;
  } catch (error) {
    console.error("Error in checkPronunciation action:", error);
    throw new Error("Failed to get pronunciation suggestion from AI.");
  }
}
