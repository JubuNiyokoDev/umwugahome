
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Mentor } from "@/lib/types";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter, notFound, useParams } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Le nom doit contenir au moins 2 caractères.",
    })
    .max(50, {
      message: "Le nom ne doit pas dépasser 50 caractères.",
    }),
  expertise: z.string().max(50).min(2, { message: "L'expertise doit contenir au moins 2 caractères."}),
  province: z.string().max(50).min(2, { message: "La province doit contenir au moins 2 caractères."}),
  bio: z.string().max(500, { message: "La biographie ne doit pas dépasser 500 caractères." }).min(10, { message: "La biographie doit contenir au moins 10 caractères."}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function EditMentorProfilePage() {
    const params = useParams();
    const { id } = params;
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const mentorRef = useMemo(() => {
        if (!firestore || typeof id !== 'string') return null;
        return doc(firestore, 'mentors', id);
    }, [firestore, id]);

    const { data: mentor, isLoading: isLoadingMentor } = useDoc<Mentor>(mentorRef);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            expertise: '',
            province: '',
            bio: ''
        },
        mode: "onChange",
    });

    // Populate form with mentor data once loaded
    useMemo(() => {
        if (mentor) {
            form.reset({
                name: mentor.name,
                expertise: mentor.expertise,
                province: mentor.province,
                bio: mentor.bio
            });
        }
    }, [mentor, form]);

    async function onSubmit(data: ProfileFormValues) {
        if (!mentorRef) return;
        try {
            await updateDoc(mentorRef, data);
            toast({
                title: "Profil mis à jour",
                description: "Votre profil de mentor a été sauvegardé avec succès.",
            });
            router.push(`/mentors/${id}`);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "La mise à jour du profil a échoué.",
            });
        }
    }

    if (isUserLoading || isLoadingMentor) {
        return (
            <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-1/4" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                             <Skeleton className="h-4 w-1/4" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                             <Skeleton className="h-4 w-1/4" />
                             <Skeleton className="h-24 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Security check: ensure the logged-in user is the owner of this profile
    if (!user || user.uid !== id) {
        notFound();
    }
    
    if (!mentor) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <Card className="max-w-2xl mx-auto shadow-lg bg-card/80 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="font-headline text-2xl">Modifier mon profil de Mentor</CardTitle>
                    <CardDescription>Mettez à jour vos informations pour être visible par les mentorés.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Votre nom complet" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="expertise"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Domaine d'Expertise</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Business Development" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Province</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Bujumbura Mairie" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Biographie</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Parlez-nous de votre parcours, de votre expérience..."
                                            className="resize-none"
                                            rows={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                       Mettez en avant votre expérience pour inspirer confiance.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Sauvegarder les modifications
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
