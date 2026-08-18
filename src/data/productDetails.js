export const productDetailsMock = {
  variants: [
    { id: 'v-1', color: 'Titanium Gray', storage: '256GB', price: 289999, stock: 12, sku: 'GAL-S23-TG256', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300' },
    { id: 'v-2', color: 'Titanium Gray', storage: '512GB', price: 319999, stock: 8, sku: 'GAL-S23-TG512', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300' },
    { id: 'v-3', color: 'Phantom Black', storage: '256GB', price: 289999, stock: 0, sku: 'GAL-S23-PB256', image: 'https://images.unsplash.com/photo-1609599006353-e629eeabfeae?q=80&w=300' },
    { id: 'v-4', color: 'Phantom Black', storage: '512GB', price: 319999, stock: 5, sku: 'GAL-S23-PB512', image: 'https://images.unsplash.com/photo-1609599006353-e629eeabfeae?q=80&w=300' }
  ],
  gallery: [
    { type: 'image', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1609599006353-e629eeabfeae?q=80&w=600' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?q=80&w=600' }
  ],
  specs: [
    { category: 'General', attribute: 'Model', value: 'SM-S918B/DS' },
    { category: 'General', attribute: 'OS', value: 'Android 13, One UI 5.1' },
    { category: 'Display', attribute: 'Type', value: 'Dynamic AMOLED 2X, 120Hz' },
    { category: 'Display', attribute: 'Size', value: '6.8 inches' },
    { category: 'Performance', attribute: 'Processor', value: 'Snapdragon 8 Gen 2' },
    { category: 'Camera', attribute: 'Rear', value: '200 MP + 10 MP + 10 MP + 12 MP' },
    { category: 'Battery', attribute: 'Capacity', value: '5000 mAh' }
  ],
  features: [
    '200MP Ultra-high resolution primary sensor with OIS',
    'Integrated S-Pen stylus with ultra-low latency response',
    'Qualcomm Snapdragon 8 Gen 2 optimized for Galaxy platforms',
    'Corning Gorilla Glass Victus 2 front and back protections'
  ],
  boxContents: 'Smartphone, S-Pen, USB Type-C Cable, SIM ejector tool, Warranty documents',
  seller: {
    logo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=150',
    name: 'Vertex Electro Store',
    rating: 4.8,
    followers: 12500,
    responseRate: 98,
    responseTime: '15 mins',
    totalProducts: 45,
    joinedDate: '2025-01-20'
  },
  reviews: [
    { id: 'rev-1', customer: 'Ali Ahmed', rating: 5, comment: 'Simply the best camera phone on the market. S-Pen is extremely handy.', date: '2026-07-01', helpfulVotes: 12, isVerified: true },
    { id: 'rev-2', customer: 'Zara Sheikh', rating: 4, comment: 'Incredible performance, but battery life is average under heavy gaming.', date: '2026-06-15', helpfulVotes: 4, isVerified: true },
    { id: 'rev-3', customer: 'Fahad Mazari', rating: 5, comment: 'Display is gorgeous. Peak brightness is outstanding.', date: '2026-06-10', helpfulVotes: 19, isVerified: true }
  ],
  faqs: [
    { id: 'q-1', question: 'Does this box include a power charging brick?', answer: 'No, Samsung has omitted charger adapters from the boxes. It contains only USB Type-C cable.', helpfulCount: 45 },
    { id: 'q-2', question: 'Is the S-Pen included inside the phone slot?', answer: 'Yes, it comes integrated and pre-installed inside the bottom slot of the phone.', helpfulCount: 22 }
  ],
  frequentlyBought: [
    { id: 101, name: 'Samsung 45W Charger Adaptor', price: 6500, image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=150' },
    { id: 102, name: 'Spigen Tough Armor Case', price: 3500, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=150' }
  ]
};

export const productDetails = productDetailsMock;
export default productDetailsMock;

