
'use client'

import { ArtisanCard } from "@/components/artisan-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { StatCard } from "@/components/stat-card";
import { TrainingCenterCard } from "@/components/training-center-card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Artisan, Course, TrainingCenter } from "@/lib/types";
import { Award, Briefcase, School, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, limit, query } from "firebase/firestore";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');
  const firestore = useFirestore();

  const featuredArtisansRef = useMemoFirebase(() => firestore ? query(collection(firestore, 'artisans'), limit(4)) : null, [firestore]);
  const { data: artisans, isLoading: isLoadingArtisans } = useCollection<Artisan>(featuredArtisansRef);
  
  const featuredCentersRef = useMemoFirebase(() => firestore ? query(collection(firestore, 'training-centers'), limit(2)) : null, [firestore]);
  const { data: trainingCenters, isLoading: isLoadingCenters } = useCollection<TrainingCenter>(featuredCentersRef);
  
  const allArtisansRef = useMemoFirebase(() => firestore ? collection(firestore, 'artisans') : null, [firestore]);
  const {data: allArtisans, isLoading: isLoadingAllArtisans} = useCollection<Artisan>(allArtisansRef);

  const allCoursesRef = useMemoFirebase(() => firestore ? collection(firestore, 'courses') : null, [firestore]);
  const {data: allCourses, isLoading: isLoadingAllCourses} = useCollection<Course>(allCoursesRef);

  const allCentersRef = useMemoFirebase(() => firestore ? collection(firestore, 'training-centers') : null, [firestore]);
  const {data: allCenters, isLoading: isLoadingAllCenters} = useCollection<TrainingCenter>(allCentersRef);

  const isLoadingStats = isLoadingAllArtisans || isLoadingAllCourses || isLoadingAllCenters;

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
  
  const isLoading = isLoadingArtisans || isLoadingCenters;

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[70vh] md:h-[90vh]">
        {heroImage && (
            <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover opacity-10"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative container mx-auto flex h-full items-center justify-center px-4 text-center md:px-6">
          <motion.div 
            className="flex flex-col items-center space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-green-300 drop-shadow-lg">
              UmwugaHome
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl font-body">
              L'Innovation au Cœur de l'Artisanat Burundais. Connecter les talents, former les générations, bâtir l’avenir.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/artisans">Découvrir</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/training">Contact</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section 
        className="w-full py-12 md:py-24 lg:py-32 -mt-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container px-4 md:px-6">
          <motion.div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8" variants={containerVariants}>
            <motion.div variants={itemVariants}><StatCard title="Artisans" value={isLoadingStats ? '...' : (allArtisans?.length || 0).toString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} /></motion.div>
            <motion.div variants={itemVariants}><StatCard title="Formations" value={isLoadingStats ? '...' : (allCourses?.length || 0).toString()} icon={<School className="h-4 w-4 text-muted-foreground" />} /></motion.div>
            <motion.div variants={itemVariants}><StatCard title="Centres" value={isLoadingStats ? '...' : (allCenters?.length || 0).toString()} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} /></motion.div>
            <motion.div variants={itemVariants}><StatCard title="Lauréats Umwuga Award" value="30+" icon={<Award className="h-4 w-4 text-muted-foreground" />} /></motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      <section className="w-full py-12 md:py-24 lg:py-32">
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
          <motion.div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
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

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <MapPlaceholder />
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
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
          <motion.div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-2" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
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
    </div>
  );
}
