
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Course, TrainingCenter } from "@/lib/types";
import { collection, orderBy, query } from "firebase/firestore";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useMemo } from "react";

export default function AdminTrainingPage() {
    const firestore = useFirestore();

    const coursesRef = useMemoFirebase(() => firestore ? query(collection(firestore, 'courses'), orderBy('title')) : null, [firestore]);
    const { data: courses, isLoading: isLoadingCourses } = useCollection<Course>(coursesRef);
    
    const centersRef = useMemoFirebase(() => firestore ? query(collection(firestore, 'training-centers')) : null, [firestore]);
    const { data: centers, isLoading: isLoadingCenters } = useCollection<TrainingCenter>(centersRef);

    const centersById = useMemo(() => {
        if (!centers) return new Map();
        return centers.reduce((acc, center) => {
          acc.set(center.id, center);
          return acc;
        }, new Map<string, TrainingCenter>());
    }, [centers]);

    const isLoading = isLoadingCourses || isLoadingCenters;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-headline">Gestion des Formations</h1>
                 <Button disabled>
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
                                                        <DropdownMenuItem disabled>Modifier</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled>
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
        </div>
    );
}
