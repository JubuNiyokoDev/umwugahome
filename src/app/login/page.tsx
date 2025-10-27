'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/lib/types";

export default function LoginPage() {
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
            const user = userCredential.user;

            // Immediately create the user profile document
            const userRef = doc(firestore, "users", user.uid);
            await setDoc(userRef, { 
                id: user.uid,
                name: user.displayName || email.split('@')[0],
                email: user.email,
                role: role,
                interests: []
            });
            
            toast({ title: "Compte créé avec succès", description: "Bienvenue ! Redirection..." });

        } else {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Connexion réussie", description: "Bienvenue !" });
        }
        // Redirect to profile page after the action is complete
        // The useEffect will handle this, but we can also push directly
        router.push('/profile');

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: error.message,
        });
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

      // Check if user profile already exists, if not, create it
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const newUserProfile: UserProfile = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Utilisateur',
          email: user.email,
          role: 'student', // Default role for Google Sign-in
          interests: []
        };
        await setDoc(docRef, newUserProfile);
        toast({ title: "Compte créé avec succès", description: "Bienvenue sur UmwugaHome." });
      } else {
        toast({ title: "Connexion réussie", description: "Bienvenue !" });
      }
      router.push('/profile');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion Google",
        description: error.message,
      });
       setIsGoogleLoading(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{isSigningUp ? "S'inscrire" : "Connexion"}</CardTitle>
          <CardDescription>
            {isSigningUp ? "Créez un compte pour commencer." : "Entrez votre email pour vous connecter."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemple.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading || isGoogleLoading} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
              {!isSigningUp && (
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Mot de passe oublié?
                </Link>
              )}
            </div>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading || isGoogleLoading} />
          </div>
          {isSigningUp && (
            <div className="grid gap-2">
              <Label htmlFor="role">Je suis un(e)</Label>
              <Select onValueChange={(value) => setRole(value as UserProfile['role'])} defaultValue={role}>
                <SelectTrigger id="role" disabled={isLoading || isGoogleLoading}>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Jeune / Étudiant</SelectItem>
                  <SelectItem value="artisan">Artisan</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="training_center">Centre de Formation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Button onClick={handleAuthAction} className="w-full" disabled={isLoading || isGoogleLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSigningUp ? "S'inscrire" : "Se connecter"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
             {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter avec Google
          </Button>
        </CardContent>
        <div className="mt-4 p-6 pt-0 text-center text-sm">
          {isSigningUp ? "Vous avez déjà un compte?" : "Vous n'avez pas de compte?"}{" "}
          <button onClick={() => setIsSigningUp(!isSigningUp)} className="underline" disabled={isLoading || isGoogleLoading}>
            {isSigningUp ? "Se connecter" : "S'inscrire"}
          </button>
        </div>
      </Card>
    </div>
  );
}
