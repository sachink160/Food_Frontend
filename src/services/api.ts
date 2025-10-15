import type {
  AuthResponse,
  User,
  Address,
  Restaurant,
  Category,
  MenuItem,
  UserType,
  SearchParams
} from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export function getPublicUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path}`;
}

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || error.error || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns { success: boolean, data: T } structure
    if (data.success && data.data !== undefined) {
      return data.data;
    }
    // Fallback for non-standard responses
    return data;
  }

  async login(phone_number: string, user_type: UserType): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, user_type }),
    });
    const data = await this.handleResponse<AuthResponse>(response);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ refresh_token: refreshToken || undefined }),
      });
    } catch (_) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<User>(response);
  }

  async updateUser(data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<User>(response);
  }

  async getAddresses(): Promise<Address[]> {
    const response = await fetch(`${API_BASE_URL}/user/me/addresses`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<Address[]>(response);
  }

  async createAddress(data: Partial<Address>): Promise<Address> {
    const response = await fetch(`${API_BASE_URL}/user/me/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Address>(response);
  }

  async updateAddress(id: number, data: Partial<Address>): Promise<Address> {
    const response = await fetch(`${API_BASE_URL}/user/me/addresses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Address>(response);
  }

  async deleteAddress(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user/me/addresses/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete address');
    }
  }

  async getMyRestaurant(): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<Restaurant>(response);
  }

  async createOrUpdateRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Restaurant>(response);
  }

  async uploadRestaurantImage(file: File): Promise<Restaurant> {
    const form = new FormData();
    form.append('image', file);
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/upload-image`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
      body: form,
    });
    return this.handleResponse<Restaurant>(response);
  }

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/categories`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<Category[]>(response);
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Category>(response);
  }

  async uploadCategoryImage(categoryId: number, file: File): Promise<Category> {
    const form = new FormData();
    form.append('image', file);
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/categories/${categoryId}/upload-image`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
      body: form,
    });
    return this.handleResponse<Category>(response);
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Category>(response);
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/categories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
  }

  async getMenuItems(): Promise<MenuItem[]> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/menu`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<MenuItem[]>(response);
  }

  async createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<MenuItem>(response);
  }

  async updateMenuItem(id: number, data: Partial<MenuItem>): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/menu/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<MenuItem>(response);
  }

  async uploadMenuItemImage(itemId: number, file: File): Promise<MenuItem> {
    const form = new FormData();
    form.append('image', file);
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/menu/${itemId}/upload-image`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
      body: form,
    });
    return this.handleResponse<MenuItem>(response);
  }

  async deleteMenuItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/menu/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete menu item');
    }
  }

  async getSpecials(): Promise<MenuItem[]> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/specials`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<MenuItem[]>(response);
  }

  async updateSpecials(item_ids: number[]): Promise<MenuItem[]> {
    const response = await fetch(`${API_BASE_URL}/owner/restaurant/specials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(item_ids),
    });
    return this.handleResponse<MenuItem[]>(response);
  }

  async getRestaurants(city?: string, cuisine?: string): Promise<Restaurant[]> {
    const queryParams = new URLSearchParams();
    if (city) queryParams.append('city', city);
    if (cuisine) queryParams.append('cuisine_type', cuisine);
    
    const url = queryParams.toString() 
      ? `${API_BASE_URL}/restaurants?${queryParams}`
      : `${API_BASE_URL}/restaurants`;
    
    const response = await fetch(url);
    return this.handleResponse<Restaurant[]>(response);
  }

  async getRestaurant(id: number): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
    return this.handleResponse<Restaurant>(response);
  }

  async searchNearby(params: SearchParams): Promise<Restaurant[]> {
    const queryParams = new URLSearchParams();
    if (params.lat) queryParams.append('lat', params.lat.toString());
    if (params.lng) queryParams.append('lng', params.lng.toString());
    if (params.radius_km) queryParams.append('radius_km', params.radius_km.toString());

    const response = await fetch(`${API_BASE_URL}/search/nearby?${queryParams}`);
    return this.handleResponse<Restaurant[]>(response);
  }

  

  async searchByCode(code: string): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/search/code/${code}`);
    return this.handleResponse<Restaurant>(response);
  }

  // Admin restaurant management endpoints
  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Restaurant>(response);
  }

  async updateRestaurant(id: number, data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<Restaurant>(response);
  }

  async deleteRestaurant(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete restaurant');
    }
  }

  // Enhanced search with limit parameter
  async getPopularRestaurants(limit: number = 20): Promise<Restaurant[]> {
    const response = await fetch(`${API_BASE_URL}/search/popular?limit=${limit}`);
    return this.handleResponse<Restaurant[]>(response);
  }

  async getNewRestaurants(limit: number = 20): Promise<Restaurant[]> {
    const response = await fetch(`${API_BASE_URL}/search/new?limit=${limit}`);
    return this.handleResponse<Restaurant[]>(response);
  }
}

export const api = new ApiService();
