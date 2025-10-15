import { useState, useEffect } from 'react';
import { User, MapPin, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Address } from '../types';

export function Profile() {
  const { user, refreshUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    username: '',
  });
  const [addressForm, setAddressForm] = useState({
    title: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false,
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        email: user.email || '',
        username: user.username || '',
      });
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.updateUser(profileForm);
      await refreshUser();
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleSaveAddress = async () => {
    try {
      await api.createAddress(addressForm);
      await loadAddresses();
      setAddingAddress(false);
      setAddressForm({
        title: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        is_default: false,
      });
      alert('Address added successfully!');
    } catch (error) {
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Delete this address?')) return;
    try {
      await api.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (error) {
      alert('Failed to delete address');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        </div>

        {!editingProfile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-lg font-medium text-gray-900">{user.phone_number}</p>
              </div>
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-medium text-gray-900">{user.full_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="text-lg font-medium text-gray-900">{user.username || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-900">{user.email || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Roles</p>
              <div className="flex gap-2 mt-2">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full"
                  >
                    {role === 'restaurant_owner' ? 'Restaurant Owner' : 'Customer'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => setEditingProfile(false)}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
          </div>
          {!addingAddress && (
            <button
              onClick={() => setAddingAddress(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          )}
        </div>

        {addingAddress && (
          <div className="mb-6 p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
            <h3 className="font-semibold text-gray-900 mb-4">New Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={addressForm.title}
                  onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                  placeholder="e.g., Home, Office"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  value={addressForm.address_line1}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={addressForm.address_line2}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  value={addressForm.postal_code}
                  onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={addressForm.is_default}
                onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveAddress}
                className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                Save Address
              </button>
              <button
                onClick={() => setAddingAddress(false)}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {addresses.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No addresses saved</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border-2 rounded-lg transition ${
                  address.is_default
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {address.title && (
                        <span className="font-semibold text-gray-900">{address.title}</span>
                      )}
                      {address.is_default && (
                        <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{address.address_line1}</p>
                    {address.address_line2 && (
                      <p className="text-gray-700">{address.address_line2}</p>
                    )}
                    <p className="text-gray-700">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
