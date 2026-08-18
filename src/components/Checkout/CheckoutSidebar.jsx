import CouponBox from './CouponBox';
import BillingSummary from './BillingSummary';

const CheckoutSidebar = () => {
  return (
    <div className="flex flex-col gap-6 sticky top-24">
      <CouponBox />
      <BillingSummary />
    </div>
  );
};

export default CheckoutSidebar;
