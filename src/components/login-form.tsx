
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/lib/types";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('student');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = getFirestore();

  useEffect(() => {
    // This effect redirects the user if they are already logged in.
    if (user && !isUserLoading) {
        router.push('/profile');
    }
  }, [user, isUserLoading, router]);


  const handleAuthAction = async () => {
    if (!auth || !firestore) return;
    setIsLoading(true);
    
    try {
        let userCredential: UserCredential;
        if (isSigningUp) {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Don't create profile here, redirect to profile page with role
            toast({ title: "Compte créé avec succès", description: "Veuillez compléter votre profil." });
            router.push(`/profile?role=${role}`);
        } else {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Connexion réussie", description: "Bienvenue !" });
            router.push('/profile');
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: error.message,
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If user exists, just log them in. If not, redirect to profile completion.
      if (docSnap.exists()) {
         toast({ title: "Connexion réussie", description: "Bienvenue !" });
         router.push('/profile');
      } else {
         toast({ title: "Bienvenue!", description: "Veuillez compléter votre profil." });
         router.push('/profile?role=student'); // Default to student, they can change if needed in profile form.
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion Google",
        description: error.message,
      });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            {isSigningUp ? 'Inscription' : 'Connexion'}
          </CardTitle>
          <CardDescription>
            {isSigningUp
              ? "Créez un compte pour commencer."
              : "Entrez vos identifiants pour accéder à votre espace."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {isSigningUp && (
              <div className="grid gap-2">
                  <Label htmlFor="role">Je suis un(e)...</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserProfile['role'])}>
                      <SelectTrigger id="role">
                          <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="student">Étudiant / Jeune</SelectItem>
                          <SelectItem value="artisan">Artisan</SelectItem>
                          <SelectItem value="mentor">Mentor</SelectItem>
                          <SelectItem value="training_center">Centre de Formation</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
          )}
          <Button onClick={handleAuthAction} className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSigningUp ? "S'inscrire" : 'Se connecter'}
          </Button>
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isGoogleLoading}>
             {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continuer avec Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
            {isSigningUp ? 'Déjà un compte ?' : "Pas encore de compte ?"}
            <Button variant="link" onClick={() => setIsSigningUp(!isSigningUp)}>
                {isSigningUp ? 'Se connecter' : "S'inscrire"}
            </Button>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
