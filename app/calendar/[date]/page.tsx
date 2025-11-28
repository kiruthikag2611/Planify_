
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parse, startOfDay, addHours } from 'date-fns';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { EventForm } from '@/components/calendar/EventForm';

const eventColorMapping: { [key: string]: string } = {
  Class: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700',
  Assignment: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-700',
  Exam: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700',
  Task: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-700',
  'Study Time': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
  Personal: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700',
  Custom: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600',
  Study: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700',
  Revision: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-700',
  Break: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600',
  Meal: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700',
  Gym: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-700',
  Sleep: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800/50 dark:text-slate-200 dark:border-slate-600',
  Lab: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700',
  Practical: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:border-cyan-700',
  Meeting: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-700',
  Commute: 'bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-700/50 dark:text-stone-200 dark:border-stone-600',
};


export default function DailyTimetablePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);

  const dateParam = Array.isArray(params.date) ? params.date[0] : params.date;
  const selectedDate = parse(dateParam, 'yyyy-MM-dd', new Date());

  const eventsQuery = React.useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'calendarEvents'),
      where('userId', '==', user.uid),
      where('date', '==', format(selectedDate, 'yyyy-MM-dd'))
    );
  }, [user, firestore, selectedDate]);

  const { data: events } = useCollection<CalendarEvent>(eventsQuery);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };
  
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsSheetOpen(true);
  }

  const getEventStyle = (event: CalendarEvent) => {
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    
    const top = (startHour + startMinute / 60) * 60; // 60px per hour
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 60;

    return {
        top: `${top}px`,
        height: `${Math.max(30, height)}px`, // min height
    };
  };

  return (
    <div className="flex flex-col h-screen">
       <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-background/95 z-10">
         <Button variant="ghost" size="icon" onClick={() => router.push('/calendar')}>
           <ArrowLeft className="h-5 w-5" />
         </Button>
         <h2 className="text-lg sm:text-xl font-bold text-center">
           {format(selectedDate, 'EEEE, MMMM d')}
         </h2>
         <div className="w-8"></div>
       </header>

      <ScrollArea className="flex-1">
        <div className="relative p-2 sm:p-4 min-h-[1440px]"> {/* 24 * 60 */}
          {hours.map(hour => (
            <div key={hour} className="relative h-[60px] border-t border-dashed">
              <span className="absolute -top-3 left-0 text-xs text-muted-foreground">
                {format(addHours(startOfDay(selectedDate), hour), 'ha')}
              </span>
            </div>
          ))}
          
          {events?.map(event => (
             <Card 
                key={event.eventId} 
                className={cn('absolute w-[calc(100%-3.5rem)] sm:w-[calc(100%-4rem)] left-10 sm:left-12 p-2 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg', eventColorMapping[event.type] || eventColorMapping.Custom)}
                style={getEventStyle(event)}
                onClick={() => handleEventClick(event)}
             >
                <p className="font-bold text-xs sm:text-sm truncate">{event.title}</p>
                <p className="text-[10px] sm:text-xs truncate">{event.startTime} - {event.endTime}</p>
                {event.description && <p className="text-[10px] sm:text-xs truncate text-muted-foreground">{event.description}</p>}
             </Card>
          ))}
        </div>
      </ScrollArea>
      
      <footer className="p-2 border-t flex justify-center items-center sticky bottom-0 bg-background/95 z-10">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm" onClick={handleAddEvent} className="text-xs px-2"><Plus className="mr-1 h-3 w-3" /> Add Event</Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</SheetTitle>
            </SheetHeader>
            <EventForm event={selectedEvent} onSave={() => setIsSheetOpen(false)} selectedDate={selectedDate}/>
          </SheetContent>
        </Sheet>
      </footer>
    </div>
  );
}
