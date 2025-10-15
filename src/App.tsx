import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { CustomerDashboard } from './components/CustomerDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { Profile } from './components/Profile';

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeView, setActiveView] = useState<'browse' | 'owner' | 'profile'>('browse');

  // Debug logging
  console.log('App state:', { isAuthenticated, isLoading, user, activeView });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header activeView={activeView} onViewChange={setActiveView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'browse' && <CustomerDashboard />}
        {activeView === 'owner' && <OwnerDashboard />}
        {activeView === 'profile' && <Profile />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
