
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UserProfile } from "@/lib/types";
import { collection, doc, orderBy, query, writeBatch } from "firebase/firestore";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

async function deleteUserAndProfile(firestore: any, userId: string, role: UserProfile['role']) {
    if (!firestore) return;

    const batch = writeBatch(firestore);

    // Delete from users collection
    const userRef = doc(firestore, 'users', userId);
    batch.delete(userRef);

    // Delete from role-specific collection
    let profileRef;
    if (role === 'artisan') {
        profileRef = doc(firestore, 'artisans', userId);
    } else if (role === 'mentor') {
        profileRef = doc(firestore, 'mentors', userId);
    } else if (role === 'training_center') {
        profileRef = doc(firestore, 'training-centers', userId);
    }
    
    if (profileRef) {
        batch.delete(profileRef);
    }
    
    // Non-blocking commit
    batch.commit().catch(error => {
        console.error("Failed to delete user profile:", error);
         errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: `batch delete for user ${userId}`,
            operation: 'delete'
        }));
    });
}


export default function AdminUsersPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const usersRef = useMemoFirebase(() => firestore ? query(collection(firestore, 'users'), orderBy('name')) : null, [firestore]);
    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersRef);

    const handleDeleteUser = async (user: UserProfile) => {
        if (!firestore) return;
        await deleteUserAndProfile(firestore, user.id, user.role);
        toast({
            title: "Utilisateur supprimé",
            description: `L'utilisateur ${user.name} a été supprimé avec succès.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-headline">Gestion des Utilisateurs</h1>
                <Button disabled>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un utilisateur
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Tous les utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingUsers ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                users?.map(user => {
                                     const userImage = user.profileImageId ? PlaceHolderImages.find(img => img.id === user.profileImageId) : null;
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        {userImage && <AvatarImage src={userImage.imageUrl} />}
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{user.role.replace('_', ' ')}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <AlertDialog>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Ouvrir le menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem disabled>Modifier</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Supprimer
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Cette action est irréversible. Elle supprimera définitivement l'utilisateur <span className="font-bold">{user.name}</span> et toutes les données associées à son compte.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteUser(user)} className={buttonVariants({ variant: "destructive" })}>Supprimer</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })