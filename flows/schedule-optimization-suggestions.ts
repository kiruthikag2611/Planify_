'use server';

/**
 * @fileOverview A schedule optimization AI agent.
 *
 * - suggestScheduleOptimizations - A function that handles the schedule optimization process.
 * - SuggestScheduleOptimizationsInput - The input type for the suggestScheduleOptimizations function.
 * - SuggestScheduleOptimizationsOutput - The return type for the suggestScheduleOptimizations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestScheduleOptimizationsInputSchema = z.object({
  scheduleDetails: z
    .string()
    .describe("Details of the user's current schedule, including commitments, available time slots, and preferences."),
  userCategory: z.enum(['Student', 'Professor', 'Management']).describe('The category of the user (Student, Professor, or Management).'),
});
export type SuggestScheduleOptimizationsInput = z.infer<typeof SuggestScheduleOptimizationsInputSchema>;

const SuggestScheduleOptimizationsOutputSchema = z.object({
  optimizationSuggestions: z.string().describe('A list of suggestions to optimize the schedule.'),
});
export type SuggestScheduleOptimizationsOutput = z.infer<typeof SuggestScheduleOptimizationsOutputSchema>;

export async function suggestScheduleOptimizations(input: SuggestScheduleOptimizationsInput): Promise<SuggestScheduleOptimizationsOutput> {
  return suggestScheduleOptimizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestScheduleOptimizationsPrompt',
  input: {schema: SuggestScheduleOptimizationsInputSchema},
  output: {schema: SuggestScheduleOptimizationsOutputSchema},
  prompt: `You are an expert schedule optimizer, specializing in creating efficient schedules for Students, Professors and Management.

You will use this information about their current schedule and role to generate a list of specific and actionable suggestions to optimize their schedule. The output should be a text that starts with "Suggestions:" followed by a newline, and a bulleted list of suggestions.

Schedule Details: {{{scheduleDetails}}}
User Category: {{{userCategory}}}`,
});

const suggestScheduleOptimizationsFlow = ai.defineFlow(
  {
    name: 'suggestScheduleOptimizationsFlow',
    inputSchema: SuggestScheduleOptimizationsInputSchema,
    outputSchema: SuggestScheduleOptimizationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
