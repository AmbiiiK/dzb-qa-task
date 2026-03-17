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

## Využití AI

Do práce jsem se pustil bez předchozího promyšlení celkového workflow, což vedlo k tomu, že jsem zbytečně moc času strávil opakovaným přepisováním dvou agentů — příště se vyplatí nejdřív se zastavit a ucelený plán si rozmyslet.

Vytvořil jsem dva AI agenty — `qa-playwright.md` pro průzkum webu a psaní testů dle definovaných pravidel (best practices, anti-patterny) a `qa-reviewer` pro následnou revizi repo a navrhování změn ke schválení.

Paralelně jsem využíval Claude i ChatGPT — Claude jsem používal od začátku prostřednictvím Claude Code s playwright skills a dalšími „superpowers" jako je brainstorming a psaní kódu, zatímco ChatGPT sloužil spíš jako doplňkový diskuzní partner.

Chyběly mi jednoznačné lokátory typu `data-testid`, na které jsem byl zvyklý z předchozích projektů jako best practice — byť díky AI nástrojům už dnes jejich absence pravděpodobně nepředstavuje tak velký problém při údržbě testů.

Z časových důvodů nebyla vytvořena polská (PL) verze testů.

## Reflexe

S více časem bych se zaměřil na tyto věci:

- **DOM elementy** — nepodařilo se mi najít lepší selektor než `.payment-form__content`, což je pragmatické řešení. S více časem bych sám vytvořil, nebo požádal někoho z FE týmu, aby přidal `data-testid` či jiný vhodnější selektor.
- **`OrderStatusPage`** — je v ní napevno zakódovaná routa. Funguje to díky shodné cestě, ale jde to proti architektuře projektu — správně by měla přijímat `ProjectName` stejně jako `VoucherPage`.
- **Ceny podle hodnoty voucheru** — `paymentMethods` obsahuje pouze ceny pro 1 000 Kč. Rozšíření o další mapování by umožnilo testy i pro 3 000 a 5 000 Kč.
- **PL varianta** — konfigurace je připravena, avšak nestihl jsem napsat testy. S více časem bych průzkumem DOMu ověřil rozdíly a testy doplnil.
