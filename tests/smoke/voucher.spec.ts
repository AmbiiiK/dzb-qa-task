import { test, expect } from '../fixtures';
import { getAllPaymentMethods } from '../lib/paymentMethods';
import { defaultVoucherValue } from '../lib/constants';
import { purchaseVoucher } from './helpers';

test.describe('Voucher purchase — happy path', () => {
  for (const method of getAllPaymentMethods()) {
    const asGift = method === 'pluxee-benefit-card';
    const title = `purchase with ${method}${asGift ? ' (gift mode)' : ''}`;

    test(title, async ({ voucherPage, testOrder, testGift, projectPaymentMethods }) => {
      test.skip(
        !projectPaymentMethods.includes(method),
        `${method} not available for this project`
      );

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

test.describe('Voucher — unhappy path', () => {
  test('missing required field shows validation error', async ({
    page,
    voucherPage,
    testOrder,
    projectValidationErrors,
  }) => {
    test.skip(
      projectValidationErrors.missingFieldErrors.length === 0,
      'Validation errors not configured for this project'
    );

    await test.step('fill form without email and submit', async () => {
      await voucherPage.goto();
      await voucherPage.selectVoucherValue(defaultVoucherValue);
      await voucherPage.fillOrderInfo({ ...testOrder, email: undefined });
      await voucherPage.acceptTerms();
      await voucherPage.submit();
    });

    await test.step('verify validation errors', async () => {
      await expect(page).toHaveURL(/\/voucher/);
      for (const error of projectValidationErrors.missingFieldErrors) {
        await expect(page.getByText(error).first()).toBeVisible();
      }
    });
  });

  test('unchecked T&C checkboxes block submission', async ({
    page,
    voucherPage,
    testOrder,
    projectValidationErrors,
  }) => {
    test.skip(
      projectValidationErrors.uncheckedTermsErrors.length === 0,
      'Validation errors not configured for this project'
    );

    await test.step('submit without accepting terms', async () => {
      await voucherPage.goto();
      await voucherPage.selectVoucherValue(defaultVoucherValue);
      await voucherPage.fillOrderInfo(testOrder);
      await voucherPage.submit();
    });

    await test.step('verify T&C validation error', async () => {
      await expect(page).toHaveURL(/\/voucher/);
      for (const error of projectValidationErrors.uncheckedTermsErrors) {
        await expect(page.getByText(error).first()).toBeVisible();
      }
    });
  });
});
