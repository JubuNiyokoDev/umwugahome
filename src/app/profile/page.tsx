'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useDoc, useAuth, useMemoFirebase } from "@/firebase";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UserProfile } from "@/lib/types";
import { BookMarked, UserPlus, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const auth = useAuth();
    const router = useRouter();

    const userProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    const handleSignOut = async () => {
        if (!auth) return;
        await signOut(auth);
        router.push('/');
    };

    if (isUserLoading || (user && isProfileLoading)) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        // This should be handled by a route guard in a real app, but for now, redirect.
        router.push('/login');
        return null;
    }
    
    // This state can happen briefly when a user is created in Auth but the Firestore doc is not yet available.
    if (!userProfile) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-4">Finalisation de la configuration du profil...</p>
            </div>
        );
    }

    const profileImage = PlaceHolderImages.find(img => img.id === userProfile.profileImageId);

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center p-6 text-center">
                            <Avatar className="w-32 h-32 mb-4">
                                <AvatarImage src={user.photoURL || profileImage?.imageUrl} alt={userProfile.name} />
                                <AvatarFallback>
                                    <UserIcon className="h-16 w-16 text-muted-foreground" />
                                </AvatarFallback>
                            </Avatar>
                            <h1 className="text-2xl font-bold font-headline">{user.displayName || userProfile.name}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                            <Badge className="mt-2 capitalize" variant="outline">{userProfile.role}</Badge>
                            <Button className="mt-4 w-full" variant="secondary" onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Se déconnecter
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card className="bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="font-headline">Mes Intérêts</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {userProfile.interests?.map(interest => (
                                <Badge key={interest} variant="secondary">{interest}</Badge>
                            ))}
                             {(!userProfile.interests || userProfile.interests.length === 0) && (
                                <p className="text-muted-foreground text-sm">Ajoutez vos centres d'intérêt pour obtenir des recommandations.</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="mt-8 bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <BookMarked className="h-5 w-5" />
                                Formations et Mentorat
                            </CardTitle>
                            <CardDescription>
                                Suivez vos progrès dans les formations et les sessions de mentorat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="text-center py-12 text-muted-foreground">
                            <p>Vous n'êtes inscrit à aucune formation pour le moment.</p>
                            <Button variant="link" className="mt-2" onClick={() => router.push('/training')}>Explorer les formations</Button>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
