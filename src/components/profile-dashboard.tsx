
'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiSuggestions } from "@/components/ai-suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser, useFirestore, updateDocumentNonBlocking, useCollection, useMemoFirebase } from "@/firebase";
import { Order, UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Building, Edit, Loader2, Paintbrush, Save, Shield, ShoppingBag, Tag } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { collection, query, where, doc } from "firebase/firestore";

interface ProfileDashboardProps {
    userProfile: UserProfile;
}

function UserOrders() {
    const { user } = useUser();
    const firestore = useFirestore();

    const ordersRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'orders'), where('customerId', '==', user.uid));
    }, [firestore, user]);

    const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(ordersRef);

    return (
        <Card className="bg-card/80 backdrop-blur-sm mt-8">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><ShoppingBag /> Mes Commandes</CardTitle>
                <CardDescription>Suivez le statut de vos commandes passées auprès de nos artisans.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingOrders ? (
                    <p>Chargement de vos commandes...</p>
                ) : !orders || orders.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Vous n'avez passé aucune commande pour le moment.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produit</TableHead>
                                <TableHead>Artisan</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => {
                                let formattedDate = 'Date invalide';
                                if (order.orderDate?.toDate) {
                                    try {
                                        const date = order.orderDate.toDate();
                                        formattedDate = format(date, 'd MMM yyyy', { locale: fr });
                                    } catch (e) {
                                        console.error("Error formatting date: ", order.orderDate)
                                    }
                                } else if (typeof order.orderDate === 'string') {
                                     try {
                                        const date = new Date(order.orderDate);
                                        formattedDate = format(date, 'd MMM yyyy', { locale: fr });
                                     } catch(e) {
                                         console.error("Error formatting date from string: ", order.orderDate)
                                     }
                                }
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.productName}</TableCell>
                                        <TableCell>{order.artisanName}</TableCell>
                                        <TableCell>{formattedDate}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'pending' ? 'default' : 'secondary'} className="capitalize">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}


export function ProfileDashboard({ userProfile }: ProfileDashboardProps) {
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();
    const [isEditingInterests, setIsEditingInterests] = useState(false);
    const [interests, setInterests] = useState(userProfile.interests?.join(', ') || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveInterests = async () => {
        if (!firestore) return;
        setIsSaving(true);
        const userRef = doc(firestore, 'users', userProfile.id);
        const interestsArray = interests.split(',').map(i => i.trim()).filter(Boolean);
        
        updateDocumentNonBlocking(userRef, { interests: interestsArray });

        toast({
            title: "Intérêts mis à jour",
            description: "Vos suggestions de formation seront actualisées.",
        });
        
        setIsSaving(false);
        setIsEditingInterests(false);
        // No need to manually update state, useDoc in parent will handle it.
    };


    if (userProfile.role === 'admin') {
        return (
             <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Shield/> Tableau de bord Administrateur</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/admin')}>Accéder au panneau d'administration</Button>
                </CardContent>
            </Card>
        )
    }

     if (userProfile.role === 'artisan') {
        return (
             <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Paintbrush /> Tableau de bord Artisan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>Gérez votre boutique, vos produits et votre profil public.</p>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => router.push(`/artisans/${userProfile.id}`)}>Voir mon profil public</Button>
                        <Button variant="outline" onClick={() => router.push(`/artisans/${userProfile.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4"/>
                            Modifier mon profil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

     if (userProfile.role === 'training_center') {
        return (
             <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Building/> Tableau de bord Centre</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p>Gérez vos informations, vos programmes et vos inscriptions.</p>
                     <div className="flex flex-wrap gap-2">
                        <Button onClick={() => router.push(`/training/${userProfile.id}`)}>Voir le profil public</Button>
                        <Button variant="outline" onClick={() => router.push(`/training/${userProfile.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4"/>
                            Modifier le profil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }
     if (userProfile.role === 'mentor') {
        return (
             <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Shield/> Tableau de bord Mentor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p>Gérez vos disponibilités, vos mentorés et votre profil public.</p>
                     <div className="flex flex-wrap gap-2">
                        <Button onClick={() => router.push(`/mentors/${userProfile.id}`)}>Voir mon profil public</Button>
                        <Button variant="outline" onClick={() => router.push(`/mentors/${userProfile.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4"/>
                            Modifier mon profil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Default for student
    return (
        <>
            <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <CardTitle className="font-headline flex items-center gap-2"><Tag/> Mes Intérêts</CardTitle>
                         <Button variant="ghost" size="icon" onClick={() => setIsEditingInterests(!isEditingInterests)}>
                            <Edit className="h-4 w-4" />
                         </Button>
                    </div>
                    <CardDescription>Vos intérêts nous aident à vous suggérer les meilleures formations.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isEditingInterests ? (
                        <div className="space-y-4">
                            <Input 
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                placeholder="Ex: Couture, Design Web, Marketing"
                            />
                             <div className="flex gap-2">
                                <Button onClick={handleSaveInterests} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                                    Enregistrer
                                </Button>
                                <Button variant="ghost" onClick={() => setIsEditingInterests(false)}>Annuler</Button>
                             </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {userProfile.interests?.map(interest => (
                                <Badge key={interest} variant="secondary">{interest}</Badge>
                            ))}
                            {(!userProfile.interests || userProfile.interests.length === 0) && (
                                <p className="text-muted-foreground text-sm">Ajoutez vos centres d'intérêt pour obtenir des recommandations.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <AiSuggestions studentProfile={userProfile} />

            <UserOrders />
        </>
    );
}
