export type CalendarEvent = {
  eventId: string,
  userId: string,

  title: string,
  type: "Class" | "Assignment" | "Exam" | "Task" | "Personal" | "Study Time" | "Custom",
  description?: string,

  date: string, // "YYYY-MM-DD"
  startTime: string, // "HH:MM"
  endTime: string, // "HH:MM"

  subject?: string,
  teacher?: string,
  room?: string,

  priority: "low" | "medium" | "high",
  difficultyLevel: "easy" | "moderate" | "hard",

  notificationEnabled: boolean,
  reminderTime: "none" | "10min" | "30min" | "1hr" | "1day" | "custom",

  createdAt: any, // Firestore Timestamp
  updatedAt: any, // Firestore Timestamp
};
