import { useState, useEffect } from 'react';
import { Store, Plus, Edit2, Trash2, Save, X, Clock, MapPin, DollarSign, Star } from 'lucide-react';
import { api } from '../services/api';
import type { Restaurant, Category, MenuItem, RestaurantFormData, CategoryFormData, MenuItemFormData } from '../types';
import { CUISINE_TYPES, STORE_SIZES, VALIDATION_PATTERNS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants';

export function OwnerDashboard() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'restaurant' | 'categories' | 'menu' | 'specials'>('restaurant');
  const [editingRestaurant, setEditingRestaurant] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState<RestaurantFormData>({
    name: '',
    description: '',
    cuisine_type: '',
    phone_number: '',
    email: '',
    image_url: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    latitude: undefined,
    longitude: undefined,
    opening_time: '',
    closing_time: '',
    delivery_radius: 5.0,
    delivery_fee: 0.0,
    minimum_order_amount: 0.0,
  });

  // Form states for categories and menu items
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    description: '',
    image_url: '',
  });
  const [menuItemForm, setMenuItemForm] = useState<MenuItemFormData>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    is_vegetarian: false,
    is_available: true,
    preparation_time: undefined,
    calories: undefined,
    ingredients: [],
    allergens: [],
    restaurant_id: 0,
    category_id: 0,
  });

  // Specials management
  const [specialItems, setSpecialItems] = useState<MenuItem[]>([]);
  const [selectedSpecials, setSelectedSpecials] = useState<number[]>([]);

  // Loading and error states
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [restaurantData, categoriesData, menuData, specialsData] = await Promise.all([
        api.getMyRestaurant().catch(() => null),
        api.getCategories().catch(() => []),
        api.getMenuItems().catch(() => []),
        api.getSpecials().catch(() => []),
      ]);
      setRestaurant(restaurantData);
      if (restaurantData) {
        setRestaurantForm({
          name: restaurantData.name || '',
          description: restaurantData.description || '',
          cuisine_type: restaurantData.cuisine_type || '',
          phone_number: restaurantData.phone_number || '',
          email: restaurantData.email || '',
          image_url: restaurantData.image_url || '',
          address_line1: restaurantData.address_line1 || '',
          address_line2: restaurantData.address_line2 || '',
          city: restaurantData.city || '',
          state: restaurantData.state || '',
          postal_code: restaurantData.postal_code || '',
          latitude: restaurantData.latitude,
          longitude: restaurantData.longitude,
          opening_time: restaurantData.opening_time || '',
          closing_time: restaurantData.closing_time || '',
          delivery_radius: restaurantData.delivery_radius || 5.0,
          delivery_fee: restaurantData.delivery_fee || 0.0,
          minimum_order_amount: restaurantData.minimum_order_amount || 0.0,
        });
      }
      setCategories(categoriesData);
      setMenuItems(menuData);
      setSpecialItems(specialsData);
      setSelectedSpecials(specialsData.map(item => item.id));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRestaurant = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate required fields
      if (!restaurantForm.name.trim()) {
        throw new Error('Restaurant name is required');
      }
      if (!restaurantForm.address_line1.trim()) {
        throw new Error('Address is required');
      }
      if (!restaurantForm.city.trim()) {
        throw new Error('City is required');
      }
      if (!restaurantForm.state.trim()) {
        throw new Error('State is required');
      }
      if (!restaurantForm.postal_code.trim()) {
        throw new Error('Postal code is required');
      }

      const saved = await api.createOrUpdateRestaurant(restaurantForm);
      setRestaurant(saved);
      setEditingRestaurant(false);
      setSuccess(SUCCESS_MESSAGES.RESTAURANT_UPDATED);
    } catch (error) {
      setError(error instanceof Error ? error.message : ERROR_MESSAGES.RESTAURANT_UPDATE_FAILED);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!categoryForm.name.trim()) {
        throw new Error('Category name is required');
      }
      
      const newCategory = await api.createCategory(categoryForm);
      setCategories([...categories, newCategory]);
      setCategoryForm({ name: '', description: '', image_url: '' });
      setShowCategoryForm(false);
      setSuccess(SUCCESS_MESSAGES.CATEGORY_CREATED);
    } catch (error) {
      setError(error instanceof Error ? error.message : ERROR_MESSAGES.CATEGORY_CREATE_FAILED);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateMenuItem = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!menuItemForm.name.trim()) {
        throw new Error('Menu item name is required');
      }
      if (!menuItemForm.category_id) {
        throw new Error('Please select a category');
      }
      if (menuItemForm.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      
      const newMenuItem = await api.createMenuItem({
        ...menuItemForm,
        restaurant_id: restaurant?.id || 0,
      });
      setMenuItems([...menuItems, newMenuItem]);
      setMenuItemForm({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        is_vegetarian: false,
        is_available: true,
        preparation_time: undefined,
        calories: undefined,
        ingredients: [],
        allergens: [],
        restaurant_id: restaurant?.id || 0,
        category_id: 0,
      });
      setShowMenuItemForm(false);
      setSuccess(SUCCESS_MESSAGES.MENU_ITEM_CREATED);
    } catch (error) {
      setError(error instanceof Error ? error.message : ERROR_MESSAGES.MENU_ITEM_CREATE_FAILED);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await api.deleteMenuItem(id);
      setMenuItems(menuItems.filter((m) => m.id !== id));
      setSpecialItems(specialItems.filter((s) => s.id !== id));
      setSelectedSpecials(selectedSpecials.filter((s) => s !== id));
    } catch (error) {
      alert('Failed to delete menu item');
    }
  };

  const handleUpdateSpecials = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedSpecials = await api.updateSpecials(selectedSpecials);
      setSpecialItems(updatedSpecials);
      setSuccess('Special items updated successfully!');
    } catch (error) {
      setError('Failed to update special items');
    } finally {
      setSaving(false);
    }
  };

  const handleSpecialToggle = (itemId: number) => {
    setSelectedSpecials(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Restaurant Management</h2>
        </div>

        <div className="flex gap-3 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('restaurant')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'restaurant'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Restaurant Info
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'categories'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'menu'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('specials')}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'specials'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Special Items
          </button>
        </div>

        {activeTab === 'restaurant' && (
          <div className="space-y-6">
            {restaurant && !editingRestaurant ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                    <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded">
                      Code: {restaurant.unique_code}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingRestaurant(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-600 mt-1">{restaurant.description || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Cuisine Type:</span>
                    <p className="text-gray-600 mt-1">{restaurant.cuisine_type || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Address:</span>
                    <p className="text-gray-600 mt-1">
                      {restaurant.address_line1}
                      {restaurant.address_line2 && `, ${restaurant.address_line2}`}
                      {`, ${restaurant.city}, ${restaurant.state} ${restaurant.postal_code}`}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600 mt-1">{restaurant.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600 mt-1">{restaurant.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Hours:</span>
                    <p className="text-gray-600 mt-1">
                      {restaurant.opening_time && restaurant.closing_time 
                        ? `${restaurant.opening_time} - ${restaurant.closing_time}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Delivery Radius:</span>
                    <p className="text-gray-600 mt-1">{restaurant.delivery_radius} km</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Delivery Fee:</span>
                    <p className="text-gray-600 mt-1">${restaurant.delivery_fee.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Min Order:</span>
                    <p className="text-gray-600 mt-1">${restaurant.minimum_order_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className={`mt-1 ${restaurant.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {restaurant.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Error and Success Messages */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                  </div>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Restaurant Name *
                      </label>
                      <input
                        type="text"
                        value={restaurantForm.name}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cuisine Type
                      </label>
                      <select
                        value={restaurantForm.cuisine_type}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select Cuisine</option>
                        {CUISINE_TYPES.map(cuisine => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={restaurantForm.description}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                      rows={3}
                      placeholder="Describe your restaurant..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={restaurantForm.image_url || ''}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, image_url: e.target.value })}
                      placeholder="https://example.com/cover.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={restaurantForm.phone_number}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, phone_number: e.target.value })}
                        placeholder="e.g., 9999999999"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={restaurantForm.email}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                        placeholder="restaurant@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Restaurant Image Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Restaurant Image</h3>
                  {restaurant?.image_url && (
                    <img
                      src={restaurant.image_url}
                      alt={restaurant?.name}
                      className="w-full max-w-md h-40 object-cover rounded-lg border"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    <button
                      onClick={async () => {
                        if (!selectedImageFile) return;
                        setUploading(true);
                        setError(null);
                        setSuccess(null);
                        try {
                          const updated = await api.uploadRestaurantImage(selectedImageFile);
                          setRestaurant(updated);
                          setRestaurantForm({ ...restaurantForm, image_url: updated.image_url || '' });
                          setSuccess('Image uploaded successfully');
                          setSelectedImageFile(null);
                        } catch (err) {
                          setError('Failed to upload image');
                        } finally {
                          setUploading(false);
                        }
                      }}
                      disabled={!selectedImageFile || uploading}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition"
                    >
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={restaurantForm.address_line1}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, address_line1: e.target.value })}
                        placeholder="Street address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={restaurantForm.address_line2}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, address_line2: e.target.value })}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={restaurantForm.city}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, city: e.target.value })}
                        placeholder="City"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={restaurantForm.state}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, state: e.target.value })}
                        placeholder="State"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={restaurantForm.postal_code}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, postal_code: e.target.value })}
                        placeholder="123456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Business Hours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        value={restaurantForm.opening_time}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, opening_time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        value={restaurantForm.closing_time}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, closing_time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Delivery Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Radius (km)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={restaurantForm.delivery_radius}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, delivery_radius: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Fee ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={restaurantForm.delivery_fee}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, delivery_fee: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Order ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={restaurantForm.minimum_order_amount}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, minimum_order_amount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveRestaurant}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Restaurant'}
                  </button>
                  {restaurant && (
                    <button
                      onClick={() => setEditingRestaurant(false)}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            {/* Error and Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
              <button 
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                {showCategoryForm ? 'Cancel' : 'Add Category'}
              </button>
            </div>

            {/* Category Form */}
            {showCategoryForm && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-900">Add New Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g., Appetizers, Main Course"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={categoryForm.image_url}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    rows={2}
                    placeholder="Describe this category..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateCategory}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Creating...' : 'Create Category'}
                  </button>
                  <button
                    onClick={() => setShowCategoryForm(false)}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Categories List */}
            {categories.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No categories yet</p>
                <p className="text-sm text-gray-500 mt-1">Add categories to organize your menu items</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      {category.image_url && (
                        <img 
                          src={category.image_url} 
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-gray-600">{category.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded ${
                            category.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-4">
            {/* Error and Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
              <button 
                onClick={() => setShowMenuItemForm(!showMenuItemForm)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                {showMenuItemForm ? 'Cancel' : 'Add Menu Item'}
              </button>
            </div>

            {/* Menu Item Form */}
            {showMenuItemForm && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-900">Add New Menu Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={menuItemForm.name}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                      placeholder="e.g., Chicken Biryani"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={menuItemForm.price}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={menuItemForm.category_id}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, category_id: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value={0}>Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={menuItemForm.image_url}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preparation Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={menuItemForm.preparation_time || ''}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, preparation_time: parseInt(e.target.value) || undefined })}
                      placeholder="e.g., 15"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calories
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={menuItemForm.calories || ''}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, calories: parseInt(e.target.value) || undefined })}
                      placeholder="e.g., 350"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={menuItemForm.description}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                    rows={2}
                    placeholder="Describe this menu item..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredients (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={menuItemForm.ingredients?.join(', ') || ''}
                      onChange={(e) => setMenuItemForm({ 
                        ...menuItemForm, 
                        ingredients: e.target.value.split(',').map(ing => ing.trim()).filter(ing => ing)
                      })}
                      placeholder="e.g., Chicken, Rice, Spices"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergens (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={menuItemForm.allergens?.join(', ') || ''}
                      onChange={(e) => setMenuItemForm({ 
                        ...menuItemForm, 
                        allergens: e.target.value.split(',').map(all => all.trim()).filter(all => all)
                      })}
                      placeholder="e.g., Nuts, Dairy, Gluten"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={menuItemForm.is_vegetarian}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, is_vegetarian: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={menuItemForm.is_available}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, is_available: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Available</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateMenuItem}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Creating...' : 'Create Menu Item'}
                  </button>
                  <button
                    onClick={() => setShowMenuItemForm(false)}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Menu Items List */}
            {menuItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No menu items yet</p>
                <p className="text-sm text-gray-500 mt-1">Add menu items to showcase your food</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition ml-2"
                        title="Delete menu item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="flex gap-2 flex-wrap mb-2">
                      {item.is_vegetarian && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          Vegetarian
                        </span>
                      )}
                      {!item.is_available && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Unavailable
                        </span>
                      )}
                      {item.preparation_time && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {item.preparation_time} min
                        </span>
                      )}
                      {item.calories && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          {item.calories} cal
                        </span>
                      )}
                    </div>
                    
                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <strong>Ingredients:</strong> {item.ingredients.slice(0, 3).join(', ')}
                        {item.ingredients.length > 3 && '...'}
                      </div>
                    )}
                    
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        <strong>Allergens:</strong> {item.allergens.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'specials' && (
          <div className="space-y-4">
            {/* Error and Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {success}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Special Items
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select menu items to feature as specials. These will be highlighted to customers.
                </p>
              </div>
              <button
                onClick={handleUpdateSpecials}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Specials'}
              </button>
            </div>

            {menuItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No menu items available</p>
                <p className="text-sm text-gray-500 mt-1">Add menu items first to set specials</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 transition cursor-pointer ${
                      selectedSpecials.includes(item.id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => handleSpecialToggle(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSpecials.includes(item.id)}
                        onChange={() => handleSpecialToggle(item.id)}
                        className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          {selectedSpecials.includes(item.id) && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        )}
                        
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-24 object-cover rounded-lg mt-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        
                        <div className="flex gap-2 flex-wrap mt-2">
                          {item.is_vegetarian && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              Vegetarian
                            </span>
                          )}
                          {!item.is_available && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              Unavailable
                            </span>
                          )}
                          {item.preparation_time && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {item.preparation_time} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedSpecials.length > 0 && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">
                  Selected Special Items ({selectedSpecials.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpecials.map(itemId => {
                    const item = menuItems.find(m => m.id === itemId);
                    return item ? (
                      <span
                        key={itemId}
                        className="px-3 py-1 bg-orange-200 text-orange-800 text-sm rounded-full flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-current" />
                        {item.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
