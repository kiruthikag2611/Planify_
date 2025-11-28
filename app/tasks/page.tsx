

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Search, Filter, Check, Clock, Edit, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EventForm } from "@/components/calendar/EventForm";

const tasks = [
    {
        subject: "Math",
        type: "Assignment",
        title: "Complete Chapter 5 exercises",
        dueDate: "2024-11-22T10:00:00",
        progress: 40,
        priority: "High"
    },
    {
        subject: "Physics",
        type: "Exam Prep",
        title: "Review electromagnetism concepts",
        dueDate: "2024-11-25T14:00:00",
        progress: 0,
        priority: "Medium"
    },
     {
        subject: "History",
        type: "Class Prep",
        title: "Read Chapter 12 for discussion",
        dueDate: "2024-11-21T09:00:00",
        progress: 100,
        priority: "Low"
    },
];


export default function TasksPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tasks & Activities</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Badge variant="outline">Today: 3</Badge>
        <Badge variant="outline">Due this week: 7</Badge>
        <Badge variant="outline">Focusable: 2</Badge>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
            <TaskList tasks={tasks} />
        </TabsContent>
        <TabsContent value="pending">
             <TaskList tasks={tasks.filter(t => t.progress < 100 && new Date(t.dueDate) > new Date())} />
        </TabsContent>
        <TabsContent value="overdue">
             <TaskList tasks={tasks.filter(t => t.progress < 100 && new Date(t.dueDate) < new Date())} />
        </TabsContent>
        <TabsContent value="completed">
            <TaskList tasks={tasks.filter(t => t.progress === 100)} />
        </TabsContent>
      </Tabs>
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg">
              <Plus className="h-8 w-8" />
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add New Task</SheetTitle>
          </SheetHeader>
          <EventForm onSave={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function TaskList({ tasks }: { tasks: any[] }) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No tasks here yet.</p>
                 <Button className="mt-4">Add Task</Button>
            </div>
        )
    }
    return (
         <div className="space-y-4 mt-4">
            {tasks.map((task, index) => (
                <TaskCard key={index} task={task} />
            ))}
        </div>
    )
}

function TaskCard({ task }: { task: any }) {
    const [dueDate, setDueDate] = useState<string | null>(null);

    useEffect(() => {
        setDueDate(
          `Due ${new Date(task.dueDate).toLocaleDateString()} • ${new Date(
            task.dueDate
          ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        );
    }, [task.dueDate]);
    
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge>{task.subject} - {task.type}</Badge>
                        <CardTitle className="mt-2">{task.title}</CardTitle>
                    </div>
                    <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>{task.priority}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                 <div className="flex items-center text-sm text-muted-foreground h-5">
                    <Clock className="mr-2 h-4 w-4" />
                    {dueDate ? (
                        <span>{dueDate}</span>
                    ) : (
                        <div className="h-4 w-48 rounded-md bg-muted animate-pulse" />
                    )}
                </div>
                {task.progress > 0 && <Progress value={task.progress} />}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t mt-2">
                     <Button variant="ghost" size="icon"><Check className="h-4 w-4" /></Button>
                     <Button variant="ghost" size="icon"><Clock className="h-4 w-4" /></Button>
                     <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                     <Button variant="ghost" size="icon"><Users className="h-4 w-4" /></Button>
                </div>
            </CardContent>
        </Card>
    );
}
