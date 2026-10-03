// Каталог токенов для страниц Style Guide: имя и назначение. Значения не дублируются —
// образцы читают их из tokens.css в живой теме, а тест сверяет каталог с tokens.css.

export type Token = { name: string; use: string };
export type Group = { id: string; title: string; note: string; tokens: Token[] };

const steps = (family: string, list: number[]): Token[] =>
  list.map((n) => ({ name: `--color-${family}-${String(n)}`, use: `${family} ${String(n)}` }));

export const PALETTE: Group[] = [
  {
    id: 'gray',
    title: 'Grays',
    note: 'Surfaces, text and borders in both themes. Lower numbers are lighter.',
    tokens: steps('gray', [0, 25, 50, 75, 150, 200, 400, 500, 575, 600, 700, 750, 800, 850, 900, 925, 950]),
  },
  { id: 'blue', title: 'Blues', note: 'Accent and links.', tokens: steps('blue', [300, 400, 500, 600]) },
  { id: 'green', title: 'Greens', note: 'Data, success and gain.', tokens: steps('green', [300, 400, 500, 600, 700]) },
  { id: 'red', title: 'Reds', note: 'Loss only.', tokens: steps('red', [400, 600]) },
  { id: 'orange', title: 'Oranges', note: 'Attention and errors.', tokens: steps('orange', [400, 600]) },
  { id: 'amber', title: 'Ambers', note: 'Caution and chart highlights.', tokens: steps('amber', [300, 400, 600, 700]) },
];

export const COLOR: Group[] = [
  {
    id: 'surface',
    title: 'Surface',
    note: 'Three depth levels: page, card and nested block. A card is always lighter than the page.',
    tokens: [
      { name: '--ground', use: 'Page background' },
      { name: '--panel', use: 'Card, panel, dialog' },
      { name: '--panel-raised', use: 'Dense table, block on top of a card' },
      { name: '--panel-sunk', use: 'Inset block: input field, code background' },
      { name: '--sheen', use: 'Hover highlight on any surface' },
    ],
  },
  {
    id: 'ink',
    title: 'Text',
    note: 'Three contrast steps. The third is for labels only, never for numbers people read.',
    tokens: [
      { name: '--ink', use: 'Primary text and numbers' },
      { name: '--ink-2', use: 'Secondary text, subtitles' },
      { name: '--ink-3', use: 'Column headers, captions, disabled' },
    ],
  },
  {
    id: 'rule',
    title: 'Border',
    note: 'A border separates, it does not decorate. Strong borders belong to dense tables and active fields.',
    tokens: [
      { name: '--rule', use: 'Card and field border' },
      { name: '--rule-soft', use: 'Table row divider' },
      { name: '--rule-strong', use: 'Dense table border, focus without accent' },
    ],
  },
  {
    id: 'accent',
    title: 'Accent',
    note: 'One action per screen. With more than two accented elements there is no accent.',
    tokens: [
      { name: '--accent', use: 'Primary button, link, focus ring' },
      { name: '--accent-2', use: 'Accent on dark surfaces and in dense UIs' },
      { name: '--accent-ink', use: 'Text on an accent fill' },
      { name: '--wash', use: 'Selected item background' },
    ],
  },
  {
    id: 'state',
    title: 'Data & attention',
    note: 'A neutral pair for any product: a good value, and something that needs a look.',
    tokens: [
      { name: '--data', use: 'Positive value, success' },
      { name: '--data-2', use: 'Secondary data series' },
      { name: '--data-wash', use: 'Success background' },
      { name: '--attn', use: 'Error, attention' },
      { name: '--attn-wash', use: 'Attention background' },
    ],
  },
  {
    id: 'money',
    title: 'Money',
    note: 'For money and positions only. Loss and caution are different colors and must never be mixed.',
    tokens: [
      { name: '--gain', use: 'Profit, growth, long' },
      { name: '--gain-wash', use: 'Profitable row background' },
      { name: '--gain-line', use: 'Profit border and line' },
      { name: '--loss', use: 'Loss, decline, short' },
      { name: '--loss-wash', use: 'Losing row background' },
      { name: '--loss-line', use: 'Loss border and line' },
      { name: '--caution', use: 'Warning: risk, stop is close' },
      { name: '--caution-wash', use: 'Warning background' },
    ],
  },
  {
    id: 'plot',
    title: 'Charts',
    note: 'Series colors on canvas. Read from CSS at draw time, so they follow the theme.',
    tokens: [
      { name: '--plot-grid', use: 'Chart grid' },
      { name: '--plot-price', use: 'Price line' },
      { name: '--plot-volume', use: 'Volume, second series' },
      { name: '--plot-ema', use: 'Moving average' },
    ],
  },
];

