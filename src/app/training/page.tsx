'use client';

import { TrainingCenterCard } from "@/components/training-center-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { TrainingCenter } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

export default function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [province, setProvince] = useState('all');
  const firestore = useFirestore();

  const trainingCentersRef = useMemoFirebase(() => firestore ? collection(firestore, 'training-centers') : null, [firestore]);
  const { data: allTrainingCenters, isLoading } = useCollection<TrainingCenter>(trainingCentersRef);

  const filteredTrainingCenters = useMemo(() => {
    if (!allTrainingCenters) return [];
    return allTrainingCenters.filter(center => {
      const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvince = province === 'all' || center.province === province;
      return matchesSearch && matchesProvince;
    });
  }, [allTrainingCenters, searchTerm, province]);
  
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
                placeholder="Rechercher une formation ou un centre..." 
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
            {Array.from({ length: 6 }).map((_, i) => <TrainingCenterCard key={i} center={null} />)}
        </div>
      ) : filteredTrainingCenters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredTrainingCenters.map(center => (
            <TrainingCenterCard key={center.id} center={center} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Aucun centre de formation ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}