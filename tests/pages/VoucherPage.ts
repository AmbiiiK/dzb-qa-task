import { Page, expect } from '@playwright/test';
import { PaymentMethodType, paymentMethods } from '../lib/paymentMethods';
import { routes, ProjectName } from '../lib/routes';

export type VoucherValue = '1000' | '3000' | '5000';

const voucherLabels: Record<VoucherValue, string> = {
  '1000': '1 000 Kč',
  '3000': '3 000 Kč',
  '5000': '5 000 Kč',
};

export const voucherPrices: Record<VoucherValue, { voucher: string }> = {
  '1000': { voucher: '1\u00A0000\u00A0Kč' },
  '3000': { voucher: '3\u00A0000\u00A0Kč' },
  '5000': { voucher: '5\u00A0000\u00A0Kč' },
};

export interface OrderInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
}

export interface GiftInfo {
  recipientName: string;
  message: string;
}

export class VoucherPage {
  constructor(
    readonly page: Page,
    readonly project: ProjectName
  ) {}

  async goto() {
    await this.page.goto(routes[this.project].voucher);
    await expect(this.page.getByRole('heading', { name: 'Objednávka poukazu' })).toBeVisible();

    const czDropdownButton = this.page
      .locator('.payment-form__content')
      .getByRole('button')
      .first();
    const wlDropdownSelect = this.page.getByRole('combobox', { name: /Způsob platby/ });

    await expect(async () => {
      const isCzReady = await czDropdownButton.isVisible().catch(() => false);
      const isWlReady = await wlDropdownSelect.isVisible().catch(() => false);
      expect(isCzReady || isWlReady).toBe(true);
    }).toPass({ timeout: 15_000 });
  }

  async selectVoucherValue(value: VoucherValue) {
    const radio = this.page.getByRole('radio', { name: voucherLabels[value] });
    const inputId = await radio.getAttribute('id');
    await expect(async () => {
      if (!inputId) throw new Error(`Radio for "${value}" has no id attribute`);
      await this.page.locator(`label[for="${inputId}"]`).click();
      await expect(this.page.getByText('Servisní poplatek')).toBeVisible({ timeout: 2_000 });
      await expect(radio).toBeChecked();
    }).toPass({ timeout: 15_000 });
  }

  async enableGiftMode() {
    await this.page.getByRole('checkbox', { name: /Kupuji jako dárek/ }).check();
    await expect(this.page.getByRole('textbox', { name: /Jméno obdarovaného/ })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: /Vzkaz/ })).toBeVisible();
  }

  async fillGiftInfo(gift: GiftInfo) {
    await this.page.getByRole('textbox', { name: /Jméno obdarovaného/ }).fill(gift.recipientName);
    await this.page.getByRole('textbox', { name: /Vzkaz/ }).fill(gift.message);
  }

  async fillOrderInfo(info: Partial<OrderInfo>) {
    if (info.firstName !== undefined)
      await this.page
        .getByRole('textbox', { name: /^Jméno/ })
        .last()
        .fill(info.firstName);
    if (info.lastName !== undefined)
      await this.page.getByRole('textbox', { name: /Příjmení/ }).fill(info.lastName);
    if (info.email !== undefined)
      await this.page.getByRole('textbox', { name: /Emailová adresa/ }).fill(info.email);
    if (info.phone !== undefined)
      await this.page.getByRole('textbox', { name: /Telefonní číslo/ }).fill(info.phone);
    if (info.street !== undefined)
      await this.page.getByRole('textbox', { name: /Ulice/ }).fill(info.street);
    if (info.houseNumber !== undefined)
      await this.page.getByRole('textbox', { name: /Číslo popisné/ }).fill(info.houseNumber);
    if (info.zip !== undefined)
      await this.page.getByRole('textbox', { name: /PSČ/ }).fill(info.zip);
    if (info.city !== undefined)
      await this.page.getByRole('textbox', { name: /Město/ }).fill(info.city);
  }

  async selectPaymentMethod(method: PaymentMethodType) {
    const methodDef = paymentMethods[method];
    if (!methodDef) throw new Error(`Unknown payment method: ${method}`);

    if (this.project === 'whitelabel') {
      const select = this.page.getByRole('combobox', { name: /Způsob platby/ });
      await select.selectOption({ label: methodDef.name });
      await expect(select.locator('option:checked')).toHaveText(methodDef.name);
    } else {
      const paymentContent = this.page.locator('.payment-form__content');
      await paymentContent.getByRole('button').first().click();
      await paymentContent
        .getByRole('listitem')
        .filter({ hasText: methodDef.uiPattern })
        .getByRole('button')
        .click();
      await expect(paymentContent.getByRole('button').first()).toContainText(methodDef.uiPattern);
    }
  }

  async acceptTerms() {
    await this.page.getByRole('checkbox', { name: /storno podmínkami/ }).check();
    await this.page.getByRole('checkbox', { name: /obchodními podmínkami/ }).check();
  }

  async expectRecap(value: VoucherValue): Promise<void> {
    await expect(this.page.getByText('Servisní poplatek')).toBeVisible();
    const voucherText = voucherPrices[value].voucher;
    const voucherPattern = new RegExp(voucherText.replace(/[\s\u00A0]/g, '[\\s\\u00A0]'));
    await expect(this.page.getByText(voucherPattern).first()).toBeVisible();
  }

  async submit() {
    await this.page.getByRole('button', { name: /^Objednat/ }).click();
  }
}
