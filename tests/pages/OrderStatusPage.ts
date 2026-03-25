import { Page, expect } from '@playwright/test';
import { PaymentMethodType, paymentMethods } from '../lib/paymentMethods';
import { routes, ProjectName } from '../lib/routes';
import { strings } from '../lib/strings';

export class OrderStatusPage {
  constructor(
    private readonly page: Page,
    private readonly project: ProjectName
  ) {}

  async expectSuccess() {
    const s = strings[this.project];
    await expect(this.page).toHaveURL(new RegExp(routes[this.project].status));
    await expect(this.page.getByRole('heading', { name: s.orderSuccessHeading })).toBeVisible();
  }

  async expectOrderNumber() {
    await expect(this.page.getByText(/\d{4}-\d{2}-\d{2}-\d+/)).toBeVisible();
  }

  async expectPaymentDetails(method: PaymentMethodType, totalPrice: string) {
    const methodDef = paymentMethods[method];
    if (!methodDef) throw new Error(`Unknown payment method: ${method}`);

    await expect(
      this.page.getByRole('definition').filter({ hasText: methodDef.name })
    ).toBeVisible();

    const pricePattern = new RegExp(totalPrice.replace(/[\s\u00A0]/g, '[\\s\u00A0]'));
    await expect(
      this.page.getByRole('definition').filter({ hasText: pricePattern }).first()
    ).toBeVisible();

    const s = strings[this.project];
    await expect(
      this.page.getByRole('definition').filter({ hasText: s.paymentPending })
    ).toBeVisible();
  }

  async expectPaymentLink() {
    const s = strings[this.project];
    await expect(this.page.getByRole('link', { name: s.payButton })).toBeVisible();
  }
}
