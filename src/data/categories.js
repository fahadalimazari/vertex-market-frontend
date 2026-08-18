export const categories = [
  {
    id: 1,
    name: "Mobiles & Tablets",
    slug: "mobiles-and-tablets",
    icon: "FiSmartphone",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Latest smartphones and tablets from top brands.",
    featured: true,
    sortOrder: 1,
    isActive: true,
    productCount: 1250,
    subCategories: [
      { id: 101, name: "Smartphones", slug: "smartphones" },
      { id: 102, name: "Tablets", slug: "tablets" },
      { id: 103, name: "Accessories", slug: "accessories" },
      { id: 104, name: "Wearables", slug: "wearables" },
      { id: 105, name: "Mobile Parts", slug: "mobile-parts" }
    ],
    brands: [
      { id: 201, name: "Apple", slug: "apple", image: null },
      { id: 202, name: "Samsung", slug: "samsung", image: null },
      { id: 203, name: "Xiaomi", slug: "xiaomi", image: null },
      { id: 204, name: "OnePlus", slug: "oneplus", image: null },
      { id: 205, name: "Vivo", slug: "vivo", image: null }
    ],
    featuredProducts: [
      {
        id: 301,
        name: "Samsung Galaxy S23 Ultra",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
        price: 289999,
        discount: 10
      },
      {
        id: 302,
        name: "iPhone 15 Pro Max",
        image: "https://images.unsplash.com/photo-1609599006353-e629eeabfeae?auto=format&fit=crop&w=300&q=80",
        price: 349999,
        discount: 5
      }
    ],
    banner: {
      title: "Latest Arrivals in Mobiles",
      link: "/category/mobiles-and-tablets/latest",
      image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=300&q=80"
    }
  },
  {
    id: 2,
    name: "Electronics",
    slug: "electronics",
    icon: "FiMonitor",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
    description: "Computers, cameras, and audio devices.",
    featured: true,
    sortOrder: 2,
    isActive: true,
    productCount: 3400,
    subCategories: [
      { id: 106, name: "Laptops", slug: "laptops" },
      { id: 107, name: "Gaming Consoles", slug: "gaming-consoles" },
      { id: 108, name: "Cameras", slug: "cameras" },
      { id: 109, name: "Audio", slug: "audio" }
    ],
    brands: [
      { id: 206, name: "Sony", slug: "sony", image: null },
      { id: 207, name: "LG", slug: "lg", image: null },
      { id: 208, name: "Panasonic", slug: "panasonic", image: null },
      { id: 209, name: "Philips", slug: "philips", image: null }
    ],
    featuredProducts: [],
    banner: null
  },
  {
    id: 3,
    name: "Computers",
    slug: "computers",
    icon: "FiCpu",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80",
    description: "Desktops, components, and networking.",
    featured: false,
    sortOrder: 3,
    isActive: true,
    productCount: 890,
    subCategories: [
      { id: 110, name: "Desktops", slug: "desktops" },
      { id: 111, name: "Monitors", slug: "monitors" },
      { id: 112, name: "Components", slug: "components" },
      { id: 113, name: "Networking", slug: "networking" }
    ],
    brands: [],
    featuredProducts: [],
    banner: null
  },
  {
    id: 4,
    name: "TV & Appliances",
    slug: "tv-and-home-appliances",
    icon: "FiTv",
    image: "https://images.unsplash.com/photo-1593453918093-8f308edb9e45?auto=format&fit=crop&w=800&q=80",
    description: "Televisions, refrigerators, and ACs.",
    featured: false,
    sortOrder: 4,
    isActive: true,
    productCount: 450,
    subCategories: [],
    brands: [],
    featuredProducts: [],
    banner: null
  },
  {
    id: 5,
    name: "Men's Fashion",
    slug: "mens-fashion",
    icon: "FiUser",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80",
    description: "Clothing, shoes, and accessories for men.",
    featured: true,
    sortOrder: 5,
    isActive: true,
    productCount: 5200,
    subCategories: [
      { id: 114, name: "Clothing", slug: "clothing" },
      { id: 115, name: "Shoes", slug: "shoes" },
      { id: 116, name: "Watches", slug: "watches" }
    ],
    brands: [
      { id: 210, name: "Nike", slug: "nike", image: null },
      { id: 211, name: "Adidas", slug: "adidas", image: null }
    ],
    featuredProducts: [],
    banner: null
  },
  {
    id: 6,
    name: "Gaming",
    slug: "gaming",
    icon: "FiHeadphones",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    description: "Consoles, games, and gaming accessories.",
    featured: true,
    sortOrder: 6,
    isActive: true,
    productCount: 890,
    subCategories: [],
    brands: [],
    featuredProducts: [],
    banner: null
  }
];
