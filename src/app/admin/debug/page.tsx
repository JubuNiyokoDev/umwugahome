
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { seedData } from "@/lib/seed";
import { writeBatch, doc } from "firebase/firestore";
import { useState } from "react";
import { Loader2, Database } from "lucide-react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function AdminDebugPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeedDatabase = async () => {
        if (!firestore) {
            toast({ variant: 'destructive', title: "Firestore not available." });
            return;
        }

        setIsSeeding(true);
        toast({ title: "Démarrage du seeding...", description: "Veuillez patienter." });

        try {
            const batch = writeBatch(firestore);

            // Seed Users
            seedData.users.forEach(user => {
                const userRef = doc(firestore, 'users', user.id);
                batch.set(userRef, user);
            });
            
            // Seed Artisans
            seedData.artisans.forEach(artisan => {
                const artisanRef = doc(firestore, 'artisans', artisan.id);
                batch.set(artisanRef, artisan);
            });

            // Seed Training Centers
            seedData.trainingCenters.forEach(center => {
                const centerRef = doc(firestore, 'training-centers', center.id);
                batch.set(centerRef, center);
            });

             // Seed Mentors
            seedData.mentors.forEach(mentor => {
                const mentorRef = doc(firestore, 'mentors', mentor.id);
                batch.set(mentorRef, mentor);
            });

            // Seed Products
            seedData.products.forEach(product => {
                const productRef = doc(firestore, 'products', product.id);
                batch.set(productRef, product);
            });

            // Seed Courses
            seedData.courses.forEach(course => {
                const courseRef = doc(firestore, 'courses', course.id);
                batch.set(courseRef, course);
            });

            // Seed Orders
            if (seedData.orders) {
                seedData.orders.forEach(order => {
                    const orderRef = doc(firestore, 'orders', order.id);
                    // Convert ISO string back to Date object for Firestore Timestamp
                    batch.set(orderRef, {...order, orderDate: new Date(order.orderDate)});
                });
            }
            
            await batch.commit();

            toast({
                title: "Base de données initialisée !",
                description: `Les données de test, y compris ${seedData.orders?.length || 0} commandes, ont été ajoutées.`
            });

        } catch (error: any) {
             const permissionError = new FirestorePermissionError({
                path: 'batch operation',
                operation: 'write',
                requestResourceData: 'seed data'
            });
            errorEmitter.emit('permission-error', permissionError);
            console.error("Error seeding database:", error);
            toast({
                variant: 'destructive',
                title: "Erreur lors du seeding",
                description: "Vérifiez les règles de sécurité Firestore et la console du navigateur pour plus de détails."
            });
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Outils de Débogage</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Initialisation de la base de données</CardTitle>
                    <CardDescription>
                        Cliquez sur ce bouton pour remplir la base de données avec un jeu de données de test.
                        Ceci écrasera les données existantes pour les IDs correspondants. Attention: cette opération peut échouer si les règles de sécurité ne permettent pas à un admin d'écrire partout.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeedDatabase} disabled={isSeeding}>
                        {isSeeding ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initialisation en cours...
                            </>
                        ) : (
                            <>
                                <Database className="mr-2 h-4 w-4" />
                                Seed Database
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
