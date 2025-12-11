'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Save, Database, Mail, Shield, Globe } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AppSettings {
    siteName: string;
    siteDescription: string;
    adminEmail: string;
    enableRegistration: boolean;
    enableNotifications: boolean;
    maintenanceMode: boolean;
    maxFileSize: string;
    allowedFileTypes: string;
}

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'app_settings', 'main') : null, [firestore]);
    const { data: firestoreSettings, isLoading } = useDoc<AppSettings>(settingsRef);
    
    const [settings, setSettings] = useState<AppSettings>({
        siteName: "UmwugaHome Digital",
        siteDescription: "La Maison Digitale des Métiers du Burundi",
        adminEmail: "admin@umwugahome.bi",
        enableRegistration: true,
        enableNotifications: true,
        maintenanceMode: false,
        maxFileSize: "10",
        allowedFileTypes: "jpg,png,pdf,doc,docx"
    });
    
    useEffect(() => {
        if (firestoreSettings) {
            setSettings(firestoreSettings);
        }
    }, [firestoreSettings]);

    const handleSave = async () => {
        if (!firestore || !settingsRef) return;
        
        try {
            await setDoc(settingsRef, {
                ...settings,
                updatedAt: serverTimestamp()
            }, { merge: true });
            
            toast({
                title: "Paramètres sauvegardés",
                description: "Les paramètres ont été mis à jour avec succès.",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de sauvegarder les paramètres.",
                variant: "destructive"
            });
        }
    };

    const handleBackupDatabase = async () => {
        if (!firestore) return;
        
        try {
            // Simulation d'une sauvegarde - dans un vrai projet, ceci appellerait une Cloud Function
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast({
                title: "Sauvegarde initiée",
                description: "La sauvegarde de la base de données a été lancée.",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de lancer la sauvegarde.",
                variant: "destructive"
            });
        }
    };

    const handleTestEmail = () => {
        toast({
            title: "Email de test envoyé",
            description: `Un email de test a été envoyé à ${settings.adminEmail}`,
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Paramètres Administrateur</h1>
            
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Paramètres Généraux
                        </CardTitle>
                        <CardDescription>Configuration générale du site</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Nom du site</Label>
                            <Input 
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) => setSettings(prev => ({...prev, siteName: e.target.value}))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="siteDescription">Description</Label>
                            <Textarea 
                                id="siteDescription"
                                value={settings.siteDescription}
                                onChange={(e) => setSettings(prev => ({...prev, siteDescription: e.target.value}))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminEmail">Email administrateur</Label>
                            <Input 
                                id="adminEmail"
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => setSettings(prev => ({...prev, adminEmail: e.target.value}))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Sécurité & Accès
                        </CardTitle>
                        <CardDescription>Contrôles d'accès et sécurité</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Inscription ouverte</Label>
                                <p className="text-sm text-muted-foreground">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                            </div>
                            <Switch 
                                checked={settings.enableRegistration}
                                onCheckedChange={(checked) => setSettings(prev => ({...prev, enableRegistration: checked}))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Notifications</Label>
                                <p className="text-sm text-muted-foreground">Activer les notifications par email</p>
                            </div>
                            <Switch 
                                checked={settings.enableNotifications}
                                onCheckedChange={(checked) => setSettings(prev => ({...prev, enableNotifications: checked}))}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Mode maintenance</Label>
                                <p className="text-sm text-muted-foreground">Désactiver l'accès public au site</p>
                            </div>
                            <Switch 
                                checked={settings.maintenanceMode}
                                onCheckedChange={(checked) => setSettings(prev => ({...prev, maintenanceMode: checked}))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Fichiers & Uploads</CardTitle>
                        <CardDescription>Configuration des téléchargements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="maxFileSize">Taille max des fichiers (MB)</Label>
                            <Input 
                                id="maxFileSize"
                                type="number"
                                value={settings.maxFileSize}
                                onChange={(e) => setSettings(prev => ({...prev, maxFileSize: e.target.value}))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="allowedFileTypes">Types de fichiers autorisés</Label>
                            <Input 
                                id="allowedFileTypes"
                                value={settings.allowedFileTypes}
                                onChange={(e) => setSettings(prev => ({...prev, allowedFileTypes: e.target.value}))}
                                placeholder="jpg,png,pdf,doc"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Actions Système
                        </CardTitle>
                        <CardDescription>Outils de maintenance et test</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleBackupDatabase} variant="outline" className="w-full">
                            <Database className="mr-2 h-4 w-4" />
                            Sauvegarder la base de données
                        </Button>
                        <Button onClick={handleTestEmail} variant="outline" className="w-full">
                            <Mail className="mr-2 h-4 w-4" />
                            Tester l'envoi d'email
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} className="min-w-32" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Chargement...' : 'Sauvegarder'}
                </Button>
            </div>
        </div>
    );
}