
'use client'

import { ArtisanCard } from "@/components/artisan-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { StatCard } from "@/components/stat-card";
import { TrainingCenterCard } from "@/components/training-center-card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Artisan, Course, TrainingCenter, Mentor } from "@/lib/types";
import { Award, Briefcase, School, Users, Rocket, Handshake, Newspaper, UserPlus, FileSignature, HandCoins } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { seedData } from "@/lib/seed";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


export default function Home() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [trainingCenters, setTrainingCenters] = useState<TrainingCenter[]>([]);
  const [allArtisans, setAllArtisans] = useState<Artisan[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allMentors, setAllMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from seed
    setArtisans(seedData.artisans.slice(0, 4));
    setTrainingCenters(seedData.trainingCenters.slice(0, 2));
    setAllArtisans(seedData.artisans);
    setAllCourses(seedData.courses);
    setAllMentors(seedData.mentors);
    setIsLoading(false);
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
  
  const partners = ["Enabel", "MENRS", "CFCIB", "KIT Hub"];

  const newsItems = [
    {
      title: "Les lauréats Umwuga Award 2023 à l'honneur",
      description: "Retour sur une cérémonie riche en émotions qui a récompensé l'excellence de l'artisanat burundais.",
      imageId: "event-1",
      link: "/award"
    },
    {
      title: "Success Story: Aline Niyonsaba",
      description: "Découvrez comment la vannerie a transformé la vie de cette artisane de Gitega, et comment UmwugaHome l'a aidée à exporter ses créations.",
      imageId: "artisan-1",
      link: "/artisans/user-artisan-1"
    },
    {
      title: "Nouvelle formation en Marketing Digital",
      description: "Le Bujumbura Creative Hub lance un nouveau programme pour aider les artisans à mieux vendre en ligne. Inscriptions ouvertes!",
      imageId: "course-4",
      link: "/training"
    }
  ]

  return (
    <div className="flex flex-col min-h-[100dvh] bg-transparent">
      <section className="relative w-full h-[70vh] md:h-[90vh] flex items-center justify-center">
         <div className="absolute inset-0 bg-background/80 z-10" />
        <div className="relative z-20 container mx-auto flex h-full items-center justify-center px-4 text-center md:px-6">
          <motion.div 
            className="flex flex-col items-center space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-headline text-foreground drop-shadow-lg">
              La Maison Digitale des Métiers du Burundi
            </h1>
            <p className="max-w-[700px] text-foreground/80 md:text-xl font-body">
              L'Innovation au Cœur de l'Artisanat Burundais. Connecter les talents, former les générations, bâtir l’avenir.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/artisans"><Rocket className="mr-2" /> Découvrir les Artisans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/training"><School className="mr-2" />Trouver une Formation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section 
        className="w-full py-12 md:py-24 lg:py-32 -mt-16 z-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container px-4 md:px-6">
          <motion.div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8" variants={containerVariants}>
            <motion.div variants={itemVariants}><StatCard title="Artisans Enregistrés" value={isLoading ? '...' : (allArtisans?.length || 0).toString()} icon={<Users className="h-6 w-6" />} /></motion.div>
            <motion.div variants={itemVariants}><StatCard title="Formations Disponibles" value={isLoading ? '...' : (allCourses?.length || 0).toString()} icon={<School className="h-6 w-6" />} /></motion.div>
            <motion.div variants={itemVariants}><StatCard title="Mentorats Actifs" value={isLoading ? '...' : (allMentors?.length || 0).toString()} icon={<Handshake className="h-6 w-6" />} /></motion.div>
            <motion.div variants={itemVariants}><StatCard title="Ventes (30j)" value="1,2M+ FBU" icon={<HandCoins className="h-6 w-6" />} /></motion.div>
          </motion.div>
        </div>
      </motion.section>

       <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent z-20">
        <div className="container px-4 md:px-6">
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Rejoignez-nous</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Que vous soyez un artisan talentueux, un jeune en quête de formation ou un professionnel désireux de partager son savoir, UmwugaHome est votre plateforme.
              </p>
            </div>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <UserPlus className="h-10 w-10 mx-auto text-primary"/>
                  <CardTitle className="font-headline mt-4">Devenir Artisan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Exposez votre savoir-faire, vendez vos créations et touchez un public national et international.</p>
                </CardContent>
                <div className="p-6 pt-0"><Button asChild variant="outline"><Link href="/login?role=artisan">Inscrivez-vous</Link></Button></div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <Handshake className="h-10 w-10 mx-auto text-primary"/>
                  <CardTitle className="font-headline mt-4">Devenir Mentor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Partagez votre expérience et guidez la nouvelle génération d'entrepreneurs et d'artisans.</p>
                </CardContent>
                 <div className="p-6 pt-0"><Button asChild variant="outline"><Link href="/login?role=mentor">Devenez Mentor</Link></Button></div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <FileSignature className="h-10 w-10 mx-auto text-primary"/>
                  <CardTitle className="font-headline mt-4">Participer au Umwuga Award</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Tentez de remporter le prestigieux prix de l'excellence artisanale au Burundi. Faites reconnaître votre talent.</p>
                </CardContent>
                 <div className="p-6 pt-0"><Button asChild><Link href="/award">Soumettre ma candidature</Link></Button></div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent z-20">
        <div className="container px-4 md:px-6">
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Artisans à la Une</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Découvrez le talent et le savoir-faire exceptionnel de nos artisans vedettes.
              </p>
            </div>
          </motion.div>
          <motion.div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <motion.div key={i} variants={itemVariants}><ArtisanCard artisan={null} /></motion.div>)
            ) : (
              artisans?.map(artisan => (
                <motion.div key={artisan.id} variants={itemVariants}>
                  <ArtisanCard artisan={artisan} />
                </motion.div>
              ))
            )}
          </motion.div>
          <div className="flex justify-center">
            <Button asChild variant="outline">
                <Link href="/artisans">Voir tous les artisans</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent z-20">
        <div className="container px-4 md:px-6">
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Actualités & Success Stories</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Plongez au coeur de l'artisanat burundais à travers nos articles et témoignages inspirants.
              </p>
            </div>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => {
              const image = PlaceHolderImages.find(p => p.id === item.imageId);
              return (
                 <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                  <Card className="h-full overflow-hidden">
                    {image && (
                      <div className="aspect-video relative">
                        <Image src={image.imageUrl} alt={item.title} fill className="object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg font-headline">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button asChild variant="link" className="p-0">
                        <Link href={item.link}>Lire la suite</Link>
                      </Button>
                    </div>
                  </Card>
                 </motion.div>
              )
            })}
          </div>

        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent z-20">
        <div className="container px-4 md:px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <MapPlaceholder />
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent z-20">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Centres de Formation Recommandés</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Développez vos compétences avec nos centres de formation partenaires, leaders dans leurs domaines.
              </p>
            </div>
          </motion.div>
          <motion.div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => <motion.div key={i} variants={itemVariants}><TrainingCenterCard center={null} /></motion.div>)
            ) : (
              trainingCenters?.map(center => (
                <motion.div key={center.id} variants={itemVariants}>
                  <TrainingCenterCard center={center} />
                </motion.div>
              ))
            )}
          </motion.div>
           <div className="flex justify-center">
            <Button asChild variant="outline">
                <Link href="/training">Voir toutes les formations</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent z-20">
        <div className="container px-4 md:px-6">
          <h3 className="text-xl font-semibold text-muted-foreground mb-8 text-center">Un projet soutenu par nos partenaires</h3>
          <Carousel
            opts={{ align: "start", loop: true }}
             plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Card className="bg-card/80">
                      <CardContent className="flex items-center justify-center p-6 h-24">
                        <p className="text-2xl font-bold text-foreground">{partner}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </div>
  );
}
