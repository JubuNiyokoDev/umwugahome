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
import { TrainingCenter } from "@/lib/types";
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
  province: z.string().max(50).min(2, { message: "La province doit contenir au moins 2 caractères."}),
  description: z.string().max(500, { message: "La description ne doit pas dépasser 500 caractères." }).min(10, { message: "La description doit contenir au moins 10 caractères."}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


export default function EditTrainingCenterProfilePage() {
    const params = useParams();
    const { id } = params;
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const centerRef = useMemo(() => {
        if (!firestore || typeof id !== 'string') return null;
        return doc(firestore, 'training-centers', id);
    }, [firestore, id]);

    const { data: center, isLoading: isLoadingCenter } = useDoc<TrainingCenter>(centerRef);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            province: '',
            description: ''
        },
        mode: "onChange",
    });

    // Populate form with center data once loaded
    useMemo(() => {
        if (center) {
            form.reset({
                name: center.name,
                province: center.province,
                description: center.description
            });
        }
    }, [center, form]);

    async function onSubmit(data: ProfileFormValues) {
        if (!centerRef) return;
        try {
            await updateDoc(centerRef, data);
            toast({
                title: "Profil mis à jour",
                description: "Le profil du centre a été sauvegardé avec succès.",
            });
            router.push(`/training/${id}`);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "La mise à jour du profil a échoué.",
            });
        }
    }

    if (isUserLoading || isLoadingCenter) {
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
    
    if (!center) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <Card className="max-w-2xl mx-auto shadow-lg bg-card/80 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="font-headline text-2xl">Modifier le profil du Centre</CardTitle>
                    <CardDescription>Mettez à jour les informations de votre centre de formation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nom du Centre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nom de votre centre" {...field} />
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
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décrivez votre centre, sa mission, ses valeurs..."
                                            className="resize-none"
                                            rows={5}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                       Présentez ce qui rend votre centre unique.
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
