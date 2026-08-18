export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/user/profile',
    ADDRESS: '/user/address',
  },
  PRODUCT: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    BY_SLUG: (slug) => `/products/${slug}`,
    FEATURED: '/products/featured',
    RELATED: (id) => `/products/${id}/related`,
  },
  CATEGORY: {
    LIST: '/categories',
    ACTIVE: '/categories/active',
  },
  SUBCATEGORY: {
    LIST: '/subcategories',
    ACTIVE: '/subcategories/active',
    BY_CATEGORY: (categoryId) => `/subcategories/category/${categoryId}`,
  },
  ATTRIBUTE: {
    LIST: '/attributes',
    ACTIVE: '/attributes/active',
    BY_SUBCATEGORY: (subCategoryId) => `/attributes/subcategory/${subCategoryId}`,
  },
  ATTRIBUTE_VALUE: {
    LIST: '/attribute-values',
    ACTIVE: '/attribute-values/active',
    BY_ATTRIBUTE: (attributeId) => `/attribute-values/attribute/${attributeId}`,
  },
  PRODUCT_ATTRIBUTE: {
    BULK: '/product-attributes/bulk'
  },
  ORDER: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
  },
  SELLER: {
    REGISTER: '/sellers/register',
    PRODUCTS: '/sellers/products',
  },
  ADMIN: {
    USERS: '/admin/users',
    SELLERS: '/admin/sellers',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
  },
  AI: {
    CHAT: '/ai/chat',
  },
  SEARCH: {
    QUERY: '/search',
  },
  UPLOAD: {
    FILE: '/upload',
  }
};
export default ENDPOINTS;
