import { usePromotions } from '../../hooks/usePromotions';
import FlashSaleBanner from '../../components/Promotions/FlashSaleBanner';
import ProductCard from '../../components/Products/ProductCard';
import { products } from '../../data/products';

const FlashSale = () => {
  const { flashSales } = usePromotions();
  const activeSale = flashSales[0];

  if (!activeSale) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Flash Sales</h2>
          <p className="text-gray-500">Check back later for amazing deals!</p>
        </div>
      </div>
    );
  }

  // Get products that are in the flash sale
  const flashProducts = products.filter(p => activeSale.products.some(fp => fp.productId === p.id));

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <FlashSaleBanner flashSale={activeSale} />

        <div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Flash Sale Products</h2>
              <p className="text-gray-500">Hurry up! Limited stock available.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {flashProducts.map(product => {
              const fp = activeSale.products.find(f => f.productId === product.id);
              return (
                <ProductCard key={product.id} product={{ ...product, price: fp.flashPrice, originalPrice: fp.originalPrice }} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
