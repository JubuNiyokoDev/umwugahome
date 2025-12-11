
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { seedData } from "@/lib/seed";
import { writeBatch, doc } from "firebase/firestore";
import { useState } from "react";
import { Loader2, Database } from "lucide-react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function SeedPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeedDatabase = async () => {
        if (!firestore) {
            toast({ variant: 'destructive', title: "Firestore not available." });
            return;
        }
        if (!user) {
             toast({ variant: 'destructive', title: "Authentication required.", description: "Please log in as admin to seed the database." });
            return;
        }

        setIsSeeding(true);
        toast({ title: "Démarrage du seeding...", description: "Veuillez patienter." });

        try {
            const batch = writeBatch(firestore);

            // Seed Users
            seedData.users.forEach(userData => {
                const userRef = doc(firestore, 'users', userData.id);
                batch.set(userRef, userData);
            });
            
            // Seed Artisans
            seedData.artisans.forEach(artisan => {
                const artisanRef = doc(firestore, 'artisans', artisan.id);
                batch.set(artisanRef, artisan);
            });

            // Seed Training Centers
            seedData.trainingCenters.forEach(center => {
                const centerRef = doc(firestore, 'training_centers', center.id);
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
                    batch.set(orderRef, {...order, orderDate: new Date(order.orderDate)});
                });
            }
            
            await batch.commit();

            toast({
                title: "Base de données initialisée !",
                description: "Toutes les données de test ont été ajoutées avec succès."
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
            <h1 className="text-3xl font-bold font-headline">Initialisation de la base de données</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Lancer le seeding</CardTitle>
                    <CardDescription>
                        Cette action remplira votre base de données avec un jeu complet de données de test (utilisateurs, artisans, produits, etc.).
                        Vous devez être connecté en tant qu'administrateur pour effectuer cette action.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeedDatabase} disabled={isSeeding || isUserLoading}>
                        {isSeeding ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initialisation en cours...
                            </>
                        ) : (
                            <>
                                <Database className="mr-2 h-4 w-4" />
                                Lancer le Seeding
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
