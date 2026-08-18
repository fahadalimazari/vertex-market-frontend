import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../components/Auth/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import SellerLayout from '../layouts/SellerLayout';

import ProtectedRoute from './ProtectedRoute';
import GuestRoute from '../components/Auth/GuestRoute';
import { AdminProviders } from '../context/Admin/AdminProviders';

// Core Public Pages
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';
import Categories from '../pages/Categories/Categories';
import CategoryPage from '../pages/CategoryPage';
import NotFound from '../pages/NotFound/NotFound';
const BrandStore = lazy(() => import('../pages/Brands/BrandStore'));
import Cart from '../pages/Cart/Cart';
import Wishlist from '../pages/Wishlist/Wishlist';
import Checkout from '../pages/Checkout/Checkout';
import OrderSuccess from '../pages/Checkout/OrderSuccess';
import OrderFailed from '../pages/Checkout/OrderFailed';
const BundleDetails = lazy(() => import('../pages/Bundles/BundleDetails'));
const StoresList = lazy(() => import('../pages/Stores/StoresList'));

// Company Pages
const About = lazy(() => import('../pages/Company/About'));
const Careers = lazy(() => import('../pages/Company/Careers'));
const Press = lazy(() => import('../pages/Company/Press'));
const Blog = lazy(() => import('../pages/Company/Blog'));

// Legal Pages
const ReturnPolicy = lazy(() => import('../pages/Legal/ReturnPolicy'));
const SellerPolicy = lazy(() => import('../pages/Legal/SellerPolicy'));
const PrivacyPolicy = lazy(() => import('../pages/Legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/Legal/TermsOfService'));
const Cookies = lazy(() => import('../pages/Legal/Cookies'));

const SearchResults = lazy(() => import('../pages/Search/SearchResults'));
const Compare = lazy(() => import('../pages/Compare/Compare'));
const ProductDetails = lazy(() => import('../pages/ProductDetails/ProductDetails'));
const SellerStorefront = lazy(() => import('../pages/SellerStorefront/SellerStorefront'));
const DashboardWishlist = lazy(() => import('../pages/Dashboard/Wishlist'));
const Collections = lazy(() => import('../pages/Dashboard/Collections'));
const Orders = lazy(() => import('../pages/Dashboard/Orders'));
const OrderDetails = lazy(() => import('../pages/Dashboard/OrderDetails'));
const DashboardNotifications = lazy(() => import('../pages/Dashboard/Notifications'));
const TrackOrder = lazy(() => import('../pages/Orders/TrackOrder'));
const Returns = lazy(() => import('../pages/Orders/Returns'));
const Refunds = lazy(() => import('../pages/Orders/Refunds'));
const Support = lazy(() => import('../pages/Orders/Support'));

// Auth Pages
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/Auth/VerifyEmail'));

// User Dashboard Pages (Keep basic ones)
import DashboardHome from '../pages/Dashboard/DashboardHome';
import Settings from '../pages/Dashboard/Settings';
const DashboardSecurity = lazy(() => import('../pages/Dashboard/Security'));
const DashboardVouchers = lazy(() => import('../pages/Dashboard/Vouchers'));
const DashboardPayments = lazy(() => import('../pages/Dashboard/Payments'));
const DashboardAddresses = lazy(() => import('../pages/Dashboard/Addresses'));
const DashboardReferrals = lazy(() => import('../pages/Dashboard/ReferralRewards'));
const DashboardReviews = lazy(() => import('../pages/Dashboard/MyReviews'));

