import { html } from 'lit';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { HPagination } from './h-pagination.ts';
import './h-pagination.ts';

type Args = {
  page: number;
  pages: number;
  siblings: number;
  size: 'sm' | 'md';
  compact: boolean;
  onChange: () => void;
};

export default {
  title: 'Components/Navigation/Pagination',
  component: 'h-pagination',
  args: {
    page: 6,
    pages: 24,
    siblings: 1,
    size: 'md',
    compact: false,
    onChange: fn(),
  },
  argTypes: {
    page: { control: { type: 'number', min: 1 }, description: 'Current page, 1-based' },
    pages: {
      control: { type: 'number', min: 1 },
      description: 'Total pages. With one page nothing renders',
    },
    siblings: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Pages shown on each side of the current one',
    },
    size: { control: 'inline-radio', options: ['sm', 'md'], description: 'Button size' },
    compact: { control: 'boolean', description: 'Arrows with "Page N of M" — for narrow spaces' },
    onChange: { table: { category: 'Events' }, description: '`change` with `detail.page`' },
  },
  parameters: {
    docs: {
      description: {
        component: `Moves between pages of a table or a list. The first and the last page are always
visible; a gap (…) appears only when it hides more than one page, and the row keeps its width
while paging. The component keeps the page number only: load the data on \`change\`.

**Use** for long result sets where the position matters: trade history, logs.
**Don't use** for a feed that people scroll through — load more on scroll instead.
With a single page nothing is rendered. Several on one page need distinct \`label\`s.`,
      },
    },
  },
};

const render = (a: Args) => html`
  <h-pagination
    page=${a.page}
    pages=${a.pages}
    siblings=${a.siblings}
    size=${a.size}
    ?compact=${a.compact}
    @change=${a.onChange}
  ></h-pagination>
`;

export const KeyboardTest = {
  name: 'Test: Keyboard',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const pagination = canvasElement.querySelector('h-pagination') as HPagination;
    await pagination.updateComplete;
    const nav = within(pagination.shadowRoot as unknown as HTMLElement);

    nav.getByRole('button', { name: 'Next page' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(pagination.page).toBe(7);
    const seventh = nav.getByRole('button', { name: 'Page 7' });
    await expect(seventh).toHaveAttribute('aria-current', 'page');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const Playground = {
  render,
};

export const FewPages = {
  name: 'Few pages',
  args: { page: 2, pages: 5 },
  render,
};

export const Edges = {
  render: () => html`
    <div class="demo-stack">
      <h-pagination page="1" pages="24" label="First page"></h-pagination>
      <h-pagination page="12" pages="24" label="Middle page"></h-pagination>
      <h-pagination page="24" pages="24" label="Last page"></h-pagination>
    </div>
  `,
};

export const Small = {
  args: { size: 'sm' },
  render,
};

export const Compact = {
  args: { compact: true },
  render,
};

export const TableFooter = {
  name: 'Table footer',
  render: () => html`
    <div class="demo-list-row">
      <span>Showing 101–120 of 472</span>
      <h-pagination size="sm" compact page="6" pages="24" label="Trade history pages">
      </h-pagination>
    </div>
  `,
};
