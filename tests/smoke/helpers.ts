import { VoucherPage, OrderInfo, GiftInfo, VoucherValue } from '../pages/VoucherPage';
import { OrderStatusPage } from '../pages/OrderStatusPage';
import { PaymentMethodType, paymentMethods } from '../lib/paymentMethods';

/** Options for a single voucher purchase flow. */
export interface PurchaseOptions {
  method: PaymentMethodType;
  voucherValue: VoucherValue;
  order: OrderInfo;
  asGift?: boolean;
  /** Required when asGift is true. */
  gift?: GiftInfo;
}

/**
 * Executes the full voucher purchase flow up to and including order submission.
 * Stops before the payment gateway — never clicks the payment button.
 */
export async function purchaseVoucher(voucherPage: VoucherPage, options: PurchaseOptions) {
  const { method, voucherValue, order, asGift, gift } = options;
  const statusPage = new OrderStatusPage(voucherPage.page);

  await voucherPage.goto();
  await voucherPage.selectVoucherValue(voucherValue);
  await voucherPage.expectRecap(voucherValue);

  if (asGift && gift) {
    await voucherPage.enableGiftMode();
    await voucherPage.fillGiftInfo(gift);
  }

  await voucherPage.selectPaymentMethod(method);
  await voucherPage.fillOrderInfo(order);
  await voucherPage.acceptTerms();
  await voucherPage.submit();

  await statusPage.expectSuccess();
  await statusPage.expectOrderNumber();
  await statusPage.expectPaymentDetails(method, paymentMethods[method]!.total1000);
  if (paymentMethods[method]!.hasPaymentLink) {
    await statusPage.expectPaymentLink();
  }
}
