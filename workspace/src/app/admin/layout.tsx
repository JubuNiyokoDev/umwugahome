
"use client";

import { Logo } from "@/components/logo";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import {
  BarChart,
  Briefcase,
  Home,
  School,
  Settings,
  Users,
  Bug,
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/types";
import { doc } from "firebase/firestore";
import React from "react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: <Home />, exact: true },
  { href: "/admin/users", label: "Utilisateurs", icon: <Users /> },
  { href: "/admin/artisans", label: "Artisans", icon: <Briefcase /> },
  { href: "/admin/training", label: "Formations", icon: <School /> },
  { href: "/admin/analytics", label: "Statistiques", icon: <BarChart /> },
  { href: "/admin/settings", label: "Paramètres", icon: <Settings /> },
];

const devLinks = [
    { href: "/seed", label: "Debug & Seed", icon: <Bug /> },
]

function AdminProtectionLayer({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const userProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    React.useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login?redirect=/admin');
        }
    }, [isUserLoading, user, router]);

    if (isUserLoading || isProfileLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (userProfile?.role !== 'admin') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
                <Shield className="h-12 w-12 text-destructive" />
                <h1 className="text-2xl font-bold">Accès Refusé</h1>
                <p className="text-muted-foreground">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
                <Button asChild>
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        );
    }
    
    return <>{children}</>;
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  const userProfileRef = useMemoFirebase(() => (user && useFirestore()) ? doc(useFirestore(), 'users', user.uid) : null, [user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const checkIsActive = (href: string, exact = false) => {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <AdminProtectionLayer>
        <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
            <Logo />
            </SidebarHeader>
            <SidebarContent>
            <SidebarMenu>
                {navLinks.map(link => (
                    <SidebarMenuItem key={link.href}>
                        <SidebarMenuButton
                            asChild
                            isActive={checkIsActive(link.href, link.exact)}
                            tooltip={link.label}
                        >
                            <Link href={link.href}>
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>

            <SidebarSeparator />
            
            <SidebarGroup>
                <SidebarGroupLabel>Développement</SidebarGroupLabel>
                <SidebarMenu>
                {devLinks.map(link => (
                        <SidebarMenuItem key={link.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={checkIsActive(link.href)}
                                tooltip={link.label}
                            >
                            <Link href={link.href}>
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroup>

            </SidebarContent>
            {user && (
            <SidebarFooter>
                <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent">
                <Avatar className="h-9 w-9">
                    {userProfile?.profileImageId && <AvatarImage src={user.photoURL || `/images/${userProfile.profileImageId}.jpg`} />}
                    <AvatarFallback>{userProfile?.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">{userProfile?.name || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                </div>
            </SidebarFooter>
            )}
        </Sidebar>
        <SidebarInset>
            <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <Button asChild variant="outline"><Link href="/">Quitter l'admin</Link></Button>
            </header>
            <div className="p-4 md:p-6">{children}</div>
        </SidebarInset>
        </SidebarProvider>
    </AdminProtectionLayer>
  );
}
