
export type Question = {
  id: string;
  question: string;
  description?: string;
  placeholder?: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'radio';
  options?: { value: string; label: string; description?: string }[];
};

type QuestionSet = {
  [key: string]: {
    [key: string]: Question[];
  };
};

export const questions: QuestionSet = {
  academics: {
    student: [
      { id: 'classInfo', question: 'What is your Class/Year/Semester?', type: 'text', placeholder: 'e.g., 2nd Year, Computer Science' },
      { id: 'subjects', question: 'List your subjects.', type: 'textarea', placeholder: 'e.g., Math, Physics, History' },
      { id: 'hoursPerSubject', question: 'How many hours do you want to study per subject, per week?', type: 'text', placeholder: 'e.g., Math: 5 hours, Physics: 4 hours' },
      { id: 'studyTime', question: 'When are you most focused?', type: 'radio',
        options: [
            { value: 'early-morning', label: 'Early Morning', description: 'The early bird catches the worm!' },
            { value: 'morning', label: 'Morning', description: 'Fresh and ready to go.' },
            { value: 'afternoon', label: 'Afternoon', description: 'Power through the day.' },
            { value: 'evening', label: 'Evening/Night', description: 'A quiet time for focus.' },
        ]
      },
      { id: 'availability', question: 'What are your fixed commitments?', type: 'textarea', description: "List times you're busy (e.g., Classes on Mon 10-12, Part-time job Tue/Thu 5-8 PM)." },
      { id: 'breakPreferences', question: 'How do you like to take breaks?', type: 'text', placeholder: 'e.g., 15 mins every hour' },
      { id: 'prioritySubjects', question: 'Which subjects are your top priority?', type: 'textarea', placeholder: 'List subjects you find difficult or have exams for soon.' },
      { id: 'deadlines', question: 'Any upcoming exams or assignment deadlines?', type: 'text', placeholder: 'e.g., Physics midterm next Friday' },
      { id: 'routines', question: 'Describe your other routines.', type: 'textarea', description: "Tell us about your sleep schedule, meals, commute, gym, etc.", placeholder: 'e.g., Wake up at 7 AM, Gym Mon/Wed/Fri 6-7 PM' },
    ],
    teacher: [
      { id: 'subjects', question: 'What subjects do you teach?', type: 'textarea', placeholder: 'e.g., Chemistry, Literature' },
      { id: 'weeklyClasses', question: 'How many weekly classes do you have for each subject?', type: 'text', placeholder: 'e.g., Chemistry: 4, Literature: 3' },
      { id: 'classNames', question: 'What are the Class/Section names?', type: 'text', placeholder: 'e.g., 10A, 10B, 11-Science' },
      { id: 'availability', question: 'What are your available days and time slots for teaching?', type: 'textarea', placeholder: 'e.g., Mon-Fri 9 AM to 5 PM, except Wed afternoon' },
      { id: 'teachingHours', question: 'What are your preferred teaching hours?', type: 'text', placeholder: 'e.g., Mornings are best' },
      { id: 'restrictedHours', question: 'Do you have any restricted hours?', type: 'text', placeholder: 'e.g., Staff meetings every Friday at 3 PM' },
      { id: 'maxClassesPerDay', question: 'What is the maximum number of classes you can take in a day?', type: 'number', placeholder: 'e.g., 4' },
      { id: 'minGap', question: 'What is the minimum gap you need between classes?', type: 'text', placeholder: 'e.g., 30 minutes' },
      { id: 'specialSessions', question: 'Any special sessions like labs or practicals?', type: 'text', placeholder: 'e.g., Chemistry Lab on Tuesdays, 2-4 PM' },
    ],
  },
};
