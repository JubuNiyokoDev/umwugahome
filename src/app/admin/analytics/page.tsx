
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";
import { UserProfile } from "@/lib/types";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

const salesData = [
  { month: "Jan", sales: 120000 },
  { month: "Fev", sales: 180000 },
  { month: "Mar", sales: 150000 },
  { month: "Avr", sales: 210000 },
  { month: "Mai", sales: 250000 },
  { month: "Juin", sales: 230000 },
];

const userGrowthData = [
  { month: "Jan", users: 50 },
  { month: "Fev", users: 65 },
  { month: "Mar", users: 90 },
  { month: "Avr", users: 110 },
  { month: "Mai", users: 140 },
  { month_full: "Juin", users: 186 },
];


const salesChartConfig = {
  sales: {
    label: "Ventes (FBU)",
    color: "hsl(var(--primary))",
  },
};
const userGrowthChartConfig = {
  users: {
    label: "Utilisateurs",
    color: "hsl(var(--primary))",
  },
};

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];


export default function AdminAnalyticsPage() {
    const firestore = useFirestore();
    
    const usersRef = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
    const { data: users, isLoading } = useCollection<UserProfile>(usersRef);

    const userRolesData = useMemo(() => {
        if (isLoading || !users) return [];
        const rolesCount = users.reduce((acc, user) => {
            const role = user.role.replace('_', ' ');
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(rolesCount).map(([name, value]) => ({ name, value }));
    }, [users, isLoading]);

    const userRolesConfig = useMemo(() => {
      if (!userRolesData) return {};
      return userRolesData.reduce((acc, entry, index) => {
        acc[entry.name] = {
          label: entry.name,
          color: COLORS[index % COLORS.length]
        }
        return acc;
      }, {} as any)
    }, [userRolesData]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Tableau de Bord Analytique</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Croissance des Utilisateurs</CardTitle>
            <CardDescription>Évolution du nombre total d'utilisateurs sur les 6 derniers mois.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={userGrowthChartConfig} className="h-[250px] w-full">
              <LineChart accessibilityLayer data={userGrowthData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  dataKey="users"
                  type="monotone"
                  stroke="var(--color-users)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-users)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Rôles</CardTitle>
            <CardDescription>Distribution des utilisateurs par type de profil.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={userRolesConfig} className="h-[250px] w-full aspect-square">
              <PieChart>
                 <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel hideIndicator/>}
                />
                <Pie
                  data={userRolesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userRolesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Performance des Ventes (E-Market)</CardTitle>
            <CardDescription>Volume des ventes mensuelles sur la plateforme.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={salesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `${Number(value) / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
}
