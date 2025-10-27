

export type Artisan = {
  id: string;
  userId: string; // Link to UserProfile
  name: string;
  craft: string;
  province: string;
  bio: string;
  profileImageId?: string;
  rating: number;
};

export type Mentor = {
  id: string;
  userId: string; // Link to UserProfile
  name: string;
  expertise: string;
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
  userId: string; // Link to UserProfile
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
  role: 'artisan' | 'student' | 'mentor' | 'admin' | 'training_center';
  profileImageId?: string;
  interests: string[];
};

export type Order = {
    id: string;
    artisanId: string;
    productId: string;
    productName: string;
    customerId: string;
    customerName: string;
    orderDate: string; 
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

export type SeedData = {
    users: UserProfile[],
    artisans: Artisan[],
    trainingCenters: TrainingCenter[],
    products: Product[],
    courses: Course[],
    mentors: Mentor[],
    orders?: Order[],
}

    