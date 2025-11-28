
"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, CalendarDays, CheckSquare, ChevronDown, Clock, Plus, Brain } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { EventForm } from "@/components/calendar/EventForm"

const upcomingExams = [
    { subject: "Quantum Physics", date: "Dec 12, 2024", time: "10:00 AM", room: "A-101", color: "bg-blue-500" },
    { subject: "Organic Chemistry", date: "Dec 15, 2024", time: "2:00 PM", room: "C-203", color: "bg-teal-500" },
    { subject: "Data Structures", date: "Dec 18, 2024", time: "9:00 AM", room: "Lab-4", color: "bg-purple-500" },
];

const revisionTopics = [
    { topic: "Wave-particle duality", difficulty: "hard", completed: false },
    { topic: "SN1 vs SN2 Reactions", difficulty: "moderate", completed: true },
    { topic: "Big O Notation", difficulty: "easy", completed: false },
];

const studyPlan = [
    { subject: "Quantum Physics", time: "7:00 PM - 9:00 PM", priority: "High" },
    { subject: "Data Structures", time: "4:00 PM - 6:00 PM", priority: "Medium" },
];

export default function ExamsPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 relative">
            <div className="flex items-center gap-4">
                <Link href="/tasks" passHref>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Brain className="h-8 w-8 text-primary"/>Thinkathon</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarDays className="text-primary" /> Upcoming Exams</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {upcomingExams.map((exam, index) => (
                                <Card key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-4">
                                    <div className={`w-full sm:w-2 h-2 sm:h-16 rounded-full ${exam.color} mr-0 sm:mr-4 mb-2 sm:mb-0`}></div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{exam.subject}</p>
                                        <p className="text-sm text-muted-foreground">{exam.date} at {exam.time} | Room: {exam.room}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="mt-2 sm:mt-0 self-end sm:self-center">View Details <ChevronDown className="h-4 w-4 ml-1" /></Button>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CheckSquare className="text-primary" /> Subjects to Revise</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {revisionTopics.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                                    <div className="flex items-center gap-3">
                                        <Checkbox id={`topic-${index}`} checked={item.completed} />
                                        <label htmlFor={`topic-${index}`} className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                            {item.topic}
                                        </label>
                                    </div>
                                    <Badge variant={item.difficulty === 'hard' ? 'destructive' : item.difficulty === 'moderate' ? 'secondary' : 'outline'}>
                                        {item.difficulty}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary" /> Priority-Based Study Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {studyPlan.map((plan, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">{plan.subject}</p>
                                            <p className="text-sm text-muted-foreground">{plan.time}</p>
                                        </div>
                                         <Badge variant={plan.priority === "High" ? "destructive" : "secondary"}>{plan.priority} Priority</Badge>
                                    </div>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-6">
                    <Card className="text-center bg-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle>Next Exam In</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-6xl font-bold">3</p>
                            <p className="text-lg text-muted-foreground">Days</p>
                            <p className="font-semibold mt-2">Quantum Physics</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock className="text-primary" /> Auto-Generated Study Slots</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-muted/50 p-3 rounded-md">
                                <p className="font-semibold">Review Chemistry</p>
                                <p className="text-sm text-muted-foreground">Today, 4:00 PM - 5:00 PM</p>
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="secondary">Accept</Button>
                                    <Button size="sm" variant="ghost">Edit</Button>
                                </div>
                            </div>
                            <Separator />
                             <div className="bg-muted/50 p-3 rounded-md">
                                <p className="font-semibold">Practice Data Structures</p>
                                <p className="text-sm text-muted-foreground">Tomorrow, 6:00 PM - 7:30 PM</p>
                                 <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="secondary">Accept</Button>
                                    <Button size="sm" variant="ghost">Edit</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg">
                    <Plus className="h-8 w-8" />
                    <span className="sr-only">Add Exam</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                  <SheetHeader>
                      <SheetTitle>Add a New Exam</SheetTitle>
                      <SheetDescription>
                        Fill in the details for your upcoming exam.
                      </SheetDescription>
                  </SheetHeader>
                  <EventForm onSave={() => {}} />
              </SheetContent>
            </Sheet>
        </div>
    )
}
