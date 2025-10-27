export type Artisan = {
  id: string;
  name: string;
  craft: string;
  province: string;
  bio: string;
  profileImageId: string;
  products: Product[];
  rating: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  imageId: string;
  description: string;
};

export type TrainingCenter = {
  id: string;
  name:string;
  province: string;
  description: string;
  imageId: string;
  courses: Course[];
  rating: number;
};

export type Course = {
  id: string;
  title: string;
  duration: string;
  description: string;
  prerequisites: string;
  imageId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'artisan' | 'student' | 'mentor' | 'admin';
  profileImageId: string;
  interests: string[];
};
