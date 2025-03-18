// src/features/producers/types/producer.types.ts

/**
 * Availability status of a producer
 * now: Available immediately
 * tomorrow: Available the next day
 * weekend: Available on the weekend
 */
export type AvailabilityStatus = 'now' | 'tomorrow' | 'weekend';

/**
 * Type of producer/neighbor in the system
 */
export type ProducerType = 'gardener' | 'baker' | 'eggs' | 'homecook' | 'specialty';

/**
 * Represents a single item offered by a producer
 */
export interface ProducerItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  price?: number;
}

/**
 * Location information for a producer
 */
export interface Location {
  lat: number;
  lng: number;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

/**
 * Contact information for a producer
 */
export interface ContactInfo {
  phone?: string;
  email?: string;
  instagram?: string;
  website?: string;
}

/**
 * Operating hours for a producer
 */
export interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

/**
 * Review for a producer
 */
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

/**
 * Core Producer entity representing a neighbor in the HelloNeighbor platform
 */
export interface Producer {
  id: number;
  name: string;
  type: ProducerType;
  icon: string;
  images: string[];
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
  profileImage?: string;
  productImages: string[];
  
  // Extended properties (to be implemented)
  location?: Location;
  contact?: ContactInfo;
  hours?: OperatingHours;
  dietaryOptions?: string[];
  detailedReviews?: Review[];
  bio?: string;
  joined?: string;
  verified?: boolean;
}

/**
 * Filters that can be applied to producers
 */
export interface ProducerFilters {
  category?: string;
  availability?: AvailabilityStatus | 'all';
  maxWalkTime?: number;
  minRating?: number;
  dietaryOptions?: string[];
  searchQuery?: string;
  featured?: boolean;
}

/**
 * Response from producer list API
 */
export interface ProducersResponse {
  producers: Producer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}