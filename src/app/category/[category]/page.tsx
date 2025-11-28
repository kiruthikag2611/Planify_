
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// This page is no longer needed in the new flow, as role selection
// happens on the main category page. We'll redirect users away from here.
export default function SubCategoryRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-center">
             <Skeleton className="h-12 w-64" />
             <Skeleton className="h-8 w-80 mt-2" />
             <div className="mt-8 space-y-4 w-full max-w-sm">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
             </div>
        </div>
    </div>
  );
}
