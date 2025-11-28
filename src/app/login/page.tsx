
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as React from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useAuth, useFirebase } from '@/firebase/provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';


const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
        <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
        />
        <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.8 0-5.18-1.88-6.04-4.42H2.34v2.84C4.13 20.98 7.79 23 12 23z"
        fill="#34A853"
        />
        <path
        d="M5.96 14.25c-.2-.6-.31-1.24-.31-1.9s.11-1.3.31-1.9V7.61H2.34c-.77 1.52-1.22 3.24-1.22 5.14s.45 3.62 1.22 5.14l3.62-2.84z"
        fill="#FBBC05"
        />
        <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.79 1 4.13 3.02 2.34 5.86l3.62 2.84c.86-2.54 3.24-4.42 6.04-4.42z"
        fill="#EA4335"
        />
    </svg>
);

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signUpSchema = z.object({
    displayName: z.string().min(1, { message: 'Name is required.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const auth = useAuth();
    const { user, status } = useUser();
    
    useEffect(() => {
        setIsClient(true);
        if (status === 'authenticated') {
            router.replace('/dashboard');
        }
    }, [status, router]);

    const backgroundImage = PlaceHolderImages.find(p => p.id === 'login-background');

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const additionalInfo = getAdditionalUserInfo(result);
            toast({ title: 'Login Successful', description: 'Redirecting...' });
            if (additionalInfo?.isNewUser) {
                router.push('/category');
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: error.message || 'An unknown error occurred.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading' || status === 'authenticated') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
        <div className="relative min-h-screen w-full">
            {backgroundImage && (
                <Image
                    src={backgroundImage.imageUrl}
                    alt={backgroundImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={backgroundImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative flex min-h-screen items-center justify-center p-4">
                 <Button asChild variant="ghost" className="absolute top-8 left-8 text-white hover:bg-white/10 hover:text-white">
                    <Link href="/">
                       <ArrowLeft className="mr-2 h-4 w-4" />
                       Back
                    </Link>
                </Button>
                <Card className="w-full max-w-sm animate-fade-in shadow-2xl border-white/20 bg-black/40 text-white backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome!</CardTitle>
                        <CardDescription className="text-white/80">Create an account or sign in to continue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isClient ? (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <>
                                <Tabs defaultValue="signup" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white/70">
                                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="signup">
                                        <SignUpForm setIsLoading={setIsLoading} isLoading={isLoading} />
                                    </TabsContent>
                                    <TabsContent value="signin">
                                        <SignInForm setIsLoading={setIsLoading} isLoading={isLoading} />
                                    </TabsContent>
                                </Tabs>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/30" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-black/40 px-2 text-white/80">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <Button onClick={handleGoogleSignIn} className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
                                <GoogleIcon />
                                    Sign in with Google
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function SignInForm({ setIsLoading, isLoading }: { setIsLoading: (v: boolean) => void, isLoading: boolean }) {
    const router = useRouter();
    const { toast } = useToast();
    const auth = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' },
    });

    const handleEmailSubmit = async (data: z.infer<typeof signInSchema>) => {
        if (!auth) return;
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            toast({ title: 'Login Successful', description: 'Redirecting...' });
            router.push('/dashboard');
        } catch (error: any) {
            let description = 'An unknown error occurred.';
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                description = 'Invalid credentials. Please check your email and password.';
            }
            setError(description);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-4 mt-4">
                 {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Sign In Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/80">Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/80">Password</FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Input 
                                        type={showPassword ? 'text' : 'password'} 
                                        placeholder="••••••••" 
                                        {...field} 
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white pr-10"
                                    />
                                </FormControl>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-white/70" /> : <Eye className="h-5 w-5 text-white/70" />}
                                </button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
            </form>
        </Form>
    );
}

function SignUpForm({ setIsLoading, isLoading }: { setIsLoading: (v: boolean) => void, isLoading: boolean }) {
    const router = useRouter();
    const { toast } = useToast();
    const auth = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { displayName: '', email: '', password: '' },
    });

    const handleEmailSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!auth) return;
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            if (userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: data.displayName,
                });
            }
            toast({ title: 'Sign Up Successful', description: 'Redirecting to next step...' });
            router.push('/category');
        } catch (error: any) {
            let description = 'An unknown error occurred.';
            if (error.code === 'auth/email-already-in-use') {
                description = 'This email is already in use. Please sign in or use a different email.';
            } else if (error.code === 'auth/weak-password') {
                description = 'The password is too weak. Please use a stronger password.';
            }
            setError(description);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-4 mt-4">
                 {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Sign Up Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/80">Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Your Name" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/80">Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/80">Password</FormLabel>
                             <div className="relative">
                                <FormControl>
                                    <Input 
                                        type={showPassword ? 'text' : 'password'} 
                                        placeholder="••••••••" 
                                        {...field} 
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white pr-10"
                                    />
                                </FormControl>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-white/70" /> : <Eye className="h-5 w-5 text-white/70" />}
                                </button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                </Button>
            </form>
        </Form>
    );
}
