
'use client'
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    }>
      {children}
    </Suspense>
  );
}
