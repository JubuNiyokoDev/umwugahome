
'use client';

import type { Mentor } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { Star, MessageCircle } from "lucide-react";
import { motion } from 'framer-motion';
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface MentorCardProps {
  mentor: Mentor | null;
}

export function MentorCard({ mentor }: MentorCardProps) {
  if (!mentor) {
    return (
      <Card className="flex flex-col overflow-hidden h-full shadow-lg">
        <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
                 <Skeleton className="h-20 w-20 rounded-full" />
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                 </div>
            </div>
            <Skeleton className="h-16 w-full" />
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }
  
  const profileImage = PlaceHolderImages.find(p => p.id === mentor.profileImageId);

  return (
    <motion.div whileHover={{ y: -8, boxShadow: "var(--tw-shadow-xl)" }} transition={{ duration: 0.3, ease: 'easeOut' }}>
      <Card className="flex flex-col overflow-hidden h-full shadow-lg bg-card/80 backdrop-blur-sm">
        <CardContent className="flex-grow p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="h-24 w-24 border-2 border-primary">
                    {profileImage && <AvatarImage src={profileImage.imageUrl} alt={mentor.name} />}
                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="text-xl font-bold font-headline">{mentor.name}</h3>
                    <Badge variant="secondary" className="mt-1">{mentor.expertise}</Badge>
                     <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-bold">{mentor.rating}</span>
                        <span className="text-sm text-muted-foreground">({Math.floor(Math.random() * 20) + 5} avis)</span>
                    </div>
                </div>
            </div>
          <CardDescription className="mt-4 text-sm line-clamp-4">{mentor.bio}</CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button asChild className="w-full">
            <Link href={`/mentors/${mentor.id}`}>
                 <MessageCircle className="mr-2 h-4 w-4" />
                Contacter
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

