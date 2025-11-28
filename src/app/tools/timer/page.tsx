"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Play, Pause, RotateCw, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const presets = {
  pomodoro: { time: 25 * 60, label: "Pomodoro (25/5)" },
  deepWork: { time: 50 * 60, label: "Deep Work (50/10)" },
  custom: { time: 15 * 60, label: "Custom" },
};

export default function FocusTimerPage() {
  const [activePreset, setActivePreset] = useState("pomodoro");
  const [timer, setTimer] = useState(presets.pomodoro.time);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const totalTime = useMemo(() => presets[activePreset as keyof typeof presets].time, [activePreset]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      if (!isMuted) {
        // Play sound
        new Audio('/sounds/notification.mp3').play().catch(e => console.error("Error playing sound:", e));
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer, isMuted]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = useCallback((presetKey: string) => {
    const preset = presets[presetKey as keyof typeof presets];
    setActivePreset(presetKey);
    setTimer(preset.time);
    setIsActive(false);
  }, []);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (1 - (timer / totalTime)) * 100;

  useEffect(() => {
    resetTimer('pomodoro');
  }, [resetTimer]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex flex-col items-center">
        <div className="w-full max-w-md relative mb-4">
            <Button variant="ghost" size="icon" className="absolute top-0 left-0" asChild>
                <Link href="/tools">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </Button>
        </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Focus Timer</CardTitle>
           <Tabs defaultValue={activePreset} className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3">
                {Object.entries(presets).map(([key, value]) => (
                    <TabsTrigger key={key} value={key} onClick={() => resetTimer(key)}>{value.label}</TabsTrigger>
                ))}
            </TabsList>
           </Tabs>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200 dark:text-gray-700" strokeWidth="7" cx="50" cy="50" r="45" fill="transparent" />
                <circle 
                    className="text-primary"
                    strokeWidth="7"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    strokeDasharray="282.7"
                    strokeDashoffset={282.7 - (progressPercentage / 100) * 282.7}
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className="text-6xl font-bold font-mono tracking-tighter z-10">
              {formatTime(timer)}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleTimer} size="lg" className="w-32">
              {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button onClick={() => resetTimer(activePreset)} variant="outline" size="icon">
              <RotateCw className="h-5 w-5" />
            </Button>
             <Button onClick={() => setIsMuted(!isMuted)} variant="outline" size="icon">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </CardContent>
         <CardFooter className="flex-col gap-4">
            <div className="w-full text-center">
                <p className="text-sm text-muted-foreground">You studied 45 mins today</p>
                <Progress value={30} className="mt-2" />
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
