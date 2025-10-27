'use client';

import { useState } from "react";
import { getProfileRecommendations } from "@/ai/flows/enhanced-profile-recommendations";
import { Artisan } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface AiProfileSuggestionsProps {
    artisanProfile: Artisan;
}

export function AiProfileSuggestions({ artisanProfile }: AiProfileSuggestionsProps) {
    const [recommendations, setRecommendations] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        setRecommendations(null);

        try {
            const profileString = `Bio: ${artisanProfile.bio}\nMétier: ${artisanProfile.craft}\nNom: ${artisanProfile.name}`;
            const marketTrends = "Les clients recherchent des produits authentiques, durables et avec une histoire. Le story-telling est clé. Les produits écologiques sont en vogue.";
            const result = await getProfileRecommendations({ artisanProfile: profileString, marketTrends });
            setRecommendations(result.recommendations);
        } catch (err) {
            console.error("Error fetching AI profile recommendations:", err);
            setError("Impossible de générer des recommandations pour le moment.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-card/80 backdrop-blur-sm sticky top-24">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Assistant Profil IA
                </CardTitle>
                <CardDescription>
                    Obtenez des suggestions pour améliorer votre profil et attirer plus de clients.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={handleGetRecommendations} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyse en cours...
                        </>
                    ) : (
                        "Analyser mon profil"
                    )}
                </Button>

                {(error || recommendations) && (
                    <div className="mt-4 border-t pt-4">
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        {recommendations && (
                            <ScrollArea className="h-72">
                                <h4 className="font-semibold mb-2">Recommandations :</h4>
                                <div
                                    className="prose prose-sm dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: recommendations.replace(/\n/g, '<br />') }}
                                />
                            </ScrollArea>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
