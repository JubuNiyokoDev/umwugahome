
'use client';
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { UserProfile } from "@/lib/types";
import { Loader2, Shield } from "lucide-react";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

function AdminProtectionLayer({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const userProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    React.useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login?redirect=/seed');
        }
    }, [isUserLoading, user, router]);

    if (isUserLoading || isProfileLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (userProfile?.role !== 'admin') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center p-4">
                <Shield className="h-12 w-12 text-destructive" />
                <h1 className="text-2xl font-bold">Accès Refusé</h1>
                <p className="text-muted-foreground max-w-md">Vous n'avez pas les autorisations nécessaires pour accéder à cette page. Seul un administrateur peut initialiser la base de données.</p>
                <Button asChild>
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        );
    }
    
    return <>{children}</>;
}


export default function SeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectionLayer>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="w-full max-w-2xl p-4 md:p-6">
                {children}
            </div>
        </div>
    </AdminProtectionLayer>
  );
}
