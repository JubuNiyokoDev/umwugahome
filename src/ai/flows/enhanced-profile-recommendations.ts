'use server';
/**
 * @fileOverview Provides AI-powered recommendations for artisans to enhance their profiles.
 *
 * - getProfileRecommendations - A function that generates profile improvement recommendations for artisans.
 * - ProfileRecommendationsInput - The input type for the getProfileRecommendations function.
 * - ProfileRecommendationsOutput - The return type for the getProfileRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileRecommendationsInputSchema = z.object({
  artisanProfile: z
    .string()
    .describe('The artisan profile, including details like skills, certifications, and product descriptions.'),
  marketTrends: z.string().describe('Current market trends in the artisan\u2019s field.'),
});
export type ProfileRecommendationsInput = z.infer<typeof ProfileRecommendationsInputSchema>;

const ProfileRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'AI-powered recommendations for improving the artisan profile, suggesting relevant skills, certifications, and product descriptions to increase visibility and attract potential customers.'
    ),
});
export type ProfileRecommendationsOutput = z.infer<typeof ProfileRecommendationsOutputSchema>;

export async function getProfileRecommendations(
  input: ProfileRecommendationsInput
): Promise<ProfileRecommendationsOutput> {
  return profileRecommendationsFlow(input);
}

const profileRecommendationsPrompt = ai.definePrompt({
  name: 'profileRecommendationsPrompt',
  input: {schema: ProfileRecommendationsInputSchema},
  output: {schema: ProfileRecommendationsOutputSchema},
  prompt: `You are an AI expert specializing in providing recommendations for artisans to improve their online profiles.

  Given the artisan's profile and current market trends, generate recommendations to increase visibility and attract potential customers.

  Artisan Profile: {{{artisanProfile}}}
  Market Trends: {{{marketTrends}}}

  Provide specific suggestions for relevant skills, certifications, and product descriptions.
  Recommendations:`, 
});

const profileRecommendationsFlow = ai.defineFlow(
  {
    name: 'profileRecommendationsFlow',
    inputSchema: ProfileRecommendationsInputSchema,
    outputSchema: ProfileRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await profileRecommendationsPrompt(input);
    return output!;
  }
);
