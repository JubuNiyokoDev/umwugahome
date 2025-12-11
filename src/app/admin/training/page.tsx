
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Course, TrainingCenter } from "@/lib/types";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { CourseFormDialog } from "@/components/admin/course-form-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminTrainingPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    
    const coursesRef = useMemoFirebase(() => firestore ? collection(firestore, 'courses') : null, [firestore]);
    const centersRef = useMemoFirebase(() => firestore ? collection(firestore, 'training_centers') : null, [firestore]);
    
    const { data: courses, isLoading: coursesLoading } = useCollection<Course>(coursesRef);
    const { data: centers, isLoading: centersLoading } = useCollection<TrainingCenter>(centersRef);
    
    const isLoading = coursesLoading || centersLoading;
    
    const handleEditCourse = (course: Course) => {
        setSelectedCourse(course);
        setDialogMode('edit');
        setDialogOpen(true);
    };
    
    const handleDeleteCourse = async (course: Course) => {
        if (!firestore) return;
        
        try {
            await deleteDoc(doc(firestore, 'courses', course.id));
            toast({
                title: "Formation supprimée",
                description: `${course.title} a été supprimée avec succès.`,
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer la formation.",
                variant: "destructive"
            });
        }
    };
    
    const handleAddCourse = () => {
        setSelectedCourse(null);
        setDialogMode('create');
        setDialogOpen(true);
    };

    const centersById = useMemo(() => {
        if (!centers) return new Map();
        return centers.reduce((acc, center) => {
          acc.set(center.id, center);
          return acc;
        }, new Map<string, TrainingCenter>());
    }, [centers]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-headline">Gestion des Formations</h1>
                 <Button onClick={handleAddCourse}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une formation
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Toutes les formations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titre de la Formation</TableHead>
                                <TableHead>Centre</TableHead>
                                <TableHead>Durée</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({length: 4}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                courses?.map(course => {
                                    const center = centersById.get(course.centerId);
                                    return (
                                        <TableRow key={course.id}>
                                            <TableCell className="font-medium">{course.title}</TableCell>
                                            <TableCell>
                                                <Link href={`/training/${center?.id}`} className="hover:underline">
                                                    {center?.name || 'Inconnu'}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{course.duration}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Ouvrir le menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditCourse(course)}>Modifier</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                                                            onClick={() => handleDeleteCourse(course)}
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
            
            <CourseFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                course={selectedCourse}
                mode={dialogMode}
                centers={centers || []}
            />
        </div>
    );
}
