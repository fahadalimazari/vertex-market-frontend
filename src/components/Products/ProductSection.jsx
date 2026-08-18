import { memo } from 'react'
import SectionHeader from './SectionHeader'
import ProductGrid from './ProductGrid'
import ProductCard from '../common/ProductCard'
import EmptyState from '../common/EmptyState'
import ProductSkeleton from '../common/ProductSkeleton'

const ProductSection = ({ 
  title, 
  description, 
  products = [], 
  viewAllLink, 
  isLoading = false,
  skeletonCount = 4
}) => {
  return (
    <section className="py-2">
      <SectionHeader 
        title={title} 
        description={description} 
        viewAllLink={viewAllLink} 
      />
      
      {isLoading ? (
        <ProductGrid>
          {[...Array(skeletonCount)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </ProductGrid>
      ) : products.length > 0 ? (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </ProductGrid>
      ) : (
        <EmptyState 
          title="No products available" 
          description="Check back later for new arrivals." 
          actionLink={null} 
        />
      )}
    </section>
  )
}

export default memo(ProductSection)
