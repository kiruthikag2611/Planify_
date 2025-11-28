
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createSchedule } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import type { Question } from '@/lib/questions';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type QuestionnaireClientPageProps = {
  category: string;
  subCategory: string;
  questionIndex: number;
  currentQuestion: Question;
  totalQuestions: number;
};

export function QuestionnaireClientPage({
  category,
  subCategory,
  questionIndex,
  currentQuestion,
  totalQuestions,
}: QuestionnaireClientPageProps) {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { answers, updateAnswer, getFormattedAnswers } = useQuestionnaire();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLastQuestion = questionIndex === totalQuestions - 1;
  const isFirstQuestion = questionIndex === 0;
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  const FormSchema = z.object({
    [currentQuestion.id]: z.string().min(1, 'This field is required.'),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      [currentQuestion.id]: answers[currentQuestion.id] || '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const newAnswers = { ...answers, ...data };
    updateAnswer(data);

    if (isLastQuestion) {
      setIsLoading(true);
      const formattedAnswers = getFormattedAnswers();
      // Important: merge the final answer before submitting
      const finalAnswers = { ...formattedAnswers, ...data };
      
      const result = await createSchedule(finalAnswers);

      if (result.success && result.data) {
        if (user && firestore) {
          const userRef = doc(firestore, 'users', user.uid);
          const payload = { answers: newAnswers };
          setDoc(userRef, payload, { merge: true }).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'update',
              requestResourceData: payload,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
        }
        
        toast({
          title: 'Schedule Generated!',
          description: 'Your new timetable is ready. Saving it now...',
        });
        sessionStorage.setItem('scheduleData', JSON.stringify(result.data));
        router.push('/schedule');
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: result.error || 'Could not generate the schedule. Please try again.',
        });
        // Redirect to dashboard even on failure
        router.push('/dashboard');
      }
      setIsLoading(false);

    } else {
      router.push(`/q/${category}/${subCategory}/${questionIndex + 1}`);
    }
  }
  
  const handlePrevious = () => {
    if (questionIndex > 0) {
      router.push(`/q/${category}/${subCategory}/${questionIndex - 1}`);
    }
  };

  const InputComponent = currentQuestion.type === 'textarea' ? Textarea : Input;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 animate-fade-in relative bg-muted/20">
        <Button
            variant="ghost"
            onClick={() => router.push('/category')}
            disabled={isLoading}
            className="absolute top-8 left-8 flex items-center gap-2"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>Start Over</span>
        </Button>
      <Card className="w-full max-w-xl shadow-2xl">
        <CardHeader>
          <Progress value={progress} className="w-full mb-4" />
          <CardTitle className="text-center text-2xl font-headline">
            {currentQuestion.question}
          </CardTitle>
          {currentQuestion.description && (
            <CardDescription className="text-center pt-2">{currentQuestion.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!isClient ? (
              <div className="space-y-8">
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-24" />
                </div>
              </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name={currentQuestion.id}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="sr-only">{currentQuestion.question}</FormLabel>
                      <FormControl>
                        {currentQuestion.type === 'radio' && currentQuestion.options ? (
                           <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            {currentQuestion.options.map((option) => (
                              <FormItem key={option.value} className="flex-1">
                                <FormControl>
                                  <Card className={cn("cursor-pointer hover:border-primary", field.value === option.value && "border-2 border-primary")}>
                                      <Label className="flex flex-col items-center justify-center p-4 cursor-pointer">
                                         <RadioGroupItem value={option.value} className="sr-only" />
                                        <span className="font-semibold text-lg">{option.label}</span>
                                        {option.description && <span className="text-sm text-muted-foreground text-center mt-1">{option.description}</span>}
                                      </Label>
                                  </Card>
                                </FormControl>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        ) : (
                          <InputComponent
                            type={currentQuestion.type}
                            placeholder={currentQuestion.placeholder || "Type your answer here..."}
                            {...field}
                            className="text-center text-lg py-6"
                          />
                        )}
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                  <Button type="button" variant="ghost" onClick={handlePrevious} disabled={isFirstQuestion || isLoading}>
                    Previous Question
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {questionIndex + 1} / {totalQuestions}
                  </span>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : isLastQuestion ? (
                      'Generate my Timetable'
                    ) : (
                      'Next'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
