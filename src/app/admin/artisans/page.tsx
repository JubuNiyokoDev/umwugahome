
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Artisan } from "@/lib/types";
import { MoreHorizontal, PlusCircle, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { ArtisanFormDialog } from "@/components/admin/artisan-form-dialog";
import { useState } from "react";

export default function AdminArtisansPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    
    const artisansRef = useMemoFirebase(() => firestore ? collection(firestore, 'artisans') : null, [firestore]);
    const { data: artisans, isLoading } = useCollection<Artisan>(artisansRef);

    const handleEditArtisan = (artisan: Artisan) => {
        setSelectedArtisan(artisan);
        setDialogMode('edit');
        setDialogOpen(true);
    };

    const handleDeleteArtisan = async (artisan: Artisan) => {
        if (!firestore) return;
        
        try {
            await deleteDoc(doc(firestore, 'artisans', artisan.id));
            toast({
                title: "Artisan supprimé",
                description: `${artisan.name} a été supprimé avec succès.`,
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer l'artisan.",
                variant: "destructive"
            });
        }
    };

    const handleAddArtisan = () => {
        setSelectedArtisan(null);
        setDialogMode('create');
        setDialogOpen(true);
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-headline">Gestion des Artisans</h1>
                <Button onClick={handleAddArtisan}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un artisan
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Tous les artisans</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Métier</TableHead>
                                <TableHead>Province</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({length: 4}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                artisans?.map(artisan => {
                                    return (
                                        <TableRow key={artisan.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        {artisan.profileImageId && <AvatarImage src={artisan.profileImageId} />}
                                                        <AvatarFallback>{artisan.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <p className="font-medium">{artisan.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                 <Badge variant="secondary">{artisan.craft}</Badge>
                                            </TableCell>
                                            <TableCell>{artisan.province}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-primary fill-primary" />
                                                    {artisan.rating}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Ouvrir le menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/artisans/${artisan.id}`}>Voir le profil</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditArtisan(artisan)}>Modifier</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                                                            onClick={() => handleDeleteArtisan(artisan)}
                                                        >
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <ArtisanFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                artisan={selectedArtisan}
                mode={dialogMode}
            />
        </div>
    );
}
