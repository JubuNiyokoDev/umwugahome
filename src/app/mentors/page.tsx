
'use client';

import { MentorCard } from "@/components/mentor-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Mentor } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expertise, setExpertise] = useState('all');
  const firestore = useFirestore();

  const mentorsRef = useMemoFirebase(() => firestore ? collection(firestore, 'mentors') : null, [firestore]);
  const { data: allMentors, isLoading: isLoadingMentors } = useCollection<Mentor>(mentorsRef);

  const filteredMentors = useMemo(() => {
    if (!allMentors) return [];
    return allMentors.filter(mentor => {
      const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExpertise = expertise === 'all' || mentor.expertise === expertise;
      return matchesSearch && matchesExpertise;
    });
  }, [allMentors, searchTerm, expertise]);
  
  const expertises = useMemo(() => {
    if (!allMentors) return [];
    return [...new Set(allMentors.map(m => m.expertise))].sort();
  }, [allMentors]);

  const isLoading = isLoadingMentors;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Nos Mentors</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Accélérez votre carrière en bénéficiant de l'expérience de nos mentors chevronnés.
        </p>
      </div>

       <Card className="mb-8 shadow-md bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un mentor par nom..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={expertise} onValueChange={setExpertise}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les expertises" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les expertises</SelectItem>
                {expertises.map(e => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {Array.from({ length: 3 }).map((_, i) => <MentorCard key={i} mentor={null} />)}
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredMentors.map(mentor => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Aucun mentor ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}
