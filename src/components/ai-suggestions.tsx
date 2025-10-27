
'use client';

import { useEffect, useState } from "react";
import { getPersonalizedTrainingSuggestions, PersonalizedTrainingSuggestionsOutput } from "@/ai/flows/personalized-training-suggestions";
import { UserProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Lightbulb, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

interface AiSuggestionsProps {
    studentProfile: UserProfile;
}

export function AiSuggestions({ studentProfile }: AiSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<PersonalizedTrainingSuggestionsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!studentProfile.interests || studentProfile.interests.length === 0) {
                setIsLoading(false);
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const profileString = `Student interests: ${studentProfile.interests.join(', ')}.`;
                const result = await getPersonalizedTrainingSuggestions({ studentProfile: profileString });
                setSuggestions(result);
            } catch (err) {
                console.error("Error fetching AI suggestions:", err);
                setError("Impossible de charger les suggestions pour le moment.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [studentProfile]);

    if (isLoading) {
        return (
            <Card className="mt-8 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Suggestions Personnalisées
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {Array.from({length: 2}).map((_, i) => (
                     <div key={i} className="p-4 border rounded-lg space-y-2">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                     </div>
                   ))}
                </CardContent>
            </Card>
        );
    }
    
    if (error) {
         return (
            <Card className="mt-8 bg-card/80 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Suggestions Personnalisées
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive">{error}</p>
                </CardContent>
            </Card>
         )
    }

    if (!suggestions || suggestions.length === 0) {
        return (
             <Card className="mt-8 bg-card/80 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Suggestions Personnalisées
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-muted-foreground">
                    <p>Aucune suggestion pour le moment.</p>
                     <p className="text-sm">Assurez-vous d'avoir ajouté des centres d'intérêt à votre profil.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mt-8 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Suggestions Personnalisées pour Vous
                </CardTitle>
                <CardDescription>
                    Basé sur vos centres d'intérêt, voici quelques formations qui pourraient vous plaire.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <h4 className="font-bold">{suggestion.courseName}</h4>
                        <p className="text-sm text-muted-foreground">au centre <span className="font-semibold text-foreground">{suggestion.trainingCenterName}</span></p>
                        <p className="text-sm mt-2 italic">"{suggestion.reason}"</p>
                         <div className="mt-3 flex justify-between items-center">
                            <div>
                                <span className="text-xs font-semibold text-primary">Pertinence: {suggestion.relevanceScore}%</span>
                                <div className="w-24 h-2 bg-muted rounded-full mt-1">
                                    <div className="h-2 bg-primary rounded-full" style={{ width: `${suggestion.relevanceScore}%` }}></div>
                                </div>
                            </div>
                            <Button asChild variant="secondary" size="sm">
                                <Link href="/training">Voir la formation</Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
