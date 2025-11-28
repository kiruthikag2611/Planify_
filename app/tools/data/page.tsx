
"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, DownloadCloud, Scan, FileJson, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DataPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/tools">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Data Import / Export</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Import Data</CardTitle>
                        <CardDescription>Import your timetable, assignments, and tasks from various sources.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full justify-start text-left" variant="outline">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Import from CSV / ICS
                        </Button>
                         <Button className="w-full justify-start text-left" variant="outline">
                            <Scan className="mr-2 h-4 w-4" />
                            Scan Timetable (OCR)
                        </Button>
                         <p className="text-sm text-muted-foreground pt-2">
                            Use our OCR feature to scan a picture of your timetable and automatically populate your schedule.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Export & Backup</CardTitle>
                        <CardDescription>Export your data or create a full backup.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full justify-start text-left" variant="outline">
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Export Timetable (ICS)
                        </Button>
                        <Button className="w-full justify-start text-left" variant="outline">
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Export Tasks (CSV)
                        </Button>
                        <Button className="w-full justify-start text-left" variant="secondary">
                            <FileJson className="mr-2 h-4 w-4" />
                            Backup App Data (JSON)
                        </Button>
                    </CardContent>
                </Card>
            </div>
             <div className="text-center pt-4">
                <p className="text-sm font-medium text-primary cursor-pointer hover:underline">One-click sync (for management accounts)</p>
            </div>
        </div>
    )
}
