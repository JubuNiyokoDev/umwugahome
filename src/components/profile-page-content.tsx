
'use client';

import { useUser, useFirestore, useDoc, useAuth, useMemoFirebase } from "@/firebase";
import { UserProfile } from "@/lib/types";
import { Loader2, LogOut } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User as UserIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ProfileDashboard } from "./profile-dashboard";
import { ProfileCompletionForm } from "./profile-completion-form";

export function ProfilePageContent() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const auth = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    
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
        const roleFromQuery = searchParams.get('role') as UserProfile['role'] | null;
        const roleToCreate = roleFromQuery || 'student';
        return <ProfileCompletionForm user={user} role={roleToCreate} />;
    }

    if (!userProfile) {
        router.push('/login?error=profile_not_found');
        return (
             <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
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
