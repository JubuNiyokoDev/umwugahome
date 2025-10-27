'use server';

/**
 * @fileOverview Provides personalized training suggestions for students based on their profile and interests.
 *
 * - getPersonalizedTrainingSuggestions - A function that returns personalized training suggestions.
 * - PersonalizedTrainingSuggestionsInput - The input type for the getPersonalizedTrainingSuggestions function.
 * - PersonalizedTrainingSuggestionsOutput - The return type for the getPersonalizedTrainingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTrainingSuggestionsInputSchema = z.object({
  studentProfile: z
    .string()
    .describe('The profile of the student, including their interests and background.'),
});
export type PersonalizedTrainingSuggestionsInput = z.infer<
  typeof PersonalizedTrainingSuggestionsInputSchema
>;

const TrainingSuggestionSchema = z.object({
  trainingCenterName: z.string().describe('The name of the training center.'),
  courseName: z.string().describe('The name of the course.'),
  relevanceScore: z
    .number()
    .describe('A score indicating the relevance of the course to the student.'),
  reason: z.string().describe('Reason for suggesting this course to the student.'),
});

const PersonalizedTrainingSuggestionsOutputSchema = z.array(
  TrainingSuggestionSchema
);
export type PersonalizedTrainingSuggestionsOutput = z.infer<
  typeof PersonalizedTrainingSuggestionsOutputSchema
>;

export async function getPersonalizedTrainingSuggestions(
  input: PersonalizedTrainingSuggestionsInput
): Promise<PersonalizedTrainingSuggestionsOutput> {
  return personalizedTrainingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedTrainingSuggestionsPrompt',
  input: {schema: PersonalizedTrainingSuggestionsInputSchema},
  output: {schema: PersonalizedTrainingSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized training suggestions to students.

  Based on the student's profile and interests, suggest relevant training centers and courses.

  Student Profile: {{{studentProfile}}}

  Provide a list of training suggestions, including the training center name, course name, a relevance score (0-100), and a brief explanation of why the course is a good fit for the student.
  Ensure your response is in valid JSON format.
  `,
});

const personalizedTrainingSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedTrainingSuggestionsFlow',
    inputSchema: PersonalizedTrainingSuggestionsInputSchema,
    outputSchema: PersonalizedTrainingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
