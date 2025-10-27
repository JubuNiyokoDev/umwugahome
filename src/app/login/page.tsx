
import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';
import { Loader2 } from 'lucide-react';

function LoginFormFallback() {
  return (
     <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement...</p>
      </div>
  )
}

export default function LoginPage()