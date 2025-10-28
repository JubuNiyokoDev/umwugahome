'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="text-muted-foreground max-w-md">
        Désolé, la page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
