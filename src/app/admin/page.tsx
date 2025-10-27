'use client'

import { StatCard } from "@/components/stat-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Artisan, TrainingCenter, UserProfile } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

  const usersRef = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersRef);

  const artisansRef = useMemoFirebase(() => collection(firestore, 'artisans'), [firestore]);
  const { data: artisans, isLoading: isLoadingArtisans } = useCollection<Artisan>(artisansRef);

  const trainingCentersRef = useMemoFirebase(() => collection(firestore, 'training-centers'), [firestore]);
  const { data: trainingCenters, isLoading: isLoadingCenters } = useCollection<TrainingCenter>(trainingCentersRef);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Tableau de Bord Administrateur</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Utilisateurs" value={isLoadingUsers ? '...' : (users?.length ?? 0).toString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Total Artisans" value={isLoadingArtisans ? '...' : (artisans?.length ?? 0).toString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Total Centres" value={isLoadingCenters ? '...' : (trainingCenters?.length ?? 0).toString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Revenu (30j)" value="1,250,000 FBU" icon={<Users className="h-4 w-4 text-muted-foreground" />} />
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
                />
                <YAxis />
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
              {isLoadingUsers ? <p>Chargement...</p> : users?.slice(0, 5).map((user) => {
                  const userImage = PlaceHolderImages.find(img => img.id === user.profileImageId);
                  return (
                    <div key={user.id} className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        {userImage && <AvatarImage src={userImage?.imageUrl} alt="Avatar" />}
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
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
