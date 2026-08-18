/**
 * Returns a list of valid, sorted deals from the provided product list.
 * A valid deal requires an active discount and available stock.
 */
export const getValidDeals = (products) => {
  if (!products || !Array.isArray(products)) return [];

  const deals = products.map(product => {
    // Basic validation
    if (!product || typeof product !== 'object') return null;
    
    // Check availability (fallback to assuming available if stock is missing, but reject if explicitly 0)
    if (product.stock !== undefined && product.stock <= 0) return null;
    if (product.isActive === false) return null; // some APIs use isActive

    // Extract pricing safely
    const currentPrice = Number(product.price);
    const oldPrice = Number(product.comparePrice || product.oldPrice);
    let discountPct = Number(product.discountValue || product.discount);

    if (isNaN(currentPrice) || currentPrice <= 0) return null;

    // Calculate discount if missing but old price exists
    if (!discountPct || isNaN(discountPct) || discountPct <= 0) {
      if (!isNaN(oldPrice) && oldPrice > currentPrice) {
        discountPct = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
      } else {
        // No valid discount
        return null;
      }
    }

    if (discountPct <= 0) return null;

    // Calculate deal priority score
    // Priority = (Discount Percentage) + (Rating * 5)
    // This favors high discounts, but allows a 5-star product (25 pts) 
    // to beat a low-rated product with a slightly higher discount.
    const rating = Number(product.rating) || 0;
    const score = discountPct + (rating * 5);

    return {
      product,
      score,
      discountPct
    };
  }).filter(Boolean); // Remove nulls

  // Deduplicate products based on ID to be safe
  const uniqueIds = new Set();
  const uniqueDeals = deals.filter(deal => {
    const id = deal.product._id || deal.product.id;
    if (uniqueIds.has(id)) return false;
    uniqueIds.add(id);
    return true;
  });

  // Sort by score descending
  return uniqueDeals
    .sort((a, b) => b.score - a.score)
    .map(deal => deal.product);
};
