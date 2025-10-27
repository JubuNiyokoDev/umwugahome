
'use client';

import { useState } from "react";
import { User } from "firebase/auth";
import { doc } from "firebase/firestore";
import { Loader2, Save } from "lucide-react";
import { useFirestore, setDocumentNonBlocking } from "@/firebase";
import { Artisan, Mentor, TrainingCenter, UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ProfileCompletionFormProps {
    user: User;
    role: UserProfile['role'];
}

export function ProfileCompletionForm({ user, role }: ProfileCompletionFormProps) {
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
        if (!firestore) return;

        setIsLoading(true);

        const userRef = doc(firestore, "users", user.uid);
        const newUserProfile: UserProfile = {
            id: user.uid,
            name: name.trim(),
            email: user.email,
            role: role,
            interests: role === 'student' ? ['Couture', 'Design Web'] : []
        };
        
        // Use non-blocking write for main user profile
        setDocumentNonBlocking(userRef, newUserProfile, {});

        // Create specific profile based on role, also non-blocking
        if (role === 'artisan') {
            const artisanRef = doc(firestore, "artisans", user.uid);
            const newArtisan: Artisan = {
                id: user.uid,
                userId: user.uid,
                name: name.trim(),
                craft: "À définir",
                province: "À définir",
                bio: "Bio à compléter.",
                rating: 0,
                profileImageId: 'artisan-1'
            };
            setDocumentNonBlocking(artisanRef, newArtisan, {});
        } else if (role === 'training_center') {
            const centerRef = doc(firestore, "training-centers", user.uid);
            const newCenter: TrainingCenter = {
                id: user.uid,
                userId: user.uid,
                name: name.trim(),
                province: "À définir",
                description: "Description à compléter.",
                rating: 0,
                imageId: 'training-center-1'
            };
            setDocumentNonBlocking(centerRef, newCenter, {});
        } else if (role === 'mentor') {
            const mentorRef = doc(firestore, "mentors", user.uid);
            const newMentor: Mentor = {
                id: user.uid,
                userId: user.uid,
                name: name.trim(),
                expertise: "À définir",
                province: "À définir",
                bio: "Bio à compléter.",
                rating: 0,
                profileImageId: 'student-profile-1'
            };
            setDocumentNonBlocking(mentorRef, newMentor, {});
        }
        
        toast({ title: "Profil créé !", description: "Bienvenue sur UmwugaHome." });
        setIsLoading(false);
        // The profile page will automatically re-render with the new data due to useDoc hook.
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
                            <Label htmlFor="name">Nom complet ou nom du centre</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" required />
                        </div>
                         <div className="space-y-2">
                            <Label>Rôle</Label>
                            <Input value={role.replace('_', ' ')} disabled className="capitalize" />
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
