
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ProfilePageContent } from '@/components/profile-page-content';

function ProfilePageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}


export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfilePageFallback />}>
      <ProfilePageContent />
    </Suspense>
  );
}
