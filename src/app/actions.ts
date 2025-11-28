
'use server';

import { generatePersonalizedSchedule, PersonalizedScheduleGenerationInput, PersonalizedScheduleGenerationOutput } from '@/ai/flows/personalized-schedule-generation';
import { suggestScheduleOptimizations, SuggestScheduleOptimizationsInput } from '@/ai/flows/schedule-optimization-suggestions';

export async function createSchedule(data: any) {
  if (!data || !data.role) {
     return { success: false, error: 'Invalid input data. Role is missing.' };
  }
  try {
    const result = await generatePersonalizedSchedule(data as PersonalizedScheduleGenerationInput);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating schedule:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate schedule: ${errorMessage}` };
  }
}

export async function optimizeSchedule(data: SuggestScheduleOptimizationsInput) {
  try {
    const result = await suggestScheduleOptimizations(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error optimizing schedule:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to optimize schedule: ${errorMessage}` };
  }
}
