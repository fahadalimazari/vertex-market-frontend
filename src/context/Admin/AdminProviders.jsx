import { AdminProvider } from './AdminContext';
import { RoleProvider } from './RoleContext';
import { UserManagementProvider } from './UserManagementContext';
import { SellerManagementProvider } from './SellerManagementContext';
import { ProductManagementProvider } from './ProductManagementContext';
import { OrderManagementProvider } from './OrderManagementContext';
import { CouponProvider } from './CouponContext';

import { CMSProvider } from './CMSContext';
import { MarketplaceSettingsProvider } from './MarketplaceSettingsContext';
import { LogsProvider } from './LogsContext';

export const AdminProviders = ({ children }) => {
  return (
    <AdminProvider>
      <RoleProvider>
        <UserManagementProvider>
          <SellerManagementProvider>
            <ProductManagementProvider>
              <OrderManagementProvider>
                <CouponProvider>

                    <CMSProvider>
                      <MarketplaceSettingsProvider>
                        <LogsProvider>
                          {children}
                        </LogsProvider>
                      </MarketplaceSettingsProvider>
                    </CMSProvider>

                </CouponProvider>
              </OrderManagementProvider>
            </ProductManagementProvider>
          </SellerManagementProvider>
        </UserManagementProvider>
      </RoleProvider>
    </AdminProvider>
  );
};
