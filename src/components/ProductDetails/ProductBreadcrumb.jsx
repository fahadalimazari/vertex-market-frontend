import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const ProductBreadcrumb = ({ product }) => {
  return (
    <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider py-2">
      <Link to="/" className="hover:text-[#ff6a00] flex items-center gap-1">
        <FiHome className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      <FiChevronRight className="h-3 w-3" />
      <Link to={`/products?category=${product.category}`} className="hover:text-[#ff6a00]">
        {product.category}
      </Link>
      <FiChevronRight className="h-3 w-3" />
      <Link to={`/brands/${product.brand.toLowerCase()}`} className="hover:text-[#ff6a00]">
        {product.brand}
      </Link>
      <FiChevronRight className="h-3 w-3" />
      <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
    </nav>
  );
};

export default ProductBreadcrumb;
