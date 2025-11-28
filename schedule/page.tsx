
'use client';

import { Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ScheduleEvent = {
  title: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  type: "Class" | "Study" | "Revision" | "Break" | "Meal" | "Commute" | "Gym" | "Sleep" | "Task" | "Lab" | "Practical" | "Meeting" | "Personal";
  description?: string;
};

type ScheduleData = {
    schedule: ScheduleEvent[];
    summary: string;
}

const eventColorMapping: { [key: string]: string } = {
  Class: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700',
  Study: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
  Revision: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700',
  Break: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600',
  Meal: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700',
  Personal: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700',
  Gym: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-700',
  Sleep: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800/50 dark:text-slate-200 dark:border-slate-600',
  Task: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700',
  Lab: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700',
  Practical: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700',
  Meeting: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-700',
  Commute: 'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-700/50 dark:text-stone-200 dark:border-stone-600',
  Custom: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600',
};


const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulePage() {
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('scheduleData');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData && Array.isArray(parsedData.schedule)) {
          setScheduleData(parsedData);
        } else {
            router.push('/category'); // Redirect if data is invalid
        }
      } catch (e) {
        console.error("Failed to parse schedule data", e);
        router.push('/category'); // Redirect if parsing fails
      }
    } else {
       router.push('/category'); // Redirect if no data found
    }
  }, [router]);
  
  if (!scheduleData) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading your schedule...</p>
        </div>
    )
  }

  const { schedule, summary } = scheduleData;
  
  // Find min and max hours to create a dynamic timeline
  const allTimes = schedule.flatMap(e => [e.startTime, e.endTime]);
  const minHour = Math.floor(Math.min(...allTimes.map(t => parseInt(t.split(':')[0], 10))));
  const maxHour = Math.ceil(Math.max(...allTimes.map(t => parseInt(t.split(':')[0], 10))));
  const startHour = Math.max(0, minHour - 1);
  const endHour = Math.min(23, maxHour + 1);
  const hourRange = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 z-20">
        <h1 className="text-md sm:text-xl font-bold font-headline">Your AI-Generated Timetable</h1>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
           <Button size="sm"><Download className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-2 sm:p-4">
        {summary && (
             <Alert className="mb-4 bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold text-primary">Optimization Summary</AlertTitle>
                <AlertDescription>
                    {summary}
                </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-x-1 sm:gap-x-2 min-w-[1200px] overflow-x-auto">
          {/* Time column */}
          <div className="grid grid-rows-[3rem_repeat(48,1rem)] text-right">
            <div/>
             {hourRange.flatMap(hour => [
                <div key={`${hour}-00`} className="text-xs text-muted-foreground pr-2 -translate-y-2 relative h-8 flex items-start justify-end">
                    <span className="absolute -top-2">{`${hour.toString().padStart(2, '0')}:00`}</span>
                </div>,
                <div key={`${hour}-30`} className="h-8"></div>
            ])}
          </div>

          {/* Day columns */}
          {daysOfWeek.map((day) => (
            <div key={day} className="relative grid grid-rows-[3rem_repeat(48,1rem)]">
              <div className="text-center font-semibold sticky top-0 bg-background py-2 text-sm sm:text-base">{day}</div>
              
              {/* Grid lines */}
              {hourRange.flatMap((_, i) => [
                <div key={`${i}-line`} className="h-8 border-b border-dashed"></div>,
                <div key={`${i}-half-line`} className="h-8 border-b border-dotted"></div>
              ])}

              {/* Events */}
              {schedule?.filter(e => e.day === day).map((event, eventIndex) => {
                 const [startHour, startMinute] = event.startTime.split(':').map(Number);
                 const [endHour, endMinute] = event.endTime.split(':').map(Number);
                 
                 const startPixel = ((startHour - startHour) * 2 + startMinute / 30) * 32;
                 const durationPixel = (((endHour + endMinute/60) - (startHour + startMinute/60)) * 2) * 32;

                return (
                    <Card
                        key={eventIndex}
                        className={cn(
                            'absolute w-[95%] left-1/2 -translate-x-1/2 p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg text-xs z-10',
                             eventColorMapping[event.type as keyof typeof eventColorMapping] || eventColorMapping.Custom
                        )}
                        style={{
                            top: `${48 + startPixel}px`, // 48px offset for header
                            height: `${durationPixel}px`,
                            minHeight: '32px'
                        }}
                        title={`${event.title} (${event.startTime} - ${event.endTime})`}
                    >
                        <p className="font-bold truncate">{event.title}</p>
                        <p className="truncate text-[10px]">{event.startTime} - {event.endTime}</p>
                        {event.description && <p className="truncate text-muted-foreground text-[10px]">{event.description}</p>}
                    </Card>
                )
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
