import { Firestore, doc, updateDoc, deleteDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile, Artisan, TrainingCenter, Course } from './types';

export class AdminUtils {
  constructor(private firestore: Firestore) {}

  // User operations
  async updateUser(userId: string, updates: Partial<UserProfile>) {
    const userRef = doc(this.firestore, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteUser(userId: string) {
    const userRef = doc(this.firestore, 'users', userId);
    await deleteDoc(userRef);
  }

  async createUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const usersRef = collection(this.firestore, 'users');
    await addDoc(usersRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  // Artisan operations
  async updateArtisan(artisanId: string, updates: Partial<Artisan>) {
    const artisanRef = doc(this.firestore, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteArtisan(artisanId: string) {
    const artisanRef = doc(this.firestore, 'artisans', artisanId);
    await deleteDoc(artisanRef);
  }

  async createArtisan(artisanData: Omit<Artisan, 'id' | 'createdAt' | 'updatedAt'>) {
    const artisansRef = collection(this.firestore, 'artisans');
    await addDoc(artisansRef, {
      ...artisanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  // Training Center operations
  async updateTrainingCenter(centerId: string, updates: Partial<TrainingCenter>) {
    const centerRef = doc(this.firestore, 'training_centers', centerId);
    await updateDoc(centerRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteTrainingCenter(centerId: string) {
    const centerRef = doc(this.firestore, 'training_centers', centerId);
    await deleteDoc(centerRef);
  }

  async createTrainingCenter(centerData: Omit<TrainingCenter, 'id' | 'createdAt' | 'updatedAt'>) {
    const centersRef = collection(this.firestore, 'training_centers');
    await addDoc(centersRef, {
      ...centerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  // Course operations
  async updateCourse(courseId: string, updates: Partial<Course>) {
    const courseRef = doc(this.firestore, 'courses', courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteCourse(courseId: string) {
    const courseRef = doc(this.firestore, 'courses', courseId);
    await deleteDoc(courseRef);
  }

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) {
    const coursesRef = collection(this.firestore, 'courses');
    await addDoc(coursesRef, {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  // Bulk operations
  async getStats() {
    // Cette fonction pourrait être étendue pour calculer des statistiques
    // Pour l'instant, elle retourne des données de base
    return {
      totalUsers: 0,
      totalArtisans: 0,
      totalCenters: 0,
      totalCourses: 0
    };
  }
}

export function useAdminUtils(firestore: Firestore | null) {
  if (!firestore) return null;
  return new AdminUtils(firestore);
}