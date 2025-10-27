
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Award, Calendar, Newspaper, Camera, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const laureates = [
  {
    year: 2023,
    name: "Aline Niyonsaba",
    category: "Vannerie d'Excellence",
    profileImageId: "award-laureate-1",
    achievement: "Pour sa contribution exceptionnelle à la préservation des techniques de tressage traditionnelles et son approche innovante du design."
  },
  {
    year: 2023,
    name: "Jean-Claude Bizimana",
    category: "Innovation en Maroquinerie",
    profileImageId: "award-laureate-2",
    achievement: "Pour l'introduction de designs modernes dans la maroquinerie burundaise tout en maintenant une qualité de fabrication artisanale."
  },
  {
    year: 2022,
    name: "Marie Goretti Uwizeye",
    category: "Maîtrise de la Poterie",
    profileImageId: "award-laureate-3",
    achievement: "Récompensée pour sa maîtrise technique et l'originalité de ses créations en céramique, inspirées de la nature du Burundi."
  }
];

const galleryImages = [
  PlaceHolderImages.find(p => p.id === 'event-1'),
  PlaceHolderImages.find(p => p.id === 'event-2'),
  PlaceHolderImages.find(p => p.id === 'event-3'),
  PlaceHolderImages.find(p => p.id === 'event-4'),
  PlaceHolderImages.find(p => p.id === 'event-5'),
  PlaceHolderImages.find(p => p.id === 'event-6'),
].filter(Boolean) as typeof PlaceHolderImages;


export default function AwardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-4 text-center mb-12"
      >
        <div className="inline-block bg-primary/10 p-4 rounded-full">
           <Award className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Umwuga Award</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Célébrer l'excellence, l'innovation et la transmission du savoir-faire dans l'artisanat burundais.
        </p>
      </motion.div>

       <Tabs defaultValue="laureates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="history"><Calendar className="mr-2 h-4 w-4"/>Historique</TabsTrigger>
          <TabsTrigger value="laureates"><Award className="mr-2 h-4 w-4"/>Lauréats</TabsTrigger>
          <TabsTrigger value="gallery"><Camera className="mr-2 h-4 w-4"/>Galerie</TabsTrigger>
          <TabsTrigger value="news"><Newspaper className="mr-2 h-4 w-4"/>Actualités</TabsTrigger>
          <TabsTrigger value="register"><Edit className="mr-2 h-4 w-4"/>Participer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">L'Histoire de l'Umwuga Award</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>Lancé en 2022, l'Umwuga Award est une initiative visant à reconnaître et à célébrer les artisans les plus talentueux et innovants du Burundi. Notre mission est de mettre en lumière le savoir-faire exceptionnel, d'encourager la créativité et de promouvoir l'artisanat burundais sur la scène nationale et internationale.</p>
                    <p>Chaque année, un jury d'experts se réunit pour récompenser les artisans qui se sont distingués par leur excellence technique, l'originalité de leurs créations et leur impact sur la communauté. L'Umwuga Award est plus qu'un prix, c'est un label de qualité et un tremplin pour les artisans d'exception.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="laureates" className="mt-8">
           <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {laureates.map((laureate, index) => {
              const profileImage = PlaceHolderImages.find(p => p.id === laureate.profileImageId);
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <Avatar className="w-24 h-24 border-4 border-primary">
                                {profileImage && <AvatarImage src={profileImage.imageUrl} alt={laureate.name} />}
                                <AvatarFallback className="text-3xl">{laureate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-primary">{laureate.year} - {laureate.category}</p>
                                <CardTitle className="text-3xl font-headline mt-1">{laureate.name}</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                        {laureate.achievement}
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>

         <TabsContent value="gallery" className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Galerie des Cérémonies</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryImages.map((image, index) => (
                           <motion.div key={index} variants={itemVariants} className="overflow-hidden rounded-lg">
                             <Image 
                                src={image.imageUrl} 
                                alt={image.description} 
                                width={400} 
                                height={400} 
                                className="object-cover aspect-square w-full h-full hover:scale-105 transition-transform duration-300"
                                data-ai-hint={image.imageHint}
                             />
                           </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
         <TabsContent value="news" className="mt-8">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Actualités</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="border-b pb-4">
                        <h3 className="font-semibold">Lancement des inscriptions pour l'édition 2024</h3>
                        <p className="text-sm text-muted-foreground">Les candidatures pour la prochaine édition de l'Umwuga Award sont maintenant ouvertes. Date limite : 31 Octobre 2024.</p>
                   </div>
                    <div className="border-b pb-4">
                        <h3 className="font-semibold">Retour sur la cérémonie de 2023</h3>
                        <p className="text-sm text-muted-foreground">Revivez les moments forts de la dernière cérémonie qui a vu couronner Aline Niyonsaba et Jean-Claude Bizimana.</p>
                   </div>
                    <div>
                        <h3 className="font-semibold">Partenariat avec la Chambre de Commerce</h3>
                        <p className="text-sm text-muted-foreground">L'Umwuga Award est fier d'annoncer un nouveau partenariat pour accompagner les lauréats à l'export.</p>
                   </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="register" className="mt-8">
             <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Participez à l'édition 2024</CardTitle>
                    <p className="text-muted-foreground max-w-lg mx-auto">Vous êtes un artisan talentueux ? Vous repoussez les limites de votre art ? Tentez votre chance et devenez le prochain lauréat de l'Umwuga Award.</p>
                </CardHeader>
                <CardContent className="text-center">
                    <Button size="lg">
                        <Edit className="mr-2 h-5 w-5" />
                        Soumettre ma candidature
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
