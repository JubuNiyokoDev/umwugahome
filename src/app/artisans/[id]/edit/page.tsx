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
import { useDoc, useFirestore, useUser, updateDocumentNonBlocking } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Artisan } from "@/lib/types";
import { doc } from "firebase/firestore";
import { useRouter, notFound, useParams } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AiProfileSuggestions } from "@/components/ai-profile-suggestions";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Le nom doit contenir au moins 2 caractères.",
    })
    .max(50, {
      message: "Le nom ne doit pas dépasser 50 caractères.",
    }),
  craft: z.string().max(50).min(2, { message: "Le métier doit contenir au moins 2 caractères."}),
  province: z.string().max(50).min(2, { message: "La province doit contenir au moins 2 caractères."}),
  bio: z.string().max(280, { message: "La biographie ne doit pas dépasser 280 caractères." }).min(10, { message: "La biographie doit contenir au moins 10 caractères."}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function EditArtisanProfilePage() {
    const params = useParams();
    const { id } = params;
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const artisanRef = useMemo(() => {
        if (!firestore || typeof id !== 'string') return null;
        return doc(firestore, 'artisans', id);
    }, [firestore, id]);

    const { data: artisan, isLoading: isLoadingArtisan } = useDoc<Artisan>(artisanRef);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            craft: '',
            province: '',
            bio: ''
        },
        mode: "onChange",
    });
    
    const artisanDataForAI = form.watch();

    // Populate form with artisan data once loaded
    useMemo(() => {
        if (artisan) {
            form.reset({
                name: artisan.name,
                craft: artisan.craft,
                province: artisan.province,
                bio: artisan.bio
            });
        }
    }, [artisan, form]);

    async function onSubmit(data: ProfileFormValues) {
        if (!artisanRef) return;
        
        // Use non-blocking update
        updateDocumentNonBlocking(artisanRef, data);
        
        toast({
            title: "Profil mis à jour",
            description: "Votre profil a été sauvegardé avec succès.",
        });
        router.push(`/artisans/${id}`);
    }

    if (isUserLoading || isLoadingArtisan) {
        return (
            <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Card>
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
                     <div className="md:col-span-1">
                        <Card>
                             <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                             </CardHeader>
                             <CardContent>
                                <Skeleton className="h-10 w-full" />
                             </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // Security check: ensure the logged-in user is the owner of this profile
    if (!isUserLoading && user?.uid !== id) {
        notFound();
    }
    
    if (!artisan) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Modifier mon profil d'artisan</CardTitle>
                            <CardDescription>Mettez à jour vos informations pour qu'elles soient visibles par les clients.</CardDescription>
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
                                            name="craft"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Métier</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Maroquinier" {...field} />
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
                                                    placeholder="Parlez-nous de votre parcours, de votre passion..."
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                            C'est votre histoire. Rendez-la intéressante !
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
                <div className="lg:col-span-1">
                    <AiProfileSuggestions 
                        artisanProfile={{...artisanDataForAI, ...artisan}}
                    />
                </div>
            </div>
        </div>
    );
}
