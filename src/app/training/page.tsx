
'use client';

import { CourseCard } from "@/components/course-card";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course, TrainingCenter } from "@/lib/types";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { seedData } from "@/lib/seed";

export default function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [province, setProvince] = useState('all');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allTrainingCenters, setAllTrainingCenters] = useState<TrainingCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAllCourses(seedData.courses);
    setAllTrainingCenters(seedData.trainingCenters);
    setIsLoading(false);
  }, []);
  
  const centersById = useMemo(() => {
    if (!allTrainingCenters) return new Map();
    return allTrainingCenters.reduce((acc, center) => {
      acc.set(center.id, center);
      return acc;
    }, new Map<string, TrainingCenter>());
  }, [allTrainingCenters]);

  const filteredCourses = useMemo(() => {
    if (!allCourses || !allTrainingCenters) return [];
    return allCourses.filter(course => {
      const center = centersById.get(course.centerId);
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvince = province === 'all' || (center && center.province === province);
      return matchesSearch && matchesProvince;
    });
  }, [allCourses, allTrainingCenters, searchTerm, province, centersById]);
  
  const provinces = useMemo(() => {
    if (!allTrainingCenters) return [];
    return [...new Set(allTrainingCenters.map(c => c.province))].sort();
  }, [allTrainingCenters]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Espace Formation & Orientation</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Trouvez la formation qui vous convient pour lancer ou faire évoluer votre carrière dans les métiers d'artisanat.
        </p>
      </div>

       <Card className="mb-8 shadow-md bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une formation..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les provinces</SelectItem>
                 {provinces.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden h-full">
                    <Skeleton className="h-40 w-full" />
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="flex-grow space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                </Card>
            ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Aucune formation ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}
