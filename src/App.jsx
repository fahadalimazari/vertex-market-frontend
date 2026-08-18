import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/common/ScrollToTop'
import { CartProvider } from './context/CartContext'
import { AIProvider } from './context/AIContext'
import { SearchProvider } from './context/SearchContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { CompareProvider } from './context/CompareContext'
import { CollectionProvider } from './context/CollectionContext'
import { NotificationProvider } from './context/NotificationContext'
import { SellerProvider } from './context/SellerContext'
import { StoreProvider } from './context/StoreContext'
import { InventoryProvider } from './context/InventoryContext'
import { AnalyticsProvider } from './context/AnalyticsContext'
import { ProductProvider } from './context/ProductContext'
import { CheckoutProvider } from './context/CheckoutContext'
import { ReviewProvider } from './context/ReviewContext'
import { PromotionProvider } from './context/PromotionContext'
import { OrderProvider } from './context/OrderContext'
import { SupportProvider } from './context/SupportContext'
import { LocalizationProvider } from './context/LocalizationContext'
import { TenantProvider } from './tenant/tenantContext'
import { RecommendationProvider } from './context/RecommendationContext'
import AIFloatingButton from './components/AI/AIFloatingButton'
import AIChatPanel from './components/AI/AIChatPanel'
import SearchOverlay from './components/Search/SearchOverlay'
import ErrorBoundary from './components/System/ErrorBoundary'
import NetworkStatus from './components/System/NetworkStatus'
import SkipToContent from './components/Accessibility/SkipToContent'
import NotificationToast from './components/Notifications/NotificationToast'

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <ErrorBoundary>
      <TenantProvider>
        <AuthProvider>
          <NotificationProvider>
            <SellerProvider>
              <StoreProvider>
                <InventoryProvider>
                  <AnalyticsProvider>
                    <ProductProvider>
                      <LocalizationProvider>
                        <OrderProvider>
                          <SupportProvider>
                            <PromotionProvider>
                              <CartProvider>
                                <WishlistProvider>
                                  <CompareProvider>
                                    <CollectionProvider>
                                      <RecommendationProvider>
                                        <AIProvider>
                                          <CheckoutProvider>
                                            <ReviewProvider>
                                              <SearchProvider>
                                                <SkipToContent />
                                                <NetworkStatus />
                                                <ScrollToTop />
                                                <div id="main-content" className="flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-[#ff6a00] selection:text-white">
                                                  <AppRoutes />
                                                  <NotificationToast />
                                                  {isHomePage && (
                                                    <>
                                                      <AIFloatingButton />
                                                      <AIChatPanel />
                                                    </>
                                                  )}
                                                  <SearchOverlay />
                                                </div>
                                              </SearchProvider>
                                            </ReviewProvider>
                                          </CheckoutProvider>
                                        </AIProvider>
                                      </RecommendationProvider>
                                    </CollectionProvider>
                                  </CompareProvider>
                                </WishlistProvider>
                              </CartProvider>
                            </PromotionProvider>
                          </SupportProvider>
                        </OrderProvider>
                      </LocalizationProvider>
                    </ProductProvider>
                  </AnalyticsProvider>
                </InventoryProvider>
              </StoreProvider>
            </SellerProvider>
          </NotificationProvider>
        </AuthProvider>
      </TenantProvider>
    </ErrorBoundary>
  )
}



export default App

