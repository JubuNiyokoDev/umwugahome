
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Award } from "lucide-react";

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
        className="space-y-4 text-center mb-16"
      >
        <div className="inline-block bg-primary/10 p-4 rounded-full">
           <Award className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Umwuga Award</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Célébrer l'excellence, l'innovation et la transmission du savoir-faire dans l'artisanat burundais.
        </p>
      </motion.div>

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
    </div>
  );
}
