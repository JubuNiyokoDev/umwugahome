
'use client'

import { StatCard } from "@/components/stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UserProfile } from "@/lib/types";
import { Briefcase, School, Users, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { useMemo } from "react";

const chartData = [
  { month: "Janvier", users: 186 },
  { month: "Février", users: 305 },
  { month: "Mars", users: 237 },
  { month: "Avril", users: 173 },
  { month: "Mai", users: 209 },
  { month: "Juin", users: 214 },
];

const chartConfig = {
  users: {
    label: "Nouveaux utilisateurs",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboardPage() {
    const firestore = useFirestore();

    const usersRef = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersRef);
    
    const artisansRef = useMemoFirebase(() => firestore ? collection(firestore, 'artisans') : null, [firestore]);
    const { data: artisans, isLoading: isLoadingArtisans } = useCollection(artisansRef);

    const centersRef = useMemoFirebase(() => firestore ? collection(firestore, 'training-centers') : null, [firestore]);
    const { data: centers, isLoading: isLoadingCenters } = useCollection(centersRef);

    const isLoading = isLoadingUsers || isLoadingArtisans || isLoadingCenters;

    const recentUsers = useMemo(() => {
        if (!users) return [];
        // Assuming users are ordered by creation date, which is not guaranteed without an explicit order.
        // For this demo, we'll just slice the array.
        return users.slice(0, 5);
    }, [users]);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Tableau de Bord Administrateur</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Utilisateurs" value={isLoading ? '...' : (users?.length || 0).toString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Total Artisans" value={isLoading ? '...' : (artisans?.length || 0).toString()} icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Total Centres" value={isLoading ? '...' : (centers?.length || 0).toString()} icon={<School className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Revenu (30j)" value="1,250,000 FBU" icon={<Wallet className="h-4 w-4 text-muted-foreground" />} description="+5% vs mois dernier"/>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Inscriptions</CardTitle>
            <CardDescription>Nouveaux utilisateurs des 6 derniers mois.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="users" fill="var(--color-users)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Utilisateurs Récents</CardTitle>
            <CardDescription>Les derniers utilisateurs inscrits.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? 
                Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))
               : recentUsers?.map((user) => {
                  const userImage = PlaceHolderImages.find(img => img.id === user.profileImageId);
                  return (
                    <div key={user.id} className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        {userImage && <AvatarImage src={userImage?.imageUrl} alt="Avatar" />}
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{user.role.replace('_', ' ')}</Badge>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Aline Niyonsaba</TableCell>
                    <TableCell>a ajouté un nouveau produit: "Panier en jonc"</TableCell>
                    <TableCell>Il y a 5 minutes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Eliane Nshimirimana</TableCell>
                    <TableCell>s'est inscrite à la formation: "Coupe et Couture"</TableCell>
                    <TableCell>Il y a 2 heures</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Jean-Claude Bizimana</TableCell>
                    <TableCell>a mis à jour son profil</TableCell>
                    <TableCell>Hier</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
          </CardContent>
        </Card>
    </div>
  );
}
