import type { Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = PlaceHolderImages.find(p => p.id === product.imageId);
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

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
        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
        <p className="font-bold text-lg mt-2 text-primary">{product.price.toLocaleString('fr-FR')} FBU</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}
