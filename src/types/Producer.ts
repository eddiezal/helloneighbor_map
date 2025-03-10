export type AvailabilityStatus = 'now' | 'tomorrow' | 'weekend';
export type ProducerType = 'gardener' | 'baker' | 'eggs' | 'homecook' | 'specialty';

export interface Producer {
  id: number;
  name: string;
  type: ProducerType;
  icon: string;
  description: string;
  rating: number;
  reviews: number;
  distance: number;
  walkTime: number;
  lat: number;
  lng: number;
  availability: AvailabilityStatus;
  featured: boolean;
  items: string[];
  profileImage?: string; // Path to profile image
  productImages: string[]; // Paths to product images
}
