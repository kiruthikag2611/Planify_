import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Clock, Calendar, CheckSquare, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/calendar">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Classes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Classes</div>
            <p className="text-xs text-muted-foreground">
              Next: Maths at 10:00 AM
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tasks
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Tasks</div>
            <p className="text-xs text-muted-foreground">
              2 due today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Countdown</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Days</div>
            <p className="text-xs text-muted-foreground">
              Mid-term exams
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 unread messages
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Focus Timer</CardTitle>
             <CardDescription>
              Use the Pomodoro Technique to boost your productivity.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="text-center flex flex-col items-center justify-center gap-4">
              <div className="text-5xl font-bold tracking-tighter">25:00</div>
              <p className="text-sm text-muted-foreground">A short, intense focus session.</p>
              <Button asChild>
                <Link href="/tools/timer">
                  Start Focus Session
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Free Hour Suggestions</CardTitle>
            <CardDescription>
              AI-powered suggestions for your free time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="flex items-center p-2 rounded-md bg-accent/50">
                    <p>Review Chemistry notes (1:00 PM - 2:00 PM)</p>
                </div>
                 <div className="flex items-center p-2 rounded-md bg-accent/50">
                    <p>Work on project presentation (3:00 PM - 4:00 PM)</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
