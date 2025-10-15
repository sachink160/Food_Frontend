// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  DEFAULT_SEARCH_RADIUS: Number(import.meta.env.VITE_DEFAULT_SEARCH_RADIUS) || 5,
  MAX_RESTAURANTS_PER_PAGE: Number(import.meta.env.VITE_MAX_RESTAURANTS_PER_PAGE) || 20,
  REQUEST_TIMEOUT: 10000, // 10 seconds
};

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  PROFILE_UPDATE_FAILED: 'Failed to update profile. Please try again.',
  RESTAURANT_CREATE_FAILED: 'Failed to create restaurant. Please try again.',
  RESTAURANT_UPDATE_FAILED: 'Failed to update restaurant. Please try again.',
  CATEGORY_CREATE_FAILED: 'Failed to create category. Please try again.',
  MENU_ITEM_CREATE_FAILED: 'Failed to create menu item. Please try again.',
  ADDRESS_CREATE_FAILED: 'Failed to create address. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  RESTAURANT_CREATED: 'Restaurant created successfully!',
  RESTAURANT_UPDATED: 'Restaurant updated successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  MENU_ITEM_CREATED: 'Menu item created successfully!',
  ADDRESS_CREATED: 'Address created successfully!',
  ADDRESS_UPDATED: 'Address updated successfully!',
  ADDRESS_DELETED: 'Address deleted successfully!',
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  PHONE: /^[0-9]{10}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  POSTAL_CODE: /^[0-9]{6}$/,
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
};

// Common cuisine types
export const CUISINE_TYPES = [
  'Indian',
  'Chinese',
  'Italian',
  'Mexican',
  'Thai',
  'Japanese',
  'American',
  'Mediterranean',
  'Korean',
  'Vietnamese',
  'French',
  'Middle Eastern',
  'Other'
];

// Store sizes
export const STORE_SIZES = [
  { value: 'small', label: 'Small (1-10 seats)' },
  { value: 'medium', label: 'Medium (11-30 seats)' },
  { value: 'large', label: 'Large (31+ seats)' }
];

// Suggested food categories
export const CATEGORY_SUGGESTIONS: string[] = [
  'Biryani',
  'Pizza',
  'Burgers',
  'Sandwiches',
  'South Indian',
  'North Indian',
  'Chinese',
  'Momos & Dim Sum',
  'Indian Curries',
  'Tandoor & Kebabs',
  'BBQ & Grill',
  'Seafood',
  'Breakfast',
  'Salads',
  'Soups',
  'Pasta & Noodles',
  'Street Food',
  'Bakery',
  'Desserts',
  'Ice Cream',
  'Beverages',
  'Coffee & Tea',
  'Juice & Smoothies',
  'Vegan',
  'Vegetarian',
];