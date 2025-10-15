import { Store, User, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeView: 'browse' | 'owner' | 'profile';
  onViewChange: (view: 'browse' | 'owner' | 'profile') => void;
}

export function Header({ activeView, onViewChange }: HeaderProps) {
  const { user, logout } = useAuth();
  
  // Debug logging
  console.log('Header user:', user);
  console.log('Header user roles:', user?.roles);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-600 rounded-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Food Finder</h1>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => onViewChange('browse')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeView === 'browse'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Browse
            </button>

            {(user?.roles || []).includes('restaurant_owner') && (
              <button
                onClick={() => onViewChange('owner')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeView === 'owner'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Store className="w-4 h-4" />
                My Restaurant
              </button>
            )}

            <button
              onClick={() => onViewChange('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeView === 'profile'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition ml-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
