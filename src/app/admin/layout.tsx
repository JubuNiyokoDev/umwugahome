
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
import { useUser } from "@/firebase";
import {
  BarChart,
  Briefcase,
  Home,
  School,
  Settings,
  Users,
  Bug,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: <Home />, exact: true },
  { href: "/admin/users", label: "Utilisateurs", icon: <Users /> },
  { href: "/admin/artisans", label: "Artisans", icon: <Briefcase /> },
  { href: "/admin/training", label: "Formations", icon: <School /> },
  { href: "/admin/analytics", label: "Statistiques", icon: <BarChart /> },
  { href: "/admin/settings", label: "Paramètres", icon: <Settings /> },
];

const devLinks = [
    { href: "/admin/debug", label: "Debug & Seed", icon: <Bug /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  const adminImage = user ? PlaceHolderImages.find(img => img.id === 'student-profile-1') : null;

  const checkIsActive = (href: string, exact = false) => {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
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
                {adminImage && <AvatarImage src={user.photoURL || adminImage.imageUrl} />}
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate">{user.displayName || 'Admin'}</p>
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
  );
}
