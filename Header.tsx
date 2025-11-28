
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';
import { useUser } from '@/firebase/auth/use-user';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { useQuestionnaire } from '@/context/QuestionnaireProvider';

export function Header() {
  const router = useRouter();
  const { user, status } = useUser();
  const firestore = useFirestore();
  const { answers: localAnswers } = useQuestionnaire();

  const userDocRef = user && firestore ? doc(firestore, 'users', user.uid) : null;

  const { data: userProfile } = useDoc<{answers?: any}>(userDocRef);
  
  const answersToShow = userProfile?.answers || localAnswers;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="lg:hidden">
            <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        {status === 'loading' ? (
           <Skeleton className="h-8 w-32" />
        ) : user ? (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium leading-none">Hello, {user.displayName || 'User'}</p>
                  </div>
                  <Avatar>
                      {user.photoURL ? <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} /> : null}
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Your Onboarding Answers</h4>
                    <p className="text-sm text-muted-foreground">
                      This is the information you provided to generate your schedule.
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm">
                    {answersToShow && Object.keys(answersToShow).length > 0 ? (
                      Object.entries(answersToShow).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 items-center gap-2">
                          <span className="font-semibold capitalize col-span-1">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="text-muted-foreground col-span-2">{String(value)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No answers found.</p>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
        ) : (
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
