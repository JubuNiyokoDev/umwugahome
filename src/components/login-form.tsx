'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfile } from "@/lib/types";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserProfile["role"]>("student");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = getFirestore();

  // 🔁 Redirige si déjà connecté
  useEffect(() => {
    if (user && !isUserLoading) {
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/profile");
    }
  }, [user, isUserLoading, router, searchParams]);

  // 🔐 Authentification Email / Password
  const handleAuthAction = async () => {
    if (!auth) return;
    setIsLoading(true);

    try {
      let userCredential: UserCredential;

      if (isSigningUp) {
        // Création du compte
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const createdUser = userCredential.user;

        const userRole = email === "admin@umwuga.com" ? "admin" : role;
        const newUserProfile: UserProfile = {
          id: createdUser.uid,
          name: createdUser.displayName || email.split("@")[0],
          email: createdUser.email!,
          role: userRole,
        };

        await setDoc(doc(firestore, "users", createdUser.uid), newUserProfile);
        toast({ title: "Compte créé avec succès", description: "Bienvenue !" });
      } else {
        // Connexion
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Connexion réussie", description: "Bienvenue !" });
      }

      const redirect = searchParams.get("redirect");
      router.push(redirect || "/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: error.message || "Une erreur est survenue.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Connexion avec Google
  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const gUser = result.user;

      const docRef = doc(firestore, "users", gUser.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const newUserProfile: UserProfile = {
          id: gUser.uid,
          name: gUser.displayName || gUser.email?.split("@")[0] || "Utilisateur",
          email: gUser.email!,
          role: "student",
        };
        await setDoc(docRef, newUserProfile);
        toast({ title: "Bienvenue !", description: "Compte créé avec succès." });
      } else {
        toast({ title: "Connexion réussie", description: "Bienvenue !" });
      }

      const redirect = searchParams.get("redirect");
      router.push(redirect || "/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur Google",
        description: error.message || "Impossible de se connecter avec Google.",
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
            {isSigningUp ? "Inscription" : "Connexion"}
          </CardTitle>
          <CardDescription>
            {isSigningUp
              ? "Créez un compte pour commencer."
              : "Entrez vos identifiants pour accéder à votre espace."}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Sélecteur de rôle */}
          {isSigningUp && email !== "admin@umwuga.com" && (
            <div className="grid gap-2">
              <Label htmlFor="role">Je suis un(e)...</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserProfile["role"])}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant / Jeune</SelectItem>
                  <SelectItem value="artisan">Artisan</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="training_center">
                    Centre de Formation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Bouton principal */}
          <Button
            onClick={handleAuthAction}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSigningUp ? "S'inscrire" : "Se connecter"}
          </Button>

          {/* Connexion Google */}
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            disabled={isGoogleLoading}
          >
            {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continuer avec Google
          </Button>
        </CardContent>

        {/* Pied de carte */}
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">
            {isSigningUp ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <Button
              variant="link"
              onClick={() => setIsSigningUp(!isSigningUp)}
            >
              {isSigningUp ? "Se connecter" : "S'inscrire"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
