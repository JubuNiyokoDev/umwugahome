"use client";

import { ProductCard } from "@/components/product-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDoc, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Artisan, Product } from "@/lib/types";
import { collection, doc, query, where } from "firebase/firestore";
import { MapPin, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function ArtisanProfilePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();

  const artisanRef = useMemoFirebase(() => firestore ? doc(firestore, 'artisans', params.id) : null, [firestore, params.id]);
  const { data: artisan, isLoading: isLoadingArtisan } = useDoc<Artisan>(artisanRef);

  const productsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'products'), where('artisanId', '==', params.id)) : null, [firestore, params.id]);
  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  if (isLoadingArtisan) {
    return <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 text-center">Chargement du profil...</div>
  }

  if (!artisan) {
    notFound();
  }

  const profileImage = PlaceHolderImages.find(p => p.id === artisan.profileImageId);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <Card className="overflow-hidden shadow-lg bg-card/80 backdrop-blur-sm">
        <div className="relative h-48 md:h-64 bg-muted">
          {profileImage && (
            <Image
              src={profileImage.imageUrl.replace('/400/400', '/1200/400')}
              alt={`${artisan.name}'s workshop`}
              fill
              className="object-cover"
              data-ai-hint="artisan workshop"
            />
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6 -mt-20">
            <Avatar className="w-32 h-32 border-4 border-background ring-2 ring-primary">
              {profileImage && <AvatarImage src={profileImage.imageUrl} alt={artisan.name} />}
              <AvatarFallback>{artisan.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold font-headline">{artisan.name}</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="default">{artisan.craft}</Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4"/>
                      <span>{artisan.province}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-primary fill-primary" />
                        <span className="text-lg font-bold">{artisan.rating}</span>
                    </div>
                    <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter
                    </Button>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{artisan.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Tabs defaultValue="shop">
          <TabsList>
            <TabsTrigger value="shop">Boutique</TabsTrigger>
            <TabsTrigger value="about">À Propos</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
          </TabsList>
          <TabsContent value="shop" className="mt-6">
            {isLoadingProducts && <p>Chargement des produits...</p>}
            {!isLoadingProducts && products && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            {!isLoadingProducts && (!products || products.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Cette boutique est vide pour le moment.</p>
                </div>
            )}
          </TabsContent>
          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Plus d'informations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Informations détaillées sur le parcours, les techniques et les inspirations de {artisan.name}.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Avis des clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Découvrez ce que les clients disent de {artisan.name}.</p>
                <div className="text-center py-12 text-muted-foreground">
                    <p>Aucun avis pour le moment.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
