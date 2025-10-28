

"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, User, LogOut, Loader2, ShieldCheck, Award } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeSwitcher } from "../theme-switcher";
import { useAuth, useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User as UserIcon } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { doc } from "firebase/firestore";
import { Suspense } from "react";


const navLinks = [
  { href: "/", label: "Accueil", exact: true },
  { href: "/artisans", label: "Artisans" },
  { href: "/e-market", label: "Boutique" },
  { href: "/training", label: "Formations" },
  { href: "/mentors", label: "Mentors" },
  { href: "/award", label: "Umwuga Award" },
];


function UserNav() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="h-10 w-10 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button asChild variant="outline" className="hidden md:flex gap-2">
        <Link href="/login">
          <User className="h-4 w-4"/>
          Connexion
        </Link>
      </Button>
    );
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>
                {userProfile ? userProfile.name.charAt(0) : <UserIcon className="h-5 w-5 text-muted-foreground" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userProfile?.name || user.displayName || 'Utilisateur'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
              <Link href="/profile"><User className="mr-2 h-4 w-4" />Profil</Link>
          </DropdownMenuItem>
            {userProfile?.role === 'admin' && (
            <DropdownMenuItem asChild>
              <Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin</Link>
            </DropdownMenuItem>
            )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  
  const checkIsActive = (href: string, exact = false) => {
    if (href === '/marketplace' && pathname.startsWith('/artisans')) return true;
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                checkIsActive(link.href, link.exact) ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
           <Suspense fallback={<div className="h-10 w-10 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>}>
              <UserNav />
           </Suspense>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95">
              <div className="flex flex-col gap-6 p-6">
                <Logo />
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                         checkIsActive(link.href, link.exact) ? "text-primary font-semibold" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                 {!user && <Button asChild>
                  <Link href="/login">Connexion</Link>
                </Button>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
