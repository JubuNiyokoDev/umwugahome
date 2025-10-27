
'use client';
import type { Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { useAuth, useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product | null;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();


  if (!product) {
    return (
       <Card className="flex flex-col overflow-hidden h-full">
        <Skeleton className="h-48 w-full" />
        <CardContent className="flex-grow p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-5 w-1/3" />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }
  
  const handleAddToCart = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour passer une commande.",
      });
      router.push('/login');
      return;
    }
    if (!firestore) return;

    const ordersRef = collection(firestore, 'orders');
    addDocumentNonBlocking(ordersRef, {
        artisanId: product.artisanId,
        productId: product.id,
        productName: product.name,
        customerId: user.uid,
        customerName: user.displayName,
        orderDate: serverTimestamp(),
        status: 'pending'
    });

    toast({
      title: "Commande passée !",
      description: `Votre commande pour "${product.name}" a été transmise à l'artisan.`,
    });
  };

  const image = PlaceHolderImages.find(p => p.id === product.imageId);

  return (
    <Card className="overflow-hidden group bg-card/80 backdrop-blur-sm">
      <div className="relative h-48 w-full bg-muted">
        {image && (
          <Image
            src={image.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={image.imageHint}
          />
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-headline font-semibold truncate">{product.name}</h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <p className="font-bold text-lg mt-2 text-primary">{product.price.toLocaleString('fr-FR')} FBU</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Commander
        </Button>
      </CardFooter>
    </Card>
  );
}

    