import { MapPin, Star, Phone, Clock } from 'lucide-react';
import type { Restaurant } from '../types';
import { getPublicUrl } from '../services/api';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {restaurant.image_url ? (
        <img
          src={getPublicUrl(restaurant.image_url)}
          alt={restaurant.name}
          className="h-48 w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
          <span className="text-6xl font-bold text-white opacity-20">
            {restaurant.name.charAt(0)}
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {restaurant.name}
            </h3>
            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
              {restaurant.unique_code}
            </span>
          </div>
          {restaurant.rating > 0 && (
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-green-600 fill-current" />
              <span className="text-sm font-semibold text-green-700">
                {restaurant.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {restaurant.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {restaurant.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {restaurant.address_line1}
              {restaurant.address_line2 && `, ${restaurant.address_line2}`}
              {`, ${restaurant.city}`}
            </span>
          </div>
          {restaurant.phone_number && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{restaurant.phone_number}</span>
            </div>
          )}
          {restaurant.opening_time && restaurant.closing_time && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{restaurant.opening_time} - {restaurant.closing_time}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              restaurant.is_active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {restaurant.is_active ? 'Open Now' : 'Closed'}
          </span>
          {restaurant.total_reviews > 0 && (
            <span className="text-xs text-gray-500">
              {restaurant.total_reviews} reviews
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
