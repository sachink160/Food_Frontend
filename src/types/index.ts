export type UserType = 'customer' | 'restaurant_owner';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone_number?: string;
  role: UserType;
  roles: UserType[];
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  user_id: number;
  active_role: UserType;
  roles: UserType[];
  access_token: string;
  refresh_token: string;
  token_type: string;
  profile_incomplete?: boolean;
}

export interface Address {
  id: number;
  user_id: number;
  title: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
}

export interface Restaurant {
  id: number;
  owner_id: number;
  name: string;
  description?: string;
  cuisine_type?: string;
  phone_number?: string;
  email?: string;
  image_url?: string;
  unique_code: string;
  store_size: 'small' | 'medium' | 'large';
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  opening_time?: string;
  closing_time?: string;
  is_open: boolean;
  opened_on?: string;
  upcoming_holidays?: any[];
  special_items?: any[];
  delivery_radius: number;
  delivery_fee: number;
  minimum_order_amount: number;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: number;
  restaurant_id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_vegetarian: boolean;
  is_available: boolean;
  preparation_time?: number;
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at?: string;
}

export interface SearchParams {
  lat?: number;
  lng?: number;
  radius_km?: number;
}

// Additional types for better API integration
export interface RestaurantFilters {
  city?: string;
  cuisine_type?: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface ApiError {
  detail: string;
  error_code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | ApiError;
}

// Form data types for better type safety
export interface RestaurantFormData {
  name: string;
  description?: string;
  cuisine_type?: string;
  phone_number?: string;
  email?: string;
  image_url?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  opening_time?: string;
  closing_time?: string;
  delivery_radius: number;
  delivery_fee: number;
  minimum_order_amount: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image_url?: string;
}

export interface MenuItemFormData {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_vegetarian: boolean;
  is_available: boolean;
  preparation_time?: number;
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
  restaurant_id: number;
  category_id: number;
}

export interface AddressFormData {
  title: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}
