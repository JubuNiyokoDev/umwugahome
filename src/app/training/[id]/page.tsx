import { CourseCard } from "@/components/course-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trainingCenters } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function TrainingCenterPage({ params }: { params: { id: string } }) {
  const center = trainingCenters.find(c => c.id === params.id);

  if (!center) {
    notFound();
  }

  const centerImage = PlaceHolderImages.find(p => p.id === center.imageId);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {centerImage && (
              <div className="relative w-full md:w-1/3 h-64 md:h-auto rounded-lg overflow-hidden">
                <Image
                  src={centerImage.imageUrl}
                  alt={center.name}
                  fill
                  className="object-cover"
                  data-ai-hint={centerImage.imageHint}
                />
              </div>
            )}
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">Centre de Formation</Badge>
              <h1 className="text-3xl font-bold font-headline">{center.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                 <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4"/>
                    <span>{center.province}</span>
                  </div>
                 <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="text-lg font-bold">{center.rating}</span>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{center.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6">Programmes de Formation</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {center.courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
          {center.courses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground lg:col-span-2">
                <p>Aucune formation disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
