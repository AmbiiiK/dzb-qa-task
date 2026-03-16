export const routes = {
  cz: {
    homepage: '/',
    order: '/objednavka',
    accommodation: '/ubytovani',
    reservation: '/rezervace',
    voucher: '/voucher',
    status: '/status',
  },
  pl: {
    homepage: '/',
    order: '/zamowienie',
    accommodation: '/nocleg',
    reservation: '/rezerwacja',
    voucher: '/voucher',
    status: '/status',
  },
  whitelabel: {
    homepage: '/',
    order: '/objednavka',
    accommodation: '/ubytovani',
    reservation: '/rezervace',
    voucher: '/voucher',
    status: '/status',
  },
} as const;

export type ProjectName = keyof typeof routes;
