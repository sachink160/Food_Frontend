# Food Finder Frontend

A modern React + TypeScript frontend for the Food Finder platform, featuring comprehensive restaurant discovery, management, and user profile functionality.

## 🚀 Features

### 🔐 Authentication & User Management
- **Phone-based login** with automatic user creation
- **Multi-role support** (customer, restaurant_owner)
- **JWT token authentication** with automatic token management
- **Profile management** with comprehensive user data
- **Address management** with default address support

### 🍽️ Restaurant Discovery (Customer Features)
- **Advanced search filters** by city and cuisine type
- **Location-based search** with geolocation support
- **Restaurant code search** for direct access
- **Popular and new restaurant listings**
- **Comprehensive restaurant information display**
- **Responsive restaurant cards** with ratings and reviews

### 🏪 Restaurant Management (Owner Features)
- **Complete restaurant profile management**
- **Category management** for menu organization
- **Menu item management** with detailed food information
- **Special items management** for featured dishes
- **Delivery settings** configuration
- **Business hours and location management**

### 🎨 UI/UX Features
- **Modern, responsive design** with Tailwind CSS
- **Loading states** and error handling
- **Form validation** with user feedback
- **Geolocation integration** for location-based features
- **Mobile-first design** approach

## 📋 Requirements

- **Node.js 18+**
- **React 18+**
- **TypeScript 5+**
- **Vite** for build tooling
- **Tailwind CSS** for styling

## ⚙️ Environment Setup

Create `.env` file in the Frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000

# Optional: Enable debug mode
VITE_DEBUG_MODE=false

# Optional: Default search radius in kilometers
VITE_DEFAULT_SEARCH_RADIUS=5

# Optional: Maximum restaurants to load per page
VITE_MAX_RESTAURANTS_PER_PAGE=20
```

## 🛠️ Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## 🏗️ Project Structure

```
Frontend/
├── src/
│   ├── components/           # React components
│   │   ├── CustomerDashboard.tsx    # Customer restaurant discovery
│   │   ├── OwnerDashboard.tsx       # Restaurant owner management
│   │   ├── Profile.tsx              # User profile management
│   │   ├── Login.tsx                # Authentication component
│   │   ├── Header.tsx               # Navigation header
│   │   └── RestaurantCard.tsx       # Restaurant display card
│   ├── context/              # React context providers
│   │   └── AuthContext.tsx         # Authentication context
│   ├── services/             # API services
│   │   └── api.ts                   # API client with all endpoints
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts                # All type definitions
│   ├── config/               # Configuration files
│   │   └── constants.ts            # App constants and configuration
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🔌 API Integration

### Authentication Endpoints
- `POST /auth/login` - Phone-based login with role selection
- Automatic token storage and management
- Profile incomplete detection and handling

### User Management Endpoints
- `GET /user/me` - Get current user profile
- `PATCH /user/me` - Update user profile
- `GET /user/me/addresses` - List user addresses
- `POST /user/me/addresses` - Create new address
- `PATCH /user/me/addresses/{id}` - Update address
- `DELETE /user/me/addresses/{id}` - Delete address

### Restaurant Owner Endpoints
- `GET /owner/restaurant` - Get my restaurant details
- `POST /owner/restaurant` - Create or update restaurant
- `GET /owner/restaurant/categories` - List categories
- `POST /owner/restaurant/categories` - Create category
- `PATCH /owner/restaurant/categories/{id}` - Update category
- `DELETE /owner/restaurant/categories/{id}` - Delete category
- `GET /owner/restaurant/menu` - List menu items
- `POST /owner/restaurant/menu` - Create menu item
- `PATCH /owner/restaurant/menu/{id}` - Update menu item
- `DELETE /owner/restaurant/menu/{id}` - Delete menu item
- `GET /owner/restaurant/specials` - Get special items
- `POST /owner/restaurant/specials` - Set special items

### Public Restaurant Endpoints
- `GET /restaurants` - List restaurants with filters
- `GET /restaurants/{id}` - Get restaurant details
- `GET /search/nearby` - Find nearby restaurants
- `GET /search/popular` - Get popular restaurants
- `GET /search/new` - Get newest restaurants
- `GET /search/code/{code}` - Find restaurant by code

## 🎨 Component Features

