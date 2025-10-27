'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useDoc, useAuth, useMemoFirebase } from "@/firebase";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UserProfile } from "@/lib/types";
import { BookMarked, LogOut, User as UserIcon, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

function ProfileCompletionForm({ user, role }: { user: NonNullable<ReturnType<typeof useUser>['user']>, role: UserProfile['role'] }) {
    const firestore = useFirestore();
    const [name, setName] = useState(user.displayName || user.email?.split('@')[0] || '');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({ variant: 'destructive', title: "Le nom ne peut pas être vide." });
            return;
        }
        setIsLoading(true);

        try {
            const userRef = doc(firestore, "users", user.uid);
            const newUserProfile: UserProfile = {
                id: user.uid,
                name: name.trim(),
                email: user.email,
                role: role,
                profileImageId: 'student-profile-1', // Default image
                interests: []
            };
            
            // This is a crucial write, so we can block for it.
            await setDoc(userRef, newUserProfile);
            
            toast({ title: "Profil créé !", description: "Bienvenue sur UmwugaHome." });
            // The profile page will automatically re-render with the new data.
        } catch (error: any) {
            console.error("Error creating profile:", error);
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible de créer le profil." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline">Compléter votre profil</CardTitle>
                    <CardDescription>
                        Finalisez votre inscription en confirmant votre nom.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user.email || ''} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom complet" required />
                        </div>
                         <div className="space-y-2">
                            <Label>Rôle</Label>
                            <Input value={role} disabled className="capitalize" />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Enregistrer le profil
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const auth = useAuth();
    const router = useRouter();

    // We need to fetch the role from the redirect, if it exists
    const roleFromQuery = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('role') as UserProfile['role'] | null : null;
    
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

    // If user is logged in, but profile doc doesn't exist, show completion form
    if (user && !userProfile) {
        // Use role from query param, fallback to 'student'
        const roleToCreate = roleFromQuery || 'student';
        return <ProfileCompletionForm user={user} role={roleToCreate} />;
    }

    // This should now only be hit if userProfile exists.
    if (!userProfile) {
        // Fallback just in case, should not be reached.
        router.push('/login?error=profile_creation_failed');
        return null;
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
