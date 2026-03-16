import { test, expect } from '../fixtures';
import { projectPaymentMethods } from '../lib/paymentMethods';
import { defaultVoucherValue, validationErrors } from '../lib/constants';
import { purchaseVoucher } from './helpers';

test.describe('Whitelabel Voucher purchase — happy path', () => {
  for (const method of projectPaymentMethods.whitelabel) {
    const asGift = method === 'pluxee-benefit-card';
    const title = `purchase with ${method}${asGift ? ' (gift mode)' : ''}`;

    test(title, async ({ voucherPage, testOrder, testGift }) => {
      await purchaseVoucher(voucherPage, {
        method,
        voucherValue: defaultVoucherValue,
        order: testOrder,
        asGift,
        gift: testGift,
      });
    });
  }
});

test.describe('Whitelabel Voucher — unhappy path', () => {
  test('missing required field shows validation error', async ({ page, voucherPage, testOrder }) => {
    await voucherPage.goto();
    await voucherPage.selectVoucherValue(defaultVoucherValue);
    await voucherPage.fillOrderInfo({ ...testOrder, email: undefined });
    await voucherPage.acceptTerms();
    await voucherPage.submit();

    await expect(page).toHaveURL(/\/voucher/);
    await expect(page.getByText(validationErrors.requiredFieldWl).first()).toBeVisible();
  });

  test('unchecked T&C checkboxes block submission', async ({ page, voucherPage, testOrder }) => {
    await voucherPage.goto();
    await voucherPage.selectVoucherValue(defaultVoucherValue);
    await voucherPage.fillOrderInfo(testOrder);
    await voucherPage.submit();

    await expect(page).toHaveURL(/\/voucher/);
    await expect(page.getByText(validationErrors.requiredFieldWl).first()).toBeVisible();
  });
});
