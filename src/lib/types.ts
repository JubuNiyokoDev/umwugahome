export type Artisan = {
  id: string;
  name: string;
  craft: string;
  province: string;
  bio: string;
  profileImageId?: string;
  rating: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  imageId: string;
  description: string;
  artisanId: string;
};

export type TrainingCenter = {
  id: string;
  name:string;
  province: string;
  description: string;
  imageId: string;
  rating: number;
};

export type Course = {
  id: string;
  title: string;
  duration: string;
  description: string;
  prerequisites: string;
  imageId: string;
  centerId: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string | null;
  role: 'artisan' | 'student' | 'mentor' | 'admin';
  profileImageId?: string;
  interests: string[];
};

    