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
  signInWithPopup
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/profile');
    }
  }, [user, isUserLoading, router]);

  const handleAuthAction = async () => {
    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Compte créé", description: "Vous êtes maintenant connecté." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Connexion réussie", description: "Bienvenue !" });
      }
      router.push('/profile');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: error.message,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Connexion réussie", description: "Bienvenue !" });
      router.push('/profile');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion Google",
        description: error.message,
      });
    }
  };

  if (isUserLoading || user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">Chargement...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{isSigningUp ? "S'inscrire" : "Connexion"}</CardTitle>
          <CardDescription>
            {isSigningUp ? "Créez un compte pour commencer." : "Entrez votre email pour vous connecter."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemple.com" required value={email} onChange={e => setEmail(e.target.value)} />
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
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button onClick={handleAuthAction} className="w-full">
            {isSigningUp ? "S'inscrire" : "Se connecter"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            Se connecter avec Google
          </Button>
        </CardContent>
        <div className="mt-4 p-6 pt-0 text-center text-sm">
          {isSigningUp ? "Vous avez déjà un compte?" : "Vous n'avez pas de compte?"}{" "}
          <button onClick={() => setIsSigningUp(!isSigningUp)} className="underline">
            {isSigningUp ? "Se connecter" : "S'inscrire"}
          </button>
        </div>
      </Card>
    </div>
  );
}
