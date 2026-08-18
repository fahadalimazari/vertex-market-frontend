import { productDetailsMock } from '../data/productDetails';

export const productDetailsService = {
  getProductDetailsBySlug: (slug) => {
    // Future API call: return apiService.get(ENDPOINTS.PRODUCT.DETAIL(slug));
    return Promise.resolve(productDetailsMock);
  }
};

export default productDetailsService;
