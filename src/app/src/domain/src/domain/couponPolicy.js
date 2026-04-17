export function createCouponPolicy() {
  return {
    validateAndApply(order, couponCode) {
      if (couponCode !== 'BLACK50') return { order };

      if (order.total <= 0) {
        return {
          order: { ...order, couponStatus: 'INVALID_TOTAL' }
        };
      }

      const discountedTotal = Math.max(0, order.total * 0.5);
      return {
        order: {
          ...order,
          couponCode,
          couponStatus: 'APPLIED',
          totalWithDiscount: discountedTotal
        }
      };
    }
  };
}
