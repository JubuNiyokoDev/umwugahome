
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Mentor } from "@/lib/types";
import { Award, Briefcase, GraduationCap, MapPin, MessageCircle, Star } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { seedData } from "@/lib/seed";
import { useEffect, useState } from "react";

export default function MentorProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [mentor, setMentor] = useState<Mentor | undefined | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    const foundMentor = seedData.mentors.find(m => m.id === id);
    setMentor(foundMentor);
    setIsLoading(false);
  }, [id]);


   if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-8">
                     <div className="flex flex-col md:flex-row items-center gap-8">
                        <Skeleton className="h-40 w-40 rounded-full" />
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                         <Skeleton className="h-16 w-full" />
                         <Skeleton className="h-24 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  if (!mentor) {
    notFound();
  }

  const profileImage = PlaceHolderImages.find(p => p.id === mentor.profileImageId);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Card className="w-full max-w-4xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <Avatar className="w-40 h-40 border-4 border-primary">
                        {profileImage && <AvatarImage src={profileImage.imageUrl} alt={mentor.name} />}
                        <AvatarFallback className="text-5xl">{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold font-headline">{mentor.name}</h1>
                        <p className="text-xl text-primary font-semibold mt-1">{mentor.expertise}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{mentor.province}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4" />
                                <span>{mentor.rating} (23 avis)</span>
                            </div>
                        </div>
                        <Button className="mt-4" size="lg">
                            <MessageCircle className="mr-2 h-5 w-5"/>
                            Demander une session
                        </Button>
                    </div>
                </div>

                <div className="mt-12 space-y-8">
                    <div>
                        <h2 className="text-2xl font-headline font-bold mb-3 flex items-center gap-2"><Briefcase/> À Propos de Moi</h2>
                        <p className="text-muted-foreground leading-relaxed">
                           {mentor.bio}
                        </p>
                    </div>

                     <div>
                        <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Award/> Domaines d'Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{mentor.expertise}</Badge>
                            <Badge variant="outline">Plan d'affaires</Badge>
                            <Badge variant="outline">Marketing Digital</Badge>
                            <Badge variant="outline">Gestion Financière</Badge>
                            <Badge variant="outline">Accès au Marché</Badge>
                        </div>
                    </div>
                    
                     <div>
                        <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><GraduationCap/> Mon Parcours</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>+15 ans dans le commerce international.</li>
                            <li>Fondateur de "Burundi Export Consulting".</li>
                            <li>Certifié en coaching d'affaires par l'Institut de Coaching de Genève.</li>
                            <li>A accompagné plus de 50 PME et artisans vers l'exportation.</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
