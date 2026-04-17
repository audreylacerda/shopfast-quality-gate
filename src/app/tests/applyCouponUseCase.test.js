import { applyCouponUseCase } from '../src/app/applyCouponUseCase.js';
import { createPricingService } from '../src/domain/orderPricingService.js';
import { createCouponPolicy } from '../src/domain/couponPolicy.js';

describe('ShopFast - Cupom + Pagamento', () => {
  const couponPolicy = createCouponPolicy();
  const pricingService = createPricingService({ couponPolicy });

  test('Bloqueia despacho quando pagamento não está autorizado (saldo inválido)', async () => {
    const orderRepository = {
      getById: jest.fn(async () => ({ id: 1, total: 2000, paymentIntentId: 'p1' })),
      save: jest.fn(async () => {})
    };
    const paymentGateway = {
      getAuthorizationStatus: jest.fn(async () => 'DECLINED')
    };

    const result = await applyCouponUseCase(
      { orderId: 1, couponCode: 'BLACK50' },
      { orderRepository, paymentGateway, pricingService }
    );

    expect(result.ok).toBe(false);
    expect(result.status).toBe('BLOCKED_NO_PAYMENT');
    expect(orderRepository.save).not.toHaveBeenCalled();
  });

  test('Permite seguir quando pagamento está autorizado', async () => {
    const orderRepository = {
      getById: jest.fn(async () => ({ id: 2, total: 1000, paymentIntentId: 'p2' })),
      save: jest.fn(async () => {})
    };
    const paymentGateway = {
      getAuthorizationStatus: jest.fn(async () => 'AUTHORIZED')
    };

    const result = await applyCouponUseCase(
      { orderId: 2, couponCode: 'BLACK50' },
      { orderRepository, paymentGateway, pricingService }
    );

    expect(result.ok).toBe(true);
    expect(orderRepository.save).toHaveBeenCalled();
  });
});
