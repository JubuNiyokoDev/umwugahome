'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Course, TrainingCenter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAdminUtils } from '@/lib/admin-utils';
import { useFirestore } from '@/firebase';

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  mode: 'create' | 'edit';
  centers: TrainingCenter[];
}

export function CourseFormDialog({ open, onOpenChange, course, mode, centers }: CourseFormDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const adminUtils = useAdminUtils(firestore);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    centerId: '',
    price: 0,
    level: 'Débutant'
  });
  
  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        duration: course.duration || '',
        centerId: course.centerId || '',
        price: course.price || 0,
        level: course.level || 'Débutant'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        duration: '',
        centerId: '',
        price: 0,
        level: 'Débutant'
      });
    }
  }, [course, mode, open]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUtils) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        await adminUtils.createCourse(formData as any);
        toast({
          title: 'Formation créée',
          description: 'La formation a été créée avec succès.'
        });
      } else if (course) {
        await adminUtils.updateCourse(course.id, formData);
        toast({
          title: 'Formation modifiée',
          description: 'La formation a été modifiée avec succès.'
        });
      }
      
      onOpenChange(false);
      setFormData({ title: '', description: '', duration: '', centerId: '', price: 0, level: 'Débutant' });
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
            {mode === 'create' ? 'Ajouter une formation' : 'Modifier la formation'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Remplissez les informations pour créer une nouvelle formation.'
              : 'Modifiez les informations de la formation.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la formation</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="centerId">Centre de formation</Label>
            <Select value={formData.centerId} onValueChange={(value) => setFormData(prev => ({ ...prev, centerId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un centre" />
              </SelectTrigger>
              <SelectContent>
                {centers?.map(center => (
                  <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="ex: 3 mois"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FBU)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="level">Niveau</Label>
            <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Débutant">Débutant</SelectItem>
                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="Avancé">Avancé</SelectItem>
              </SelectContent>
            </Select>
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