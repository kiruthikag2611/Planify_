
'use client';

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuestionnaire } from "@/context/QuestionnaireProvider";

export default function CategoryPage() {
  const router = useRouter();
  const { setCategory, setSubCategory } = useQuestionnaire();

  const handleSelect = (role: 'student' | 'teacher') => {
    setCategory('academics'); // Both roles fall under an 'academics' umbrella
    setSubCategory(role);
    router.push(`/q/academics/${role}/0`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 relative">
       <Link href="/" className="absolute top-8 left-8">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      <div className="flex flex-col items-center gap-4 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold font-headline">Please confirm your role</h1>
        <p className="text-muted-foreground">Select one to get started.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 w-full">
            <Card 
              onClick={() => handleSelect('student')}
              className="hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 py-8 shadow-md hover:shadow-xl cursor-pointer"
            >
              <CardHeader className="items-center gap-4">
                <GraduationCap className="h-12 w-12 text-primary" />
                <CardTitle className="font-headline text-2xl">Student</CardTitle>
              </CardHeader>
            </Card>
            <Card 
              onClick={() => handleSelect('teacher')}
              className="hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 py-8 shadow-md hover:shadow-xl cursor-pointer"
            >
              <CardHeader className="items-center gap-4">
                <User className="h-12 w-12 text-primary" />
                <CardTitle className="font-headline text-2xl">Teacher</CardTitle>
              </CardHeader>
            </Card>
        </div>
      </div>
    </main>
  );
}
