import { useBrands } from '../../hooks/useBrands';
import BrandCard from '../../components/Brands/BrandCard';

const BrandsListPage = () => {
  const { data: brands, loading } = useBrands();

  return (
    <div className="space-y-8 py-6">
      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Official Brand Partners</h1>
        <p className="text-xs text-gray-500 mt-1">Explore authentic collections directly from official brand partners.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-44 bg-gray-50 border border-gray-150 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map(brand => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandsListPage;
