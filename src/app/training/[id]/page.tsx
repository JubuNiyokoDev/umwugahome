
'use client';

import { CourseCard } from "@/components/course-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Course, TrainingCenter } from "@/lib/types";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useCollection, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, query, where } from "firebase/firestore";

export default function TrainingCenterPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();

  const centerRef = useMemoFirebase(() => firestore ? doc(firestore, 'training-centers', params.id) : null, [firestore, params.id]);
  const { data: center, isLoading: isLoadingCenter } = useDoc<TrainingCenter>(centerRef);

  const coursesRef = useMemoFirebase(() => {
      if (!firestore || !params.id) return null;
      return query(collection(firestore, 'courses'), where('centerId', '==', params.id));
  }, [firestore, params.id]);
  const { data: courses, isLoading: isLoadingCourses } = useCollection<Course>(coursesRef);
  
  const isLoading = isLoadingCenter || isLoadingCourses;

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 text-center">Chargement du centre...</div>
  }

  if (!center) {
    notFound();
  }

  const centerImage = PlaceHolderImages.find(p => p.id === center.imageId);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <Card className="overflow-hidden shadow-lg bg-card/80 backdrop-blur-sm">
        <div className="relative h-48 md:h-64 bg-muted">
           {centerImage && (
            <Image
              src={centerImage.imageUrl.replace('/1080', '/1200/400')}
              alt={`${center.name}`}
              fill
              className="object-cover"
              data-ai-hint={centerImage.imageHint}
            />
          )}
           <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
        </div>
        <CardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-10">
            <div className="flex-1 text-center md:text-left">
               <Badge variant="secondary" className="mb-2">Centre de Formation</Badge>
              <h1 className="text-3xl font-bold font-headline">{center.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                 <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4"/>
                    <span>{center.province}</span>
                  </div>
                 <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="text-lg font-bold">{center.rating}</span>
                </div>
              </div>
            </div>
          </div>
            <p className="mt-4 text-muted-foreground text-center md:text-left">{center.description}</p>
        </CardContent>
      </Card>

      <div className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6 text-center">Programmes de Formation</h2>
        {isLoadingCourses && <p>Chargement des formations...</p>}
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : !isLoadingCourses && (
            <Card className="text-center py-12 text-muted-foreground lg:col-span-2">
                <CardContent>
                 <p>Aucune formation disponible pour le moment.</p>
                </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
