import type { VoucherValue } from '../pages/VoucherPage';

export const defaultVoucherValue: VoucherValue = '1000';

export const validationErrors = {
  requiredFieldWl: 'Povinné pole',
  requiredFieldCz: 'zadejte prosím',
  requiredCheckboxCz: 'povinné pole',
  formGeneralError: 'V objednávkovém formuláři se vyskytují chyby.',
} as const;
