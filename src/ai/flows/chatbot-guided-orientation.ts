'use server';

/**
 * @fileOverview Provides personalized guidance to new users via a Gemini-powered chatbot.
 *
 * - chatbotGuidedOrientation - A function that provides personalized guidance to new users.
 * - ChatbotGuidedOrientationInput - The input type for the chatbotGuidedOrientation function.
 * - ChatbotGuidedOrientationOutput - The return type for the chatbotGuidedOrientation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotGuidedOrientationInputSchema = z.object({
  query: z.string().describe('The user query or question for the chatbot.'),
});
export type ChatbotGuidedOrientationInput = z.infer<typeof ChatbotGuidedOrientationInputSchema>;

const ChatbotGuidedOrientationOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type ChatbotGuidedOrientationOutput = z.infer<typeof ChatbotGuidedOrientationOutputSchema>;

export async function chatbotGuidedOrientation(input: ChatbotGuidedOrientationInput): Promise<ChatbotGuidedOrientationOutput> {
  return chatbotGuidedOrientationFlow(input);
}

const chatbotGuidedOrientationPrompt = ai.definePrompt({
  name: 'chatbotGuidedOrientationPrompt',
  input: {schema: ChatbotGuidedOrientationInputSchema},
  output: {schema: ChatbotGuidedOrientationOutputSchema},
  prompt: `You are a helpful chatbot on the UmwugaHome platform, designed to guide new users.

  Your goal is to help users discover relevant artisan profiles, training programs, and market opportunities based on their interests and skills.

  Respond to the following user query:
  {{query}}

  Be concise and helpful.
  If the query is not related to the platform, politely indicate that you can only answer questions about UmwugaHome.
  `,
});

const chatbotGuidedOrientationFlow = ai.defineFlow(
  {
    name: 'chatbotGuidedOrientationFlow',
    inputSchema: ChatbotGuidedOrientationInputSchema,
    outputSchema: ChatbotGuidedOrientationOutputSchema,
  },
  async input => {
    const {output} = await chatbotGuidedOrientationPrompt(input);
    return output!;
  }
);
