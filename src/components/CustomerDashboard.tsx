import { useState, useEffect } from 'react';
import { Search, MapPin, TrendingUp, Sparkles, Hash, Filter, Map } from 'lucide-react';
import { api } from '../services/api';
import { RestaurantCard } from './RestaurantCard';
import type { Restaurant, RestaurantFilters, LocationCoords } from '../types';
import { CUISINE_TYPES, API_CONFIG, ERROR_MESSAGES } from '../config/constants';

export function CustomerDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [newRestaurants, setNewRestaurants] = useState<Restaurant[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'new' | 'nearby'>('all');
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurants();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError('Unable to get your location. Please enable location services.');
          console.error('Location error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const [all, popular, newOnes] = await Promise.all([
        api.getRestaurants(filters.city, filters.cuisine_type),
        api.getPopularRestaurants(API_CONFIG.MAX_RESTAURANTS_PER_PAGE),
        api.getNewRestaurants(API_CONFIG.MAX_RESTAURANTS_PER_PAGE),
      ]);
      setRestaurants(all);
      setPopularRestaurants(popular);
      setNewRestaurants(newOnes);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyRestaurants = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      const nearby = await api.searchNearby({
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        radius_km: API_CONFIG.DEFAULT_SEARCH_RADIUS,
      });
      setRestaurants(nearby);
    } catch (error) {
      console.error('Failed to load nearby restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setLoading(true);
    try {
      const restaurant = await api.searchByCode(searchCode);
      setRestaurants([restaurant]);
      setActiveTab('all');
    } catch (error) {
      alert('Restaurant not found');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof RestaurantFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const applyFilters = () => {
    loadRestaurants();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({});
    loadRestaurants();
    setShowFilters(false);
  };

  const getCurrentRestaurants = () => {
    switch (activeTab) {
      case 'popular':
        return popularRestaurants;
      case 'new':
        return newRestaurants;
      case 'nearby':
        return restaurants; // Will be populated by loadNearbyRestaurants
      default:
        return restaurants;
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'nearby') {
      loadNearbyRestaurants();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search by Code */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Discover Restaurants</h2>
        </div>

        <form onSubmit={handleSearchByCode} className="flex gap-3">
          <div className="flex-1 relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="Search by restaurant code (e.g., REST001)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Enter city name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
              <select
                value={filters.cuisine_type || ''}
                onChange={(e) => handleFilterChange('cuisine_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Cuisines</option>
                {CUISINE_TYPES.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Restaurant Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-3 border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => handleTabChange('all')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            All Restaurants
          </button>
          <button
            onClick={() => handleTabChange('popular')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === 'popular'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Popular
          </button>
          <button
            onClick={() => handleTabChange('new')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === 'new'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            New
          </button>
          <button
            onClick={() => handleTabChange('nearby')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === 'nearby'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Map className="w-4 h-4" />
            Nearby
          </button>
        </div>

        {activeTab === 'nearby' && locationError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            {locationError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        ) : getCurrentRestaurants().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No restaurants found</p>
            {activeTab === 'nearby' && !userLocation && (
              <p className="text-sm text-gray-500 mt-2">Enable location services to find nearby restaurants</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentRestaurants().map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
