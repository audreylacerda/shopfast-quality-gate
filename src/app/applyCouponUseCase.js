export async function applyCouponUseCase(
  { orderId, couponCode },
  { orderRepository, paymentGateway, pricingService }
) {
  const order = await orderRepository.getById(orderId);

  const pricingResult = pricingService.applyCoupon(order, couponCode);

  const paymentStatus = await paymentGateway.getAuthorizationStatus(order.paymentIntentId);

  if (paymentStatus !== 'AUTHORIZED') {
    return {
      ok: false,
      status: 'BLOCKED_NO_PAYMENT',
      message: 'Cupom aplicado, mas pagamento não autorizado. Pedido não será despachado.',
      order: pricingResult.order
    };
  }

  await orderRepository.save(pricingResult.order);

  return {
    ok: true,
    status: 'COUPON_APPLIED_AND_PAYMENT_OK',
    order: pricingResult.order
  };
}
