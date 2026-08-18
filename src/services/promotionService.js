import { promotions, bundleOffers, freeShippingCampaigns } from '../data/promotions';
import { coupons } from '../data/coupons';
import { flashSales } from '../data/flashSales';
import { vouchers } from '../data/vouchers';

class PromotionService {
  /**
   * Validation Rules:
   * - Expiry Date
   * - Minimum Order
   * - Usage Limit
   * - Per User Limit
   * - Product/Category/Brand/Seller Restriction
   */
  async validateCoupon(code, cartItems, subtotal, userId = 'mock-user') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        
        if (!coupon) return reject(new Error('Invalid coupon code.'));
        if (coupon.status !== 'active') return reject(new Error('This coupon is no longer active.'));
        
        const now = new Date();
        if (new Date(coupon.validFrom) > now) return reject(new Error('This coupon is not active yet.'));
        if (new Date(coupon.validTo) < now) return reject(new Error('This coupon has expired.'));
        
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          return reject(new Error('This coupon has reached its usage limit.'));
        }

        if (subtotal < coupon.minimumOrder) {
          return reject(new Error(`Minimum order amount of $${coupon.minimumOrder} is required.`));
        }

        // Check restrictions
        let eligibleSubtotal = 0;
        let hasEligibleItems = false;

        cartItems.forEach(item => {
          let isEligible = true;

          if (coupon.applicableProducts?.length > 0 && !coupon.applicableProducts.includes(item.productId)) {
            isEligible = false;
          }
          if (coupon.applicableCategories?.length > 0 && !coupon.applicableCategories.includes(item.category)) {
            isEligible = false;
          }
          if (coupon.applicableBrands?.length > 0 && !coupon.applicableBrands.includes(item.brand)) {
            isEligible = false;
          }
          if (coupon.applicableSellers?.length > 0 && !coupon.applicableSellers.includes(item.sellerId)) {
            isEligible = false;
          }

          if (isEligible) {
            hasEligibleItems = true;
            eligibleSubtotal += (item.price * item.quantity);
          }
        });

        // Specific restriction check
        if (
          coupon.applicableProducts?.length > 0 || 
          coupon.applicableCategories?.length > 0 || 
          coupon.applicableBrands?.length > 0 || 
          coupon.applicableSellers?.length > 0
        ) {
          if (!hasEligibleItems) {
            return reject(new Error('This coupon is not applicable to any items in your cart.'));
          }
        } else {
          // Applies to all items
          eligibleSubtotal = subtotal;
        }

        resolve({ ...coupon, eligibleSubtotal });
      }, 500); // Simulate API latency
    });
  }

  calculateDiscount(coupon, subtotal, eligibleSubtotal) {
    if (!coupon) return 0;
    
    // Safety check
    const baseAmount = eligibleSubtotal || subtotal;
    let discount = 0;

    if (coupon.discountType === 'percentage') {
      discount = (baseAmount * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }

    // Ensure we don't discount more than the eligible amount
    return Math.min(discount, baseAmount);
  }

  // Flash Sales
  async getActiveFlashSales() {
    return new Promise(resolve => {
      setTimeout(() => {
        const now = new Date();
        resolve(flashSales.filter(fs => new Date(fs.startTime) <= now && new Date(fs.endTime) >= now && fs.status === 'active'));
      }, 300);
    });
  }

  async getUpcomingFlashSales() {
    return new Promise(resolve => {
      setTimeout(() => {
        const now = new Date();
        resolve(flashSales.filter(fs => new Date(fs.startTime) > now && fs.status === 'upcoming'));
      }, 300);
    });
  }

  // Vouchers
  async getAllVouchers() {
    return new Promise(resolve => {
      setTimeout(() => resolve(vouchers), 300);
    });
  }

  // General Promotions
  async getBundleOffers() {
    return new Promise(resolve => {
      setTimeout(() => resolve(bundleOffers), 300);
    });
  }

  async getFreeShippingCampaigns() {
    return new Promise(resolve => {
      setTimeout(() => resolve(freeShippingCampaigns), 300);
    });
  }
}

export const promotionService = new PromotionService();
