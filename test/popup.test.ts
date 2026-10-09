import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  document.body.innerHTML = '<div id="app"></div>';
});

describe('popup', () => {
  beforeAll(async () => {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = '';
    await import('../entrypoints/popup/main');
  });

  it('renders the Obscura heading', () => {
    const h1 = document.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1!.textContent).toBe('Obscura');
  });

  it('renders the status paragraph', () => {
    const p = document.querySelector('p');
    expect(p).not.toBeNull();
    expect(p!.textContent).toContain('working');
  });

  it('renders content inside the #app div', () => {
    const app = document.getElementById('app');
    expect(app).not.toBeNull();
    expect(app!.innerHTML).toContain('Obscura');
    expect(app!.innerHTML).toContain('working');
  });

  it('has exactly one h1 and one p', () => {
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelectorAll('p')).toHaveLength(1);
  });
});
