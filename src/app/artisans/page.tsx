

'use client';

import { ArtisanCard } from "@/components/artisan-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Artisan } from "@/lib/types";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function ArtisansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [province, setProvince] = useState('all');
  
  const firestore = useFirestore();
  const artisansRef = useMemoFirebase(() => firestore ? collection(firestore, 'artisans') : null, [firestore]);
  const { data: allArtisans, isLoading } = useCollection<Artisan>(artisansRef);

  const filteredArtisans = useMemo(() => {
    if (!allArtisans) return [];
    return allArtisans.filter(artisan => {
      const matchesSearch = artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) || artisan.craft.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvince = province === 'all' || artisan.province === province;
      return matchesSearch && matchesProvince;
    });
  }, [allArtisans, searchTerm, province]);

  
  const provinces = useMemo(() => {
    if (!allArtisans) return [];
    const artisanProvinces = allArtisans?.map(a => a.province) || [];
    const uniqueProvinces = [...new Set(artisanProvinces)].sort();
    return uniqueProvinces.filter(p => p && p !== "À définir");
  }, [allArtisans]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Nos Artisans</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Découvrez le talent et le savoir-faire des artisans du Burundi.
        </p>
      </div>

      <Card className="mb-8 shadow-md bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par métier ou nom..." 
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

      
          {isLoading ? 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {Array.from({ length: 12 }).map((_, i) => <ArtisanCard key={i} artisan={null} />)}
            </div> : 
           filteredArtisans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {filteredArtisans.map(artisan => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>Aucun artisan ne correspond à votre recherche.</p>
            </div>
          )}
    </div>
  );
}
