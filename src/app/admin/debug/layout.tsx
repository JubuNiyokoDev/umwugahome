
'use client';
import React from 'react';

// This is an unprotected layout, specifically for the debug/seed page.
// It does not require authentication, allowing initial database seeding.
export default function DebugLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="w-full max-w-2xl p-4 md:p-6">
            {children}
        </div>
    </div>
  );
}
