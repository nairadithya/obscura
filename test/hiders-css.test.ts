import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const cssContent = fs.readFileSync(
  path.resolve(import.meta.dirname, '../entrypoints/hiders.css'),
  'utf-8',
);

function injectCSS(css: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('AI Studio link', () => {
  it('hides the AI Studio nav link', () => {
    document.body.innerHTML = `
      <a href="https://aistudio.instagram.com/?utm_source=ig_web_nav">AI Studio</a>
    `;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).toBe('none');
  });

  it('does not hide a regular Instagram link', () => {
    document.body.innerHTML = `<a href="https://www.instagram.com/">Instagram</a>`;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).not.toBe('none');
  });
});

describe('Threads link', () => {
  it('hides the Threads nav link', () => {
    document.body.innerHTML = `
      <a href="https://www.threads.com/?param=value">Threads</a>
    `;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).toBe('none');
  });

  it('does not hide a plain threads.com link without query', () => {
    document.body.innerHTML = `<a href="https://threads.com/">Threads</a>`;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).not.toBe('none');
  });
});

describe('Reels links', () => {
  it('hides links ending with /reels/', () => {
    document.body.innerHTML = `<a href="/reels/">Reels</a>`;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).toBe('none');
  });

  it('hides links starting with /reels/', () => {
    document.body.innerHTML = `<a href="/reels/abc">Reels</a>`;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).toBe('none');
  });

  it('does not hide a link containing /reel/ (singular)', () => {
    document.body.innerHTML = `<a href="/reel/abc">Reel</a>`;
    injectCSS(cssContent);
    const els = document.querySelectorAll('a');
    const hidden = Array.from(els).filter(
      (el) => getComputedStyle(el).display === 'none',
    );
    expect(hidden).toHaveLength(0);
  });
});

describe('Explore link', () => {
  it('hides the Explore nav link', () => {
    document.body.innerHTML = `<a href="/explore/">Explore</a>`;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).toBe('none');
  });

  it('does not hide an explore sub-page link', () => {
    document.body.innerHTML = `<a href="/explore/people/">Explore People</a>`;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).not.toBe('none');
  });
});

describe('Meta AI link', () => {
  it('hides Meta AI links', () => {
    document.body.innerHTML = `<a href="https://www.meta.ai/chat">Meta AI</a>`;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).toBe('none');
  });

  it('does not hide other meta.com links', () => {
    document.body.innerHTML = `<a href="https://about.meta.com/">Meta</a>`;
    injectCSS(cssContent);
    const el = document.querySelector('a')!;
    expect(getComputedStyle(el).display).not.toBe('none');
  });
});

describe('Reel video thumbnail selector', () => {
  function createReelThumbnail(): HTMLDivElement {
    const outer = document.createElement('div');
    outer.style.backgroundImage = 'url(https://example.com/img.jpg)';

    const link = document.createElement('a');
    link.setAttribute('href', '/reel/Cr8XaK-xp9H/');

    let inner: HTMLElement = document.createElement('div');
    const d1 = document.createElement('div');
    const d2 = document.createElement('div');
    const d3 = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = 'Watch again on Instagram';

    d3.appendChild(span);
    d2.appendChild(d3);
    d1.appendChild(d2);
    inner.appendChild(d1);

    link.appendChild(inner);
    outer.appendChild(link);
    return outer;
  }

  it('hides a reel thumbnail div that matches the selector', () => {
    const el = createReelThumbnail();
    document.body.appendChild(el);
    injectCSS(cssContent);

    expect(getComputedStyle(el).display).toBe('none');
  });

  // happy-dom's :has() doesn't distinguish child combinators (>) from
  // descendant combinators, so we can't reliably test the negative case
  // where the nested span structure is missing.  In a real browser the
  // complex :has() selector would NOT match this element, but happy-dom
  // treats it as a broad descendant check.  The positive test above
  // still validates that the intended structure IS hidden.
  it.skip('does not hide a thumbnail without the nested span structure', () => {
    const outer = document.createElement('div');
    outer.style.backgroundImage = 'url(https://example.com/img.jpg)';
    const link = document.createElement('a');
    link.setAttribute('href', '/reel/Cr8XaK-xp9H/');
    link.textContent = 'A reel';
    outer.appendChild(link);
    document.body.appendChild(outer);
    injectCSS(cssContent);

    expect(getComputedStyle(outer).display).not.toBe('none');
  });

  it('does not hide a div without background-image style', () => {
    const outer = document.createElement('div');
    const link = document.createElement('a');
    link.setAttribute('href', '/reel/Cr8XaK-xp9H/');
    const d1 = document.createElement('div');
    const d2 = document.createElement('div');
    const d3 = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = 'Watch again on Instagram';
    d3.appendChild(span);
    d2.appendChild(d3);
    d1.appendChild(d2);
    link.appendChild(d1);
    outer.appendChild(link);
    document.body.appendChild(outer);
    injectCSS(cssContent);

    expect(getComputedStyle(outer).display).not.toBe('none');
  });
});
