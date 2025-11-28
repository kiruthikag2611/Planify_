
"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/tools">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Notification Settings</h2>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Master Control</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <Switch id="master-toggle" defaultChecked />
                        <Label htmlFor="master-toggle" className="flex flex-col space-y-1">
                            <span>Enable All Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Turn all notifications on or off with one click.
                            </span>
                        </Label>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Notification Types</CardTitle>
                    <CardDescription>Toggle reminders for different activities.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <NotificationToggle id="class-reminders" label="Class Reminders" description="Get notified 10 minutes before a class starts." defaultChecked />
                    <NotificationToggle id="assignment-deadlines" label="Assignment Deadline Alerts" description="Reminders for upcoming assignment due dates." defaultChecked />
                    <NotificationToggle id="exam-alerts" label="Exam Reminders" description="Alerts for upcoming exams." defaultChecked />
                    <NotificationToggle id="project-activity" label="Project/Team Activity Alerts" description="Get notified about updates in your team projects."/>
                    <NotificationToggle id="study-goals" label="Personal Study Goals Alerts" description="Reminders to keep you on track with your study goals." />
                    <NotificationToggle id="focus-timer" label="Focus Timer Alerts" description="Notifications for when your focus sessions end." defaultChecked />
                    <NotificationToggle id="morning-summary" label="Morning Summary" description="Get your daily schedule summary at 7:00 AM." />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                     <CardDescription>Customize notification behavior.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="font-semibold">Quiet Hours (Do Not Disturb)</Label>
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                            <Input type="time" defaultValue="22:00" />
                            <span className="hidden sm:inline">to</span>
                            <Input type="time" defaultValue="06:00" />
                        </div>
                    </div>
                     <Separator />
                     <NotificationToggle id="smart-reminders" label="Smart Auto-Reminders" description="Let AI remind you about tasks based on your free time and deadlines."/>
                    <Separator />
                    <div>
                        <Label className="font-semibold">Delivery Channels</Label>
                        <div className="space-y-3 mt-2">
                           <NotificationToggle id="push-notifications" label="Push Notifications" defaultChecked />
                            <NotificationToggle id="email-alerts" label="Email Alerts" />
                            <NotificationToggle id="in-app-popups" label="In-App Pop-ups" defaultChecked />
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    )
}

function NotificationToggle({ id, label, description, defaultChecked = false }: { id: string, label: string, description?: string, defaultChecked?: boolean }) {
    return (
        <div className="flex items-start sm:items-center justify-between rounded-lg border p-4 flex-col sm:flex-row gap-4">
            <Label htmlFor={id} className="flex flex-col space-y-1">
                <span>{label}</span>
                {description && <span className="font-normal leading-snug text-muted-foreground">{description}</span>}
            </Label>
            <Switch id={id} defaultChecked={defaultChecked} />
        </div>
    )
}
