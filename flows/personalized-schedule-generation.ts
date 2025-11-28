
'use server';

/**
 * @fileOverview A personalized schedule generation AI agent.
 *
 * - generatePersonalizedSchedule - A function that handles the generation of a personalized schedule.
 * - PersonalizedScheduleGenerationInput - The input type for the generatePersonalizedSchedule function.
 * - PersonalizedScheduleGenerationOutput - The return type for the generatePersonalizedSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentInputSchema = z.object({
  role: z.literal('Student'),
  classInfo: z.string().describe('The student\'s class, year, or semester.'),
  subjects: z.string().describe('A comma-separated list of subjects the student is taking.'),
  hoursPerSubject: z.string().describe('The number of hours the student wants to dedicate to each subject per week.'),
  studyTime: z.string().describe('The student\'s preferred study time (e.g., morning, afternoon, evening, night).'),
  availability: z.string().describe('The student\'s available days and time slots for studying.'),
  breakPreferences: z.string().describe('The student\'s preferred break duration and frequency (e.g., 15 mins every hour).'),
  prioritySubjects: z.string().describe('A list of subjects prioritized as high, medium, or low.'),
  deadlines: z.string().describe('Information about upcoming exams or assignment deadlines.'),
  routines: z.string().describe('Information about the student\'s additional routines like sleep schedule, meal times, commute, gym, etc.'),
});

const TeacherInputSchema = z.object({
  role: z.literal('Teacher'),
  subjects: z.string().describe('A comma-separated list of subjects the teacher teaches.'),
  weeklyClasses: z.string().describe('The number of weekly classes for each subject.'),
  classNames: z.string().describe('The names of the classes or sections the teacher handles (e.g., 10A, 10B).'),
  availability: z.string().describe('The teacher\'s available days and time slots for teaching.'),
  teachingHours: z.string().describe('The teacher\'s preferred teaching hours.'),
  restrictedHours: z.string().describe('Time slots that are restricted due to meetings, duties, or breaks.'),
  maxClassesPerDay: z.string().describe('The maximum number of classes the teacher can handle in a single day.'),
  minGap: z.string().describe('The minimum gap required between consecutive classes.'),
  specialSessions: z.string().describe('Information about any special sessions like labs, practicals, or extra classes.'),
});

const PersonalizedScheduleGenerationInputSchema = z.union([
  StudentInputSchema,
  TeacherInputSchema,
]);

export type PersonalizedScheduleGenerationInput = z.infer<typeof PersonalizedScheduleGenerationInputSchema>;

const ScheduleEventSchema = z.object({
  title: z.string(),
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  type: z.enum(["Class", "Study", "Revision", "Break", "Meal", "Commute", "Gym", "Sleep", "Task", "Lab", "Practical", "Meeting", "Personal"]),
  description: z.string().optional().describe('A brief description of the event.'),
});

const PersonalizedScheduleGenerationOutputSchema = z.object({
  schedule: z.array(ScheduleEventSchema).describe('An array of events for the generated personalized schedule.'),
  summary: z.string().describe('A short explanation of why the generated timetable is optimized for the user.'),
});

export type PersonalizedScheduleGenerationOutput = z.infer<typeof PersonalizedScheduleGenerationOutputSchema>;

export async function generatePersonalizedSchedule(
  input: PersonalizedScheduleGenerationInput
): Promise<PersonalizedScheduleGenerationOutput> {
  const result = await personalizedScheduleGenerationFlow(input);
  // Ensure the output matches the schema, especially the event types
  if (result.schedule) {
    const validTypes = ["Class", "Study", "Revision", "Break", "Meal", "Commute", "Gym", "Sleep", "Task", "Lab", "Practical", "Meeting", "Personal"];
    result.schedule.forEach(event => {
      if (!validTypes.includes(event.type)) {
        event.type = "Task"; // Default to a generic type if invalid
      }
    });
  }
  return result;
}

const prompt = ai.definePrompt({
  name: 'personalizedScheduleGenerationPrompt',
  input: {schema: PersonalizedScheduleGenerationInputSchema},
  output: {schema: PersonalizedScheduleGenerationOutputSchema},
  prompt: `You are an expert AI Timetable Generator for the Planify App. Your job is to create a perfect, optimized weekly timetable based on the user's role and their answers to a series of questions.

  **User Information:**
  Role: {{{role}}}

  {{#eq role "Student"}}
  Class/Year/Semester: {{{classInfo}}}
  Subjects: {{{subjects}}}
  Hours per Subject per Week: {{{hoursPerSubject}}}
  Preferred Study Time: {{{studyTime}}}
  Availability: {{{availability}}}
  Break Preferences: {{{breakPreferences}}}
  Priority Subjects: {{{prioritySubjects}}}
  Upcoming Exams/Deadlines: {{{deadlines}}}
  Additional Routines: {{{routines}}}
  {{/eq}}

  {{#eq role "Teacher"}}
  Subjects Taught: {{{subjects}}}
  Weekly Classes per Subject: {{{weeklyClasses}}}
  Class/Section Names: {{{classNames}}}
  Availability: {{{availability}}}
  Preferred Teaching Hours: {{{teachingHours}}}
  Restricted Hours: {{{restrictedHours}}}
  Maximum Classes per Day: {{{maxClassesPerDay}}}
  Minimum Gap Between Classes: {{{minGap}}}
  Special Sessions (Labs, etc.): {{{specialSessions}}}
  {{/eq}}

  **Timetable Generation Rules:**

  **General (For Both Roles):**
  - **No Overlapping:** Ensure no two events are scheduled at the same time.
  - **Balanced Workload:** Distribute tasks and classes evenly throughout the week.
  - **Avoid Burnout:** Do not schedule too many heavy or demanding sessions back-to-back.
  - **Breaks:** Incorporate breaks every 1-2 hours. Use the user's break preferences.
  - **Respect Preferences:** Strictly adhere to the user's specified availability, preferred times, and restricted hours.
  - **Creative Filling:** Creatively and logically fill the entire week from Monday to Sunday, including routines like meals, sleep, and commute, based on the user's input. Generate at least 20-30 events for a full week schedule.
  - **Event Types**: Use a variety of event types from the allowed enum list: "Class", "Study", "Revision", "Break", "Meal", "Commute", "Gym", "Sleep", "Task", "Lab", "Practical", "Meeting", "Personal".

  **For Students:**
  - **Prioritize Subjects:** Schedule high-priority or difficult subjects during the user's preferred high-focus study times.
  - **Revision Blocks:** Include specific time slots for revision, especially for subjects with upcoming exams.
  - **Lighter Weekends:** Keep weekends relatively light unless exams are near, focusing on revision or personal time.

  **For Teachers:**
  - **Limit Continuous Classes:** Avoid scheduling more than 2-3 classes consecutively without a break.
  - **Even Distribution:** Distribute classes for various subjects and sections evenly across the week.
  - **Long Slots:** Schedule special sessions like labs or practicals in longer, uninterrupted time blocks.

  **Final Output:**
  1.  Generate a \`schedule\` array containing all the events for the week in a clean, structured format.
  2.  Write a concise \`summary\` explaining *why* the generated timetable is optimized for the user, highlighting how you've used their preferences and balanced their workload.
  `,
});

const personalizedScheduleGenerationFlow = ai.defineFlow(
  {
    name: 'personalizedScheduleGenerationFlow',
    inputSchema: PersonalizedScheduleGenerationInputSchema,
    outputSchema: PersonalizedScheduleGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate schedule from AI prompt.");
    }
    return output;
  }
);
