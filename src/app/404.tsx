'use client';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
      <p className="text-muted-foreground">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
    </div>
  );
}
