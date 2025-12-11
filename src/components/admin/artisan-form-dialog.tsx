'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Artisan } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAdminUtils } from '@/lib/admin-utils';
import { useFirestore } from '@/firebase';

interface ArtisanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artisan?: Artisan | null;
  mode: 'create' | 'edit';
}

export function ArtisanFormDialog({ open, onOpenChange, artisan, mode }: ArtisanFormDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const adminUtils = useAdminUtils(firestore);
  
  const [formData, setFormData] = useState({
    name: '',
    craft: '',
    province: '',
    commune: '',
    description: '',
    phone: '',
    rating: 0
  });
  
  useEffect(() => {
    if (artisan && mode === 'edit') {
      setFormData({
        name: artisan.name || '',
        craft: artisan.craft || '',
        province: artisan.province || '',
        commune: artisan.commune || '',
        description: artisan.description || '',
        phone: artisan.phone || '',
        rating: artisan.rating || 0
      });
    } else {
      setFormData({
        name: '',
        craft: '',
        province: '',
        commune: '',
        description: '',
        phone: '',
        rating: 0
      });
    }
  }, [artisan, mode, open]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUtils) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        await adminUtils.createArtisan(formData as any);
        toast({
          title: 'Artisan créé',
          description: 'L\'artisan a été créé avec succès.'
        });
      } else if (artisan) {
        await adminUtils.updateArtisan(artisan.id, formData);
        toast({
          title: 'Artisan modifié',
          description: 'L\'artisan a été modifié avec succès.'
        });
      }
      
      onOpenChange(false);
      setFormData({ name: '', craft: '', province: '', commune: '', description: '', phone: '', rating: 0 });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'opération.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Ajouter un artisan' : 'Modifier l\'artisan'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Remplissez les informations pour créer un nouvel artisan.'
              : 'Modifiez les informations de l\'artisan.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="craft">Métier</Label>
              <Input
                id="craft"
                value={formData.craft}
                onChange={(e) => setFormData(prev => ({ ...prev, craft: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commune">Commune</Label>
              <Input
                id="commune"
                value={formData.commune}
                onChange={(e) => setFormData(prev => ({ ...prev, commune: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Note (0-5)</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'En cours...' : (mode === 'create' ? 'Créer' : 'Modifier')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}