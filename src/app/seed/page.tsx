
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Database } from "lucide-react";

export default function SeedPage() {
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        toast({
            variant: 'destructive',
            title: "Fonctionnalité désactivée",
            description: "L'écriture dans la base de données est actuellement impossible en raison de problèmes de permissions."
        });
        setIsSeeding(false);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Outils d'Initialisation</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Initialisation de la base de données</CardTitle>
                    <CardDescription>
                        Cliquez sur ce bouton pour remplir la base de données Firestore avec un jeu de données de test complet.
                        Cette action est actuellement désactivée en raison de problèmes de permissions persistants.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeedDatabase} disabled={true}>
                        {isSeeding ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initialisation en cours...
                            </>
                        ) : (
                            <>
                                <Database className="mr-2 h-4 w-4" />
                                Lancer le Seeding (Désactivé)
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
