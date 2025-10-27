
"use client";

import { ProductCard } from "@/components/product-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Artisan, Order, Product } from "@/lib/types";
import { MapPin, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { seedData } from "@/lib/seed";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/firebase";

function ArtisanOrders({ artisanId }: { artisanId: string }) {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const artisanOrders = seedData.orders?.filter(o => o.artisanId === artisanId);
    setOrders(artisanOrders);
    setIsLoading(false);
  }, [artisanId]);

  const isOwner = user?.uid === artisanId;

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
      toast({
          title: "Action non disponible (Démo)",
          description: "La mise à jour du statut est désactivée en mode démo.",
      });
  };

  if (isLoading) {
    return <p>Chargement des commandes...</p>
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="text-center py-12 text-muted-foreground">
        <CardContent>
          <p>Aucune commande pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Commandes Reçues</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => {
                let formattedDate = 'Date invalide';
                try {
                    const date = new Date(order.orderDate);
                    formattedDate = format(date, 'd MMM yyyy', { locale: fr });
                 } catch (e) {
                    console.error("Error formatting date: ", order.orderDate)
                 }

               return(
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.productName}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>
                      {isOwner ? (
                         <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="shipped">Expédiée</SelectItem>
                                <SelectItem value="delivered">Livrée</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={order.status === 'pending' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
               )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function ArtisanProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [artisan, setArtisan] = useState<Artisan | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    const foundArtisan = seedData.artisans.find(a => a.id === id);
    setArtisan(foundArtisan);
    if(foundArtisan) {
      const foundProducts = seedData.products.filter(p => p.artisanId === foundArtisan.id);
      setProducts(foundProducts);
    }
    setIsLoading(false);
  }, [id]);


  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 text-center">Chargement du profil...</div>
  }

  if (!artisan) {
    notFound();
  }

  const profileImage = PlaceHolderImages.find(p => p.id === artisan.profileImageId);
  const bannerImage = PlaceHolderImages.find(p => p.imageHint?.includes("workshop"));

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <Card className="overflow-hidden shadow-lg bg-card/80 backdrop-blur-sm">
        <div className="relative h-48 md:h-64 bg-muted">
          {bannerImage && (
            <Image
              src={bannerImage.imageUrl.replace('/1080', '/1200/400')}
              alt={`${artisan.name}'s workshop`}
              fill
              className="object-cover"
              data-ai-hint="artisan workshop"
            />
          )}
           <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-24 md:-mt-32 relative z-10">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background ring-2 ring-primary">
              {profileImage && <AvatarImage src={profileImage.imageUrl} alt={artisan.name} />}
              <AvatarFallback className="text-4xl">{artisan.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left md:mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mt-4 md:mt-0">
                  <h1 className="text-3xl font-bold font-headline">{artisan.name}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-1">
                    <Badge variant="default">{artisan.craft}</Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4"/>
                      <span>{artisan.province}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-4 sm:mt-0">
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
            </div>
          </div>
            <p className="mt-6 text-muted-foreground text-center md:text-left">{artisan.bio}</p>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Tabs defaultValue="shop">
          <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto">
            <TabsTrigger value="shop">Boutique ({products?.length || 0})</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="about">À Propos</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
          </TabsList>
          <TabsContent value="shop" className="mt-6">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
                <Card className="text-center py-12 text-muted-foreground">
                   <CardContent>
                    <p>Cette boutique est vide pour le moment.</p>
                   </CardContent>
                </Card>
            )}
          </TabsContent>
           <TabsContent value="orders" className="mt-6">
            <ArtisanOrders artisanId={id} />
          </TabsContent>
          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Plus d'informations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Informations détaillées sur le parcours, les techniques et les inspirations de {artisan.name}.</p>
                 <div className="text-center py-12 text-muted-foreground">
                    <p>Aucune information supplémentaire pour le moment.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
             <Card>
              <CardHeader>
                <CardTitle className="font-headline">Avis des clients</CardTitle>
              </CardHeader>
              <CardContent>
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
