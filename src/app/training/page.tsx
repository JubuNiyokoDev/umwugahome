import { TrainingCenterCard } from "@/components/training-center-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trainingCenters } from "@/lib/data";
import { Search } from "lucide-react";

export default function TrainingPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Espace Formation & Orientation</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Trouvez la formation qui vous convient pour lancer ou faire évoluer votre carrière dans les métiers d'artisanat.
        </p>
      </div>

       <Card className="mb-8">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Rechercher une formation ou un centre..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les provinces" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gitega">Gitega</SelectItem>
                <SelectItem value="bujumbura">Bujumbura Mairie</SelectItem>
                <SelectItem value="ngozi">Ngozi</SelectItem>
                <SelectItem value="muramvya">Muramvya</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Rechercher</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {trainingCenters.map(center => (
          <TrainingCenterCard key={center.id} center={center} />
        ))}
      </div>
    </div>
  );
}