export const FONT: Token[] = [
  { name: '--display', use: 'Headings and hero numbers — Geologica' },
  { name: '--sans', use: 'Interface text — IBM Plex Sans' },
  { name: '--mono', use: 'Numbers in columns and code — JetBrains Mono' },
];

export const TEXT: Token[] = [
  { name: '--text-micro', use: 'Service label in tight spots: LIVE, ×N' },
  { name: '--text-label', use: 'Column header, eyebrow' },
  { name: '--text-small', use: 'Chip, badge, caption under a number' },
  { name: '--text-body', use: 'Table cell, secondary text' },
  { name: '--text-base', use: 'Body text' },
  { name: '--text-lead', use: 'Lead paragraph, large cell' },
  { name: '--text-h3', use: 'Block heading inside a card' },
  { name: '--text-h2', use: 'Card heading' },
  { name: '--text-h1', use: 'Page heading' },
  { name: '--text-hero', use: 'The one number the page exists for' },
];

export const TRACKING: Token[] = [
  { name: '--tracking-tight', use: 'Large display headings' },
  { name: '--tracking-snug', use: 'Hero numbers and h1' },
  { name: '--tracking-wide', use: 'Uppercase labels and column headers' },
  { name: '--tracking-wider', use: 'Tiny uppercase service labels' },
];

export const SPACE: Token[] = [
  { name: '--space-1', use: 'Icon and its label' },
  { name: '--space-2', use: 'Items in a row' },
  { name: '--space-3', use: 'Padding in a compact cell' },
  { name: '--space-4', use: 'Card padding on mobile' },
  { name: '--space-5', use: 'Card padding' },
  { name: '--space-6', use: 'Between blocks inside a card' },
  { name: '--space-8', use: 'Between cards' },
  { name: '--space-10', use: 'Between page sections' },
  { name: '--gap', use: 'Fluid section gap: 32 to 52 px' },
];

export const RADIUS: Token[] = [
  { name: '--radius-sm', use: 'Button, field, chip' },
  { name: '--radius', use: 'Card, dialog' },
  { name: '--radius-pill', use: 'Pill badge, toggle, avatar' },
];

export const SHADOW: Token[] = [
  { name: '--shadow', use: 'Card at rest' },
  { name: '--shadow-lift', use: 'Card on hover, dropdown' },
  { name: '--shadow-float', use: 'Dialog, toast — anything above the page' },
];

export const BORDER: Token[] = [
  { name: '--border-thin', use: 'Every default border' },
  { name: '--border-thick', use: 'Focus ring, selected state, emphasis' },
];

export const OPACITY: Token[] = [
  { name: '--opacity-muted', use: 'Secondary icon, de-emphasised content' },
  { name: '--opacity-disabled', use: 'Disabled control' },
];

export const BREAKPOINT: Token[] = [
  { name: '--breakpoint-sm', use: 'Small phone and below' },
  { name: '--breakpoint-md', use: 'Tables switch to card layout' },
  { name: '--breakpoint-lg', use: 'Desktop to tablet' },
];

export const LAYER: Token[] = [
  { name: '--layer-sticky', use: 'Sticky table header, navigation' },
  { name: '--layer-popover', use: 'Tooltip, dropdown' },
  { name: '--layer-dialog', use: 'Modal dialog and its backdrop' },
  { name: '--layer-toast', use: 'Toast — on top of everything' },
];

export const MOTION: Token[] = [
  { name: '--spring', use: 'Enter curve: a slight overshoot and settle' },
];

/** Все имена каталога — для сверки с tokens.css. */
export const ALL: string[] = [
  ...PALETTE.flatMap((g) => g.tokens),
  ...COLOR.flatMap((g) => g.tokens),
  ...FONT, ...TEXT, ...TRACKING, ...SPACE, ...RADIUS, ...SHADOW,
  ...BORDER, ...OPACITY, ...BREAKPOINT, ...LAYER, ...MOTION,
].map((t) => t.name);
