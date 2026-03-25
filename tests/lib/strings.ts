import type { ProjectName } from './routes';

export type ProjectStrings = {
  voucherHeading: string;
  serviceFee: string;
  giftModeCheckbox: RegExp;
  recipientNameField: RegExp;
  messageField: RegExp;
  firstNameField: RegExp;
  lastNameField: RegExp;
  emailField: RegExp;
  phoneField: RegExp;
  streetField: RegExp;
  houseNumberField: RegExp;
  zipField: RegExp;
  cityField: RegExp;
  paymentMethodSelect: RegExp;
  submitButton: RegExp;
  orderSuccessHeading: string;
  paymentPending: string;
  payButton: string;
};

const czStrings: ProjectStrings = {
  voucherHeading: 'Objednávka poukazu',
  serviceFee: 'Servisní poplatek',
  giftModeCheckbox: /Kupuji jako dárek/,
  recipientNameField: /Jméno obdarovaného/,
  messageField: /Vzkaz/,
  firstNameField: /^Jméno/,
  lastNameField: /Příjmení/,
  emailField: /Emailová adresa/,
  phoneField: /Telefonní číslo/,
  streetField: /Ulice/,
  houseNumberField: /Číslo popisné/,
  zipField: /PSČ/,
  cityField: /Město/,
  paymentMethodSelect: /Způsob platby/,
  submitButton: /^Objednat/,
  orderSuccessHeading: 'Objednávka úspěšně odeslána, děkujeme!',
  paymentPending: 'Čeká na platbu',
  payButton: 'Zaplatit',
};

export const strings: Record<ProjectName, ProjectStrings> = {
  cz: czStrings,
  whitelabel: czStrings, // whitelabel uses CZ UI text
  pl: czStrings, // PL not yet implemented — replace with Polish strings when PL UI is ready
};
