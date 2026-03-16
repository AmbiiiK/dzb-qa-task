# Dovolená za Benefity — Playwright Tests

## Setup

### Požadavky

- Node.js 20+
- npm
- Testujeme pouze desktop, stačí jeden prohlížeč (výchozí je Chromium)

### Instalace

1. Naklonuj repo
2. `npm install`
3. `npm run playwright:install`

## Spuštění

```bash
# Všechny projekty
npm run test:all-projects

# Všechny projekty s viditelným prohlížečem
npm run test:all-projects:headed

# Jeden projekt
npm run test:cz
npm run test:pl
npm run test:whitelabel

# S viditelným prohlížečem
npm run test:headed

# Interaktivní UI mode
npm run test:ui

# HTML report
npm run test:report
```

## Code quality

```bash
# Lint
npm run lint
npm run lint:fix

# Formátování
npm run format
npm run format:check
```

## Struktura projektu

```text
dzb-qa-task/
├── tests/
│   ├── fixtures/
│   │   └── index.ts              # Playwright fixtures — testovací data (order, gift) a VoucherPage
│   ├── lib/
│   │   ├── constants.ts          # Sdílené konstanty (defaultVoucherValue, validationErrors)
│   │   ├── paymentMethods.ts     # Definice platebních metod a jejich dostupnost per varianta
│   │   └── routes.ts             # URL cesty per varianta (základ pro budoucí rozšíření)
│   ├── pages/
│   │   ├── VoucherPage.ts        # Page Object pro /voucher stránku
│   │   └── OrderStatusPage.ts    # Page Object pro /status stránku
│   └── smoke/
│       ├── helpers.ts            # Sdílený helper purchaseVoucher pro happy path flow
│       ├── voucher.cz.spec.ts    # Testy pro CZ variantu
│       └── voucher.whitelabel.spec.ts  # Testy pro Whitelabel variantu
├── playwright.config.ts          # Konfigurace 3 projektů (cz / pl / whitelabel) s baseURL
├── eslint.config.mts
├── package.json
├── tsconfig.json
└── TASK.md
```

## Architektura

Testy jsou postaveny na **Page Object Model (POM)** — každá stránka má vlastní třídu (`VoucherPage`, `OrderStatusPage`), která zapouzdřuje selektory a interakce. Testové soubory tak pracují pouze s metodami page objektů a neobsahují přímé selektory.

**Rozdíly mezi variantami** jsou řešeny uvnitř page objektů, ne v testech. `VoucherPage` dostane při inicializaci název projektu (`cz` / `whitelabel`) a podle něj volí správnou interakci — například CZ používá custom dropdown, Whitelabel nativní `<select>`. Testy samotné jsou tak variantně agnostické.

**Platební metody** jsou centralizovány v `paymentMethods.ts` jako single source of truth. Každá metoda definuje název, dostupnost per projekt, UI pattern a očekávanou cenu. Happy path testy se generují dynamicky iterací přes `projectPaymentMethods.cz` / `projectPaymentMethods.whitelabel` — přidání nové metody do definice automaticky vytvoří nový test.

**Fixtures** (`tests/fixtures/index.ts`) poskytují sdílená testovací data (kontaktní údaje objednávky, údaje dárku) a instanci `VoucherPage` s projektem z kontextu Playwright.
