
"use client"

import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, Video, FileQuestion, MessageSquareWarning, ArrowLeft } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "How do I add or import my timetable?",
    answer: "You can add your timetable manually in the Calendar section or import it via CSV/ICS file from 'Tools > Data Import/Export'. You can also use the OCR scanner to import from an image."
  },
  {
    question: "How do I enable or disable notifications?",
    answer: "Go to 'Tools > Notifications'. There you will find a master switch to toggle all notifications, as well as individual toggles for each notification type."
  },
  {
    question: "Why am I not receiving reminders?",
    answer: "Please check if notifications are enabled in your device settings for Planify. Also, ensure that the master switch and specific notification types are turned on in the app's notification settings."
  },
  {
    question: "How does the AI schedule optimization work?",
    answer: "Our AI analyzes your current schedule, tasks, and preferences to suggest better time slots, helping you make the most of your free hours and focus on what's important."
  }
];

export default function HelpCenterPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
       <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
              <Link href="/tools">
                  <ArrowLeft className="h-5 w-5" />
              </Link>
          </Button>
          <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Help Center</h2>
              <p className="text-muted-foreground mt-1">How can we help you today?</p>
          </div>
       </div>

      <div className="mt-6 max-w-md">
        <Input placeholder="Search for answers..." />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileQuestion className="h-6 w-6 text-primary"/> Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </CardContent>
        </Card>
        
        <div className="space-y-6 lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Video className="h-6 w-6 text-primary"/> Tutorials</CardTitle>
                    <CardDescription>Short video guides to get you started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="link" className="p-0 h-auto">How to set up your schedule</Button>
                    <Button variant="link" className="p-0 h-auto">Using the Focus Timer effectively</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquareWarning className="h-6 w-6 text-primary"/> Report a Problem</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button className="w-full">Report an Issue</Button>
                </CardContent>
            </Card>
        </div>
      </div>

    </div>
  );
}
