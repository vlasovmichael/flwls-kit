import { html } from 'lit';
import './h-kbd.ts';

export default {
  title: 'Components/Display/Kbd',
  component: 'h-kbd',
  parameters: {
    docs: {
      description: {
        component: `A keyboard key inside a hint or a shortcut list. Sized in \`em\`, so it follows
the surrounding text.

**Use** to name keys and shortcuts: <kbd>Ctrl</kbd> + <kbd>K</kbd>.
**Don't use** for code or values — use a code span.`,
      },
    },
  },
};

export const Playground = {
  render: () => html`<p>Press <h-kbd>Ctrl</h-kbd> + <h-kbd>K</h-kbd> to search.</p>`,
};

export const Keys = {
  render: () => html`
    <div class="demo-row">
      <h-kbd>Esc</h-kbd><h-kbd>⌘</h-kbd><h-kbd>Enter</h-kbd><h-kbd>↑</h-kbd><h-kbd>Page Down</h-kbd>
    </div>
  `,
};