### CustomerDashboard
- **Search by restaurant code** with real-time validation
- **Advanced filtering** by city and cuisine type
- **Location-based search** with geolocation
- **Tabbed interface** for different restaurant views
- **Responsive grid layout** for restaurant cards
- **Loading states** and error handling

### OwnerDashboard
- **Restaurant profile management** with comprehensive forms
- **Category management** with CRUD operations
- **Menu item management** with detailed food information
- **Special items management** for featured dishes
- **Tabbed interface** for different management areas
- **Form validation** and user feedback

### Profile
- **User profile editing** with validation
- **Address management** with default address support
- **Role display** and management
- **Form-based editing** with save/cancel functionality

### RestaurantCard
- **Comprehensive restaurant information** display
- **Rating and review** information
- **Address and contact** details
- **Status indicators** (open/closed, active/inactive)
- **Responsive design** for all screen sizes

## 🔧 Configuration

### API Configuration
- **Base URL**: Configurable via environment variables
- **Request timeout**: 10 seconds default
- **Error handling**: Comprehensive error messages
- **Token management**: Automatic storage and refresh

### UI Configuration
- **Cuisine types**: Predefined list for filtering
- **Store sizes**: Options for restaurant setup
- **Validation patterns**: Phone, email, postal code validation
- **Success/error messages**: User-friendly feedback

### Geolocation Configuration
- **Default search radius**: 5km (configurable)
- **Location error handling**: User-friendly error messages
- **Permission handling**: Graceful fallback for denied permissions

## 🚀 Key Features Implementation

### Authentication Flow
1. **Phone-based login** with role selection
2. **Automatic user creation** for new phone numbers
3. **Profile backfill** for missing user data
4. **Token management** with automatic storage
5. **Role-based navigation** and feature access

### Restaurant Discovery
1. **Multi-tab interface** (All, Popular, New, Nearby)
2. **Advanced filtering** by city and cuisine
3. **Geolocation integration** for nearby search
4. **Restaurant code search** for direct access
5. **Responsive card layout** with comprehensive information

### Restaurant Management
1. **Comprehensive restaurant forms** with validation
2. **Category management** with CRUD operations
3. **Menu item management** with detailed fields
4. **Special items management** for featured dishes
5. **Delivery settings** configuration

### User Experience
1. **Loading states** throughout the application
2. **Error handling** with user-friendly messages
3. **Form validation** with real-time feedback
4. **Responsive design** for all devices
5. **Accessibility** considerations

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with new phone number (creates user)
- [ ] Login with existing phone number
- [ ] Role-based navigation (customer vs owner)
- [ ] Restaurant discovery with filters
- [ ] Location-based search
- [ ] Restaurant code search
- [ ] Profile management
- [ ] Address management
- [ ] Restaurant owner features
- [ ] Category management
- [ ] Menu item management
- [ ] Special items management

### Browser Compatibility
- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check `VITE_API_BASE_URL` in `.env`
   - Ensure backend server is running
   - Check CORS configuration

2. **Geolocation Not Working**
   - Ensure HTTPS or localhost
   - Check browser permissions
   - Verify location services are enabled

3. **Login Issues**
   - Check phone number format (10 digits)
   - Verify backend authentication
   - Check token storage in localStorage

4. **Build Issues**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

### Debug Mode
Enable debug mode by setting `VITE_DEBUG_MODE=true` in `.env` to see:
- API request/response logging
- Authentication state changes
- Component state updates

## 📈 Performance

### Optimization Features
- **Code splitting** with React.lazy
- **Image optimization** with proper sizing
- **API response caching** where appropriate
- **Efficient state management** with React hooks
- **Minimal re-renders** with proper dependency arrays

### Bundle Analysis
```bash
npm run build
npx vite-bundle-analyzer dist
```

## 🔄 Future Enhancements

- **Order management** system
- **Real-time notifications** with WebSockets
- **Image upload** for restaurants and menu items
- **Advanced search** with filters and sorting
- **Favorites** and wishlist functionality
- **Reviews and ratings** system
- **Payment integration** for orders
- **Push notifications** for mobile
- **Offline support** with service workers
- **PWA features** for mobile app-like experience

## 📄 License

This project is part of the Food Finder platform. Please refer to the main project documentation for licensing information.
