
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useDoc, useAuth, useMemoFirebase } from "@/firebase";
import { UserProfile } from "@/lib/types";
import { BookMarked, LogOut, User as UserIcon, Loader2, Save, Building, Paintbrush, Edit, Shield } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AiSuggestions } from "@/components/ai-suggestions";
import { ProfileCompletionForm } from "@/components/profile-completion-form";
import { ProfileDashboard } from "@/components/profile-dashboard";

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const auth = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Safely get query params only on the client side
    const [roleFromQuery, setRoleFromQuery] = useState<UserProfile['role'] | null>(null);
    useEffect(() => {
        setRoleFromQuery(searchParams.get('role') as UserProfile['role'] | null);
    }, [searchParams]);
    
    const userProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    const handleSignOut = async () => {
        if (!auth) return;
        await signOut(auth);
        router.push('/');
    };

    if (isUserLoading || !user) {
        if (!isUserLoading && typeof window !== 'undefined') {
            router.push('/login');
        }
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (isProfileLoading) {
         return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (user && !userProfile) {
        // Wait until roleFromQuery is determined on the client
        if (roleFromQuery === null && typeof window !== 'undefined') {
            return (
                 <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }
        const roleToCreate = roleFromQuery || 'student';
        return <ProfileCompletionForm user={user} role={roleToCreate} />;
    }

    if (!userProfile) {
        // This should theoretically not be reached if the above logic is correct
        router.push('/login?error=profile_creation_failed');
        return null;
    }


    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center p-6 text-center">
                            <Avatar className="w-32 h-32 mb-4">
                                {user.photoURL ? <AvatarImage src={user.photoURL} alt={userProfile.name} /> : <UserIcon className="h-16 w-16 text-muted-foreground" />}
                                <AvatarFallback>
                                    {userProfile.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <h1 className="text-2xl font-bold font-headline">{userProfile.name}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                            <Badge className="mt-2 capitalize" variant="outline">{userProfile.role.replace('_', ' ')}</Badge>
                            <Button className="mt-4 w-full" variant="secondary" onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Se déconnecter
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-8">
                    <ProfileDashboard userProfile={userProfile} />
                </div>
            </div>
        </div>
    );
}
