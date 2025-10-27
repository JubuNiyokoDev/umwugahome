
'use client';

import { ProductCard } from "@/components/product-card";
import { Artisan, Product } from "@/lib/types";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function EMarketPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const firestore = useFirestore();

  const productsRef = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: allProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsRef);

  const artisansRef = useMemoFirebase(() => firestore ? collection(firestore, 'artisans') : null, [firestore]);
  const { data: allArtisans, isLoading: isLoadingArtisans } = useCollection<Artisan>(artisansRef);

  const isLoading = isLoadingProducts || isLoadingArtisans;

  const artisansById = useMemo(() => {
    if (!allArtisans) return new Map();
    return allArtisans.reduce((acc, artisan) => {
      acc.set(artisan.id, artisan);
      return acc;
    }, new Map<string, Artisan>());
  }, [allArtisans]);
  
  const filteredProducts = useMemo(() => {
    if (!allProducts || !allArtisans) return [];
    return allProducts.filter(product => {
      const artisan = artisansById.get(product.artisanId);
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || (artisan && artisan.craft === category);
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, allArtisans, searchTerm, category, artisansById]);
  
  const categories = useMemo(() => {
    if (!allArtisans) return [];
    const uniqueCategories = [...new Set(allArtisans.map(a => a.craft))].sort();
    return uniqueCategories.filter(c => c && c !== 'À définir');
  }, [allArtisans]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Boutique des Artisans</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Découvrez des produits uniques, faits main avec passion par les artisans du Burundi.
        </p>
      </div>

       <Card className="mb-8 shadow-md bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un produit..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} product={null} />)}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Aucun produit ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}
