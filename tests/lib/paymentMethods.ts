export type ProjectType = 'cz' | 'pl' | 'whitelabel';

export type PaymentMethodType =
  | 'pluxee-benefit-card'
  | 'bank-transfer'
  | 'edenred-benefit-card'
  | 'edenred-cafeteria'
  | 'up-benefit-card'
  | 'payment-card';

export const paymentMethods: Partial<
  Record<
    PaymentMethodType,
    {
      name: string;
      availableIn: ProjectType[];
      uiPattern: RegExp;
      total1000: string;
      hasPaymentLink: boolean;
    }
  >
> = {
  'edenred-benefit-card': {
    name: 'Benefitní karta Edenred',
    availableIn: ['cz'],
    uiPattern: /Benefitní karta Edenred/,
    total1000: '1\u00A0062,70\u00A0Kč',
    hasPaymentLink: true,
  },
  'edenred-cafeteria': {
    name: 'Edenred Benefity Premium (Cafeterie)',
    availableIn: ['cz'],
    uiPattern: /Edenred Benefity Premium/,
    total1000: '1\u00A0062,70\u00A0Kč',
    hasPaymentLink: true,
  },
  'up-benefit-card': {
    name: 'Benefitní karta UP',
    availableIn: ['cz'],
    uiPattern: /Benefitní karta UP/,
    total1000: '1\u00A0074,11\u00A0Kč',
    hasPaymentLink: true,
  },
  'pluxee-benefit-card': {
    name: 'Benefitní karta Pluxee',
    availableIn: ['cz', 'whitelabel'],
    uiPattern: /Benefitní karta Pluxee/,
    total1000: '1\u00A0111,11\u00A0Kč',
    hasPaymentLink: true,
  },
  'payment-card': {
    name: 'Platební karta',
    availableIn: ['cz', 'whitelabel'],
    uiPattern: /Platební karta/,
    total1000: '1\u00A0020,41\u00A0Kč',
    hasPaymentLink: true,
  },
  'bank-transfer': {
    name: 'Převodem z účtu',
    availableIn: ['cz', 'whitelabel'],
    uiPattern: /Převodem z účtu/,
    total1000: '1\u00A0000\u00A0Kč',
    hasPaymentLink: false,
  },
};

const getPaymentMethodsForProject = (project: ProjectType): PaymentMethodType[] =>
  (Object.keys(paymentMethods) as PaymentMethodType[]).filter((method) =>
    paymentMethods[method]?.availableIn.includes(project)
  );

export const getAllPaymentMethods = (): PaymentMethodType[] =>
  Object.keys(paymentMethods) as PaymentMethodType[];

export const projectPaymentMethods = {
  cz: getPaymentMethodsForProject('cz'),
  pl: getPaymentMethodsForProject('pl'),
  whitelabel: getPaymentMethodsForProject('whitelabel'),
} as const;
