
"use client"

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Bell, Settings, HelpCircle, FileInput } from "lucide-react";

const tools = [
  {
    title: "Focus Timer",
    description: "Stay focused with customizable study cycles.",
    icon: Clock,
    href: "/tools/timer",
  },
  {
    title: "Reminders & Notifications",
    description: "Control when and how you get notified.",
    icon: Bell,
    href: "/tools/notifications",
  },
  {
    title: "Data Import/Export",
    description: "Sync your timetable, tasks, and schedules.",
    icon: FileInput,
    href: "/tools/data",
  },
  {
    title: "Help Center",
    description: "Get answers, tips, and support.",
    icon: HelpCircle,
    href: "/tools/help",
  },
  {
    title: "Settings",
    description: "Customize your preferences.",
    icon: Settings,
    href: "/tools/settings",
  },
];

export default function ToolsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Tools</h2>
        <p className="text-muted-foreground">Utilities & Smart Controls</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.title}>
            <Card className="hover:bg-accent hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl h-full">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 space-y-2 sm:space-y-0">
                <tool.icon className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription className="mt-1">{tool.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
