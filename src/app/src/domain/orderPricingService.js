export function createPricingService({ couponPolicy }) {
  return {
    applyCoupon(order, couponCode) {
      const result = couponPolicy.validateAndApply(order, couponCode);
      return { order: result.order };
    }
  };
}
