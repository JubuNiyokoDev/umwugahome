import { ArtisanCard } from "@/components/artisan-card";
import { MapPlaceholder } from "@/components/map-placeholder";
import { StatCard } from "@/components/stat-card";
import { TrainingCenterCard } from "@/components/training-center-card";
import { Button } from "@/components/ui/button";
import { artisans, trainingCenters } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Award, Briefcase, School, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        {heroImage && (
            <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="relative container mx-auto flex h-full items-end justify-center px-4 text-center md:px-6 pb-12 md:pb-24">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-foreground drop-shadow-lg">
              UmwugaHome
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl font-body">
              La Maison Digitale des Métiers du Burundi. Connecter les talents, former les générations, bâtir l’avenir.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/marketplace">Découvrir les Artisans</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/training">Trouver une Formation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            <StatCard title="Artisans" value="1,200+" icon={<Users className="h-4 w-4 text-muted-foreground" />} />
            <StatCard title="Formations" value="50+" icon={<School className="h-4 w-4 text-muted-foreground" />} />
            <StatCard title="Métiers" value="80+" icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} />
            <StatCard title="Lauréats Umwuga Award" value="30+" icon={<Award className="h-4 w-4 text-muted-foreground" />} />
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Artisans à la Une</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Découvrez le talent et le savoir-faire exceptionnel de nos artisans vedettes.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {artisans.slice(0, 4).map(artisan => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline">
                <Link href="/marketplace">Voir tous les artisans</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <MapPlaceholder />
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Centres de Formation Recommandés</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Développez vos compétences avec nos centres de formation partenaires, leaders dans leurs domaines.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-2">
            {trainingCenters.slice(0, 2).map(center => (
              <TrainingCenterCard key={center.id} center={center} />
            ))}
          </div>
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