// Admin Pages (Catalog focused)
const AdminLogin = lazy(() => import('../pages/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const AdminAnalytics = lazy(() => import('../pages/Admin/Analytics'));
const AdminIntelligence = lazy(() => import('../pages/Admin/BusinessIntelligence/ExecutiveDashboard'));
const AdminDeliveries = lazy(() => import('../pages/Admin/Orders'));
const AdminCollections = lazy(() => import('../pages/Admin/Collections'));
const AdminSettings = lazy(() => import('../pages/Admin/Settings'));
const AdminCustomers = lazy(() => import('../pages/Admin/Users'));
const AdminCategories = lazy(() => import('../pages/Admin/Categories'));
const AdminSubCategories = lazy(() => import('../pages/Admin/SubCategories'));
const AdminAttributes = lazy(() => import('../pages/Admin/Attributes'));
const AdminAttributeValues = lazy(() => import('../pages/Admin/AttributeValues'));
const AdminProducts = lazy(() => import('../pages/Admin/Products'));
const AdminSellerProducts = lazy(() => import('../pages/Admin/SellerProducts'));
const CreateProduct = lazy(() => import('../pages/Admin/CreateProduct'));
const AdminSellers = lazy(() => import('../pages/Admin/Sellers'));
const AppSettingsManager = lazy(() => import('../pages/Admin/AppSettingsManager'));
const EnterpriseSettingsHub = lazy(() => import('../pages/Admin/EnterpriseSettingsHub'));
const HeroBannerManager = lazy(() => import('../pages/Admin/HeroBannerManager'));
const HeroFlashSaleManager = lazy(() => import('../pages/Admin/HeroFlashSaleManager'));
const FeaturedCategoriesManager = lazy(() => import('../pages/Admin/FeaturedCategoriesManager'));
const AdminCRM = lazy(() => import('../pages/Admin/CRM/CRM'));
const AdminSellersList = lazy(() => import('../pages/Admin/Sellers/SellersList'));
const AdminCreateSeller = lazy(() => import('../pages/Admin/Sellers/CreateSeller'));

// Seller Pages (Product focused)
const SellerDashboard = lazy(() => import('../pages/Seller/SellerDashboard'));
const SellerProducts = lazy(() => import('../pages/Seller/SellerProducts'));
const SellerStatus = lazy(() => import('../pages/Seller/SellerStatus'));
const SellerRegistration = lazy(() => import('../pages/Seller/SellerRegistration'));
const SellerAnalytics = lazy(() => import('../pages/Seller/SellerAnalytics'));
const SellerOrders = lazy(() => import('../pages/Seller/SellerOrders'));
const SellerReturns = lazy(() => import('../pages/Seller/SellerReturns'));
const SellerFinance = lazy(() => import('../pages/Seller/SellerFinance'));
const SellerInventory = lazy(() => import('../pages/Seller/SellerInventory'));
const SellerStaff = lazy(() => import('../pages/Seller/SellerStaff'));
const SellerCoupons = lazy(() => import('../pages/Seller/SellerCoupons'));
const SellerTheme = lazy(() => import('../pages/Seller/SellerTheme'));
const SellerPolicies = lazy(() => import('../pages/Seller/SellerPolicies'));
const SellerSEO = lazy(() => import('../pages/Seller/SellerSEO'));
const SellerMessages = lazy(() => import('../pages/Seller/SellerMessages'));
const SellerSupport = lazy(() => import('../pages/Seller/SellerSupport'));
const SellerSettings = lazy(() => import('../pages/Seller/SellerSettings'));

// Support & Customer Care Pages
const SupportCenter = lazy(() => import('../pages/Support/SupportCenter'));
const OrderTrackingPortal = lazy(() => import('../pages/Support/OrderTrackingPortal'));

const AuthLoader = () => (
  <div className="flex h-40 w-full items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff6a00] border-t-transparent" />
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/search" element={
          <Suspense fallback={<AuthLoader />}>
            <SearchResults />
          </Suspense>
        } />
        <Route path="/product/:slug" element={
          <Suspense fallback={<AuthLoader />}>
            <ProductDetails />
          </Suspense>
        } />
        <Route path="/seller/:sellerSlug" element={
          <Suspense fallback={<AuthLoader />}>
            <SellerStorefront />
          </Suspense>
        } />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/categories/:slug/brands/:brandSlug" element={<CategoryPage />} />
        <Route path="/categories/:categorySlug/:subCategorySlug" element={<CategoryPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/category/:slug/brands/:brandSlug" element={<CategoryPage />} />
        <Route path="/category/:slug/:subSlug" element={<CategoryPage />} />
        <Route path="/brand/:slug" element={
          <Suspense fallback={<AuthLoader />}>
            <BrandStore />
          </Suspense>
        } />
        <Route path="/brands/:slug" element={
          <Suspense fallback={<AuthLoader />}>
            <BrandStore />
          </Suspense>
        } />
        <Route path="/bundles/:slug" element={
          <Suspense fallback={<AuthLoader />}>
            <BundleDetails />
          </Suspense>
        } />
        <Route path="/stores" element={
          <Suspense fallback={<AuthLoader />}>
            <StoresList />
          </Suspense>
        } />
        <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={
        <ProtectedRoute allowedRoles={['User', 'Customer']}>
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/order-failed" element={<OrderFailed />} />
      
      {/* Legacy Dashboard Redirects */}
      <Route path="/track-order" element={<Navigate to="/account/track-order" replace />} />
      <Route path="/returns" element={<Navigate to="/account/returns" replace />} />
      <Route path="/refunds" element={<Navigate to="/account/refunds" replace />} />
      <Route path="/support" element={<Navigate to="/account/support" replace />} />
      
      {/* User Dashboard / Account */}
        <Route path="/compare" element={
          <Suspense fallback={<AuthLoader />}>
            <Compare />
          </Suspense>
        } />
        
        {/* Redirect Legacy Auth Routes */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/become-seller" element={
          <Suspense fallback={<AuthLoader />}>
            <SellerRegistration />
          </Suspense>
        } />
        <Route path="/seller/register" element={<Navigate to="/become-seller" replace />} />
        
        {/* Support & Help Routes mapped to SupportCenter */}
        <Route path="/support" element={
          <Suspense fallback={<AuthLoader />}>
            <SupportCenter />
          </Suspense>
        } />
        <Route path="/help" element={<Navigate to="/support" replace />} />
        <Route path="/contact" element={<Navigate to="/support" replace />} />
        <Route path="/faq" element={<Navigate to="/support" replace />} />
        <Route path="/track-order" element={
          <Suspense fallback={<AuthLoader />}>
            <OrderTrackingPortal />
          </Suspense>
        } />

        {/* Company & Legal Routes */}
        <Route path="/about" element={
          <Suspense fallback={<AuthLoader />}>
            <About />
          </Suspense>
        } />
        <Route path="/careers" element={
          <Suspense fallback={<AuthLoader />}>
            <Careers />
          </Suspense>
        } />
        <Route path="/press" element={
          <Suspense fallback={<AuthLoader />}>
            <Press />
          </Suspense>
        } />
        <Route path="/blog" element={
          <Suspense fallback={<AuthLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/returns" element={
          <Suspense fallback={<AuthLoader />}>
            <ReturnPolicy />
          </Suspense>
        } />
        <Route path="/seller-policy" element={
          <Suspense fallback={<AuthLoader />}>
            <SellerPolicy />
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<AuthLoader />}>
            <PrivacyPolicy />
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<AuthLoader />}>
            <TermsOfService />
          </Suspense>
        } />
        <Route path="/cookies" element={
          <Suspense fallback={<AuthLoader />}>
            <Cookies />
          </Suspense>
        } />
        
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={
        <GuestRoute>
          <AuthLayout />
        </GuestRoute>
      }>
        <Route path="login" element={
          <Suspense fallback={<AuthLoader />}>
            <Login />
          </Suspense>
        } />
        <Route path="register" element={
          <Suspense fallback={<AuthLoader />}>
            <Register />
          </Suspense>
        } />
        <Route path="forgot-password" element={
          <Suspense fallback={<AuthLoader />}>
            <ForgotPassword />
          </Suspense>
        } />
        <Route path="reset-password" element={
          <Suspense fallback={<AuthLoader />}>
            <ResetPassword />
          </Suspense>
        } />
        <Route path="verify-email" element={
          <Suspense fallback={<AuthLoader />}>
            <VerifyEmail />
          </Suspense>
        } />
      </Route>

      <Route path="/account" element={
        <ProtectedRoute allowedRoles={['User', 'Customer']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId" element={<OrderDetails />} />
        <Route path="track-order" element={
          <Suspense fallback={<AuthLoader />}>
            <TrackOrder />
          </Suspense>
        } />
        <Route path="returns" element={
          <Suspense fallback={<AuthLoader />}>
            <Returns />
          </Suspense>
        } />
        <Route path="refunds" element={
          <Suspense fallback={<AuthLoader />}>
            <Refunds />
          </Suspense>
        } />
        <Route path="support" element={
          <Suspense fallback={<AuthLoader />}>
            <Support />
          </Suspense>
        } />
        <Route path="notifications" element={
          <Suspense fallback={<AuthLoader />}>
            <DashboardNotifications />
          </Suspense>
        } />
        <Route path="wishlist" element={
          <Suspense fallback={<AuthLoader />}>
            <DashboardWishlist />
          </Suspense>
        } />
        <Route path="collections" element={
          <Suspense fallback={<AuthLoader />}>
            <Collections />
          </Suspense>
        } />
        <Route path="settings" element={<Settings />} />
        <Route path="security" element={
          <Suspense fallback={<AuthLoader />}>
            <DashboardSecurity />
          </Suspense>
        } />
        <Route path="vouchers" element={
          <Suspense fallback={<AuthLoader />}>
            <DashboardVouchers />
          </Suspense>
        } />
        <Route path="payments" element={
          <Suspense fallback={<AuthLoader />}>
            <DashboardPayments />
          </Suspense>
        } />
        <Route path="addresses" element={
          <Suspense fallback={<AuthLoader />}>
            <DashboardAddresses />
          </Suspense>
        } />
        <Route path="referrals" element={
          <Suspense fallback={<AuthLoader />}>
            <DashboardReferrals />
          </Suspense>
        } />
        <Route path="reviews" element={
          <Suspense fallback={<AuthLoader />}>
            <DashboardReviews />
          </Suspense>
        } />
      </Route>

      {/* Seller Portal */}
      <Route path="/seller/status" element={
        <Suspense fallback={<AuthLoader />}>
          <SellerStatus />
        </Suspense>
      } />
      <Route path="/seller" element={
        <Suspense fallback={<AuthLoader />}>
          <SellerLayout />
        </Suspense>
      }>
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="analytics" element={<SellerAnalytics />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="returns" element={<SellerReturns />} />
        <Route path="finance" element={<SellerFinance />} />
        <Route path="inventory" element={<SellerInventory />} />
        <Route path="staff" element={<SellerStaff />} />
        <Route path="coupons" element={<SellerCoupons />} />
        <Route path="theme" element={<SellerTheme />} />
        <Route path="policies" element={<SellerPolicies />} />
        <Route path="seo" element={<SellerSEO />} />
        <Route path="messages" element={<SellerMessages />} />
        <Route path="support" element={<SellerSupport />} />
        <Route path="settings" element={<SellerSettings />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin/login" element={
        <Suspense fallback={<AuthLoader />}>
          <AdminProviders>
            <AdminLogin />
          </AdminProviders>
        </Suspense>
      } />
      <Route path="admin" element={
        <Suspense fallback={<AuthLoader />}>
          <AdminProviders>
            <AdminLayout />
          </AdminProviders>
        </Suspense>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="intelligence" element={<AdminIntelligence />} />
        <Route path="orders" element={<AdminDeliveries />} />
        <Route path="deliveries" element={<AdminDeliveries />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="customers" element={<AdminCustomers />} />
        
        {/* Core Catalog Foundation */}
        <Route path="categories" element={<AdminCategories />} />
        <Route path="featured-categories" element={<FeaturedCategoriesManager />} />
        <Route path="subcategories" element={<AdminSubCategories />} />
        <Route path="attributes" element={<AdminAttributes />} />
        <Route path="attribute-values" element={<AdminAttributeValues />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="seller-products" element={<AdminSellerProducts />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="app-settings" element={<AppSettingsManager />} />
        <Route path="settings-hub" element={<EnterpriseSettingsHub />} />
        <Route path="hero-banners" element={<HeroBannerManager />} />
        <Route path="hero-flash-sale" element={<HeroFlashSaleManager />} />
        <Route path="crm" element={<AdminCRM />} />
        <Route path="sellers" element={<AdminSellersList />} />
        <Route path="sellers/create" element={<AdminCreateSeller />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
