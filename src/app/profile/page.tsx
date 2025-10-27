import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BookMarked, UserPlus } from "lucide-react";
import { notFound } from "next/navigation";

export default function ProfilePage() {
    const user = users.find(u => u.role === 'student');

    if (!user) {
        notFound();
    }

    const profileImage = PlaceHolderImages.find(img => img.id === user.profileImageId);

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="flex flex-col items-center p-6 text-center">
                            <Avatar className="w-32 h-32 mb-4">
                                {profileImage && <AvatarImage src={profileImage.imageUrl} alt={user.name} />}
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-2xl font-bold font-headline">{user.name}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                            <Badge className="mt-2" variant="outline">Jeune / Étudiant</Badge>
                            <Button className="mt-4 w-full">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Se connecter avec un mentor
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Mes Intérêts</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {user.interests.map(interest => (
                                <Badge key={interest} variant="secondary">{interest}</Badge>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <BookMarked className="h-5 w-5" />
                                Formations et Mentorat
                            </CardTitle>
                            <CardDescription>
                                Suivez vos progrès dans les formations et les sessions de mentorat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="text-center py-12 text-muted-foreground">
                            <p>Vous n'êtes inscrit à aucune formation pour le moment.</p>
                            <Button variant="link" className="mt-2">Explorer les formations</Button>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
