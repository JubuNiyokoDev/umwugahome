"use client";

import type { Course } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "./ui/button";
import { Clock, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const image = PlaceHolderImages.find(p => p.id === course.imageId);
  const { toast } = useToast();

  const handleEnroll = () => {
    toast({
      title: "Inscription en cours",
      description: `Votre demande d'inscription pour "${course.title}" a été envoyée.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg bg-card/80 backdrop-blur-sm">
      {image &&
        <div className="relative h-40 w-full">
            <Image 
              src={image.imageUrl} 
              alt={course.title} 
              fill 
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
        </div>
      }
      <CardHeader>
        <CardTitle className="font-headline">{course.title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
            </div>
             <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>Prérequis: {course.prerequisites}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
         <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              {course.description}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleEnroll}>S'inscrire</Button>
      </CardFooter>
    </Card>
  )
}
