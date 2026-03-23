import { test as base } from '@playwright/test';
import { OrderInfo, GiftInfo, VoucherPage } from '../pages/VoucherPage';
import { routes } from '../lib/routes';
import type { ProjectName } from '../lib/routes';
import type { PaymentMethodType } from '../lib/paymentMethods';

const PROJECT_NAMES = Object.keys(routes) as ProjectName[];

function toProjectName(name: string): ProjectName {
  if (!PROJECT_NAMES.includes(name as ProjectName))
    throw new Error(
      `Unknown project name: "${name}". Expected one of: ${PROJECT_NAMES.join(', ')}`
    );
  return name as ProjectName;
}

export type ProjectValidationErrors = {
  missingFieldErrors: string[];
  uncheckedTermsErrors: string[];
};

type TestFixtures = {
  testOrder: OrderInfo;
  testGift: GiftInfo;
  voucherPage: VoucherPage;
};

export type ProjectOptions = {
  projectPaymentMethods: PaymentMethodType[];
  projectValidationErrors: ProjectValidationErrors;
};

export const test = base.extend<TestFixtures & ProjectOptions>({
  projectPaymentMethods: [[], { option: true }],
  projectValidationErrors: [{ missingFieldErrors: [], uncheckedTermsErrors: [] }, { option: true }],
  testOrder: async ({}, use) => {
    await use({
      firstName: 'Jan',
      lastName: 'Novák',
      email: 'jan.novak@test-qa.cz',
      phone: '+420123456789',
      street: 'Testovací',
      houseNumber: '42',
      zip: '11000',
      city: 'Praha',
    });
  },
  testGift: async ({}, use) => {
    await use({
      recipientName: 'Marie Nováková',
      message: 'Přeji krásnou dovolenou!',
    });
  },
  voucherPage: async ({ page }, use, testInfo) => {
    await use(new VoucherPage(page, toProjectName(testInfo.project.name)));
  },
});

export { expect } from '@playwright/test';
