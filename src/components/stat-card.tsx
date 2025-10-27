import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon, description, className }: StatCardProps) {
  return (
    <Card className={cn("bg-card text-card-foreground p-6 rounded-lg", className)}>
      <CardContent className="p-0 flex flex-col items-start gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="p-2 rounded-md bg-primary/20 text-primary">
                {icon}
            </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-3xl font-bold font-headline text-primary">{value}</div>
          <p className="text-base text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
