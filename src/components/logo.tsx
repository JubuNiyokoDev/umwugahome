import { cn } from "@/lib/utils";
import Link from "next/link";
import type { SVGProps } from "react";

function UMWUGAIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M11.5 5.5v12H10v-12zM5.5 12V6.5H4V12zm13 5.5V6.5H17V12h-4.5v5.5zm-13-7.25L4.44 9.2v.1L3.5 12h-2L3.25 7h2L7 12h-2zM12 11.5V7h2v4.5zm0-5.55v.1L12.94 9.2v-.1L12 5.95M11.5 12V7H10v5zM7.25 9.125l.85-2.2l.9 2.2zM13.125 9.125L14 6.925l.85 2.2zM12.94 9.2L12 5.95l-.94 3.25zM6.38 9.125L5.5 6.5l-.94 2.625zM12 5.95l-.94 3.25h1.88zM5.5 6.5l.88 2.625h-1.76zm6.5 4.15V7H10v3.65z"/>
    </svg>
  );
}


export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <UMWUGAIcon className="h-8 w-8 text-primary" />
      <span className="text-xl font-headline font-bold text-foreground">UmwugaHome</span>
    </Link>
  );
}
