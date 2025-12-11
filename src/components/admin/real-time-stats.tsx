'use client';

import { StatCard } from "@/components/stat-card";
import { Users, Briefcase, School, ShoppingBag } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { UserProfile, Artisan, TrainingCenter, Product } from "@/lib/types";

export function RealTimeStats() {
  const firestore = useFirestore();
  
  const usersRef = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const artisansRef = useMemoFirebase(() => firestore ? collection(firestore, 'artisans') : null, [firestore]);
  const centersRef = useMemoFirebase(() => firestore ? collection(firestore, 'training_centers') : null, [firestore]);
  const productsRef = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  
  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersRef);
  const { data: artisans, isLoading: artisansLoading } = useCollection<Artisan>(artisansRef);
  const { data: centers, isLoading: centersLoading } = useCollection<TrainingCenter>(centersRef);
  const { data: products, isLoading: productsLoading } = useCollection<Product>(productsRef);
  
  const isLoading = usersLoading || artisansLoading || centersLoading || productsLoading;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Utilisateurs" 
        value={isLoading ? '...' : (users?.length || 0).toString()} 
        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
      />
      <StatCard 
        title="Total Artisans" 
        value={isLoading ? '...' : (artisans?.length || 0).toString()} 
        icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} 
      />
      <StatCard 
        title="Centres de Formation" 
        value={isLoading ? '...' : (centers?.length || 0).toString()} 
        icon={<School className="h-4 w-4 text-muted-foreground" />} 
      />
      <StatCard 
        title="Produits" 
        value={isLoading ? '...' : (products?.length || 0).toString()} 
        icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} 
      />
    </div>
  );
}