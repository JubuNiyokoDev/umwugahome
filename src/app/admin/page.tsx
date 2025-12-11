
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UserProfile } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { RealTimeStats } from "@/components/admin/real-time-stats";

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
    const { data: users, isLoading } = useCollection<UserProfile>(usersRef);

    const recentUsers = useMemo(() => {
        if (!users) return [];
        return users.slice(0, 5);
    }, [users]);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Tableau de Bord Administrateur</h1>
      
      <RealTimeStats />

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
                  return (
                    <div key={user.id} className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        {user.profileImageId && <AvatarImage src={user.profileImageId} alt="Avatar" />}
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
