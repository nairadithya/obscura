import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  findReelContainer,
  hideReelElements,
} from '../entrypoints/lib/hide-reel';

describe('findReelContainer', () => {
  let container: HTMLElement;
  let link: HTMLAnchorElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.classList.add('x1lliihq');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns the element itself when it has the container class', () => {
    expect(findReelContainer(container)).toBe(container);
  });

  it('returns the parent when it has the container class', () => {
    link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    container.appendChild(link);
    document.body.appendChild(container);

    expect(findReelContainer(link)).toBe(container);
  });

  it('returns the grandparent when it has the container class', () => {
    const wrapper = document.createElement('div');
    link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    wrapper.appendChild(link);
    container.appendChild(wrapper);
    document.body.appendChild(container);

    expect(findReelContainer(link)).toBe(container);
  });

  it('returns null when no ancestor has the container class', () => {
    const wrapper = document.createElement('div');
    link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    wrapper.appendChild(link);
    document.body.appendChild(wrapper);

    expect(findReelContainer(link)).toBeNull();
  });

  it('returns null for a detached element (no parent chain)', () => {
    link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    expect(findReelContainer(link)).toBeNull();
  });

  it('traverses past intermediate elements that do not have the class', () => {
    const mid = document.createElement('div');
    const inner = document.createElement('div');
    link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    inner.appendChild(link);
    mid.appendChild(inner);
    container.appendChild(mid);
    document.body.appendChild(container);

    expect(findReelContainer(link)).toBe(container);
  });

  it('stops at the first ancestor with the container class', () => {
    const nestedContainer = document.createElement('div');
    nestedContainer.classList.add('x1lliihq');
    link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    nestedContainer.appendChild(link);
    container.appendChild(nestedContainer);
    document.body.appendChild(container);

    expect(findReelContainer(link)).toBe(nestedContainer);
  });
});

describe('hideReelElements', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('hides the container of a reel link', () => {
    const container = document.createElement('div');
    container.classList.add('x1lliihq');
    const link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    container.appendChild(link);
    document.body.appendChild(container);

    hideReelElements(document.body);

    expect(container.style.display).toBe('none');
  });

  it('hides a parent card when the reel anchor itself is the root', () => {
    const container = document.createElement('div');
    container.classList.add('x1lliihq');
    const link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    container.appendChild(link);
    document.body.appendChild(container);

    hideReelElements(link);

    expect(container.style.display).toBe('none');
  });

  it('hides multiple reel containers in the same root', () => {
    const makeReel = () => {
      const c = document.createElement('div');
      c.classList.add('x1lliihq');
      const a = document.createElement('a');
      a.setAttribute('href', '/reels/xyz');
      c.appendChild(a);
      document.body.appendChild(c);
      return c;
    };

    const c1 = makeReel();
    const c2 = makeReel();

    hideReelElements(document.body);

    expect(c1.style.display).toBe('none');
    expect(c2.style.display).toBe('none');
  });

  it('does nothing when root has no reel links', () => {
    const div = document.createElement('div');
    div.textContent = 'hello';
    document.body.appendChild(div);

    expect(() => hideReelElements(document.body)).not.toThrow();
    expect(div.style.display).not.toBe('none');
  });

  it('does not hide elements that lack the container class', () => {
    const wrapper = document.createElement('div');
    const link = document.createElement('a');
    link.setAttribute('href', '/reels/abc');
    wrapper.appendChild(link);
    document.body.appendChild(wrapper);

    hideReelElements(document.body);

    expect(wrapper.style.display).not.toBe('none');
  });

  it('does not hide non-reel links even if inside a container', () => {
    const container = document.createElement('div');
    container.classList.add('x1lliihq');
    const link = document.createElement('a');
    link.setAttribute('href', '/profile/');
    container.appendChild(link);
    document.body.appendChild(container);

    hideReelElements(document.body);

    expect(container.style.display).not.toBe('none');
  });

  it('is safe to call on an empty document body', () => {
    expect(() => hideReelElements(document.body)).not.toThrow();
  });

  it('handles reel links nested several levels deep', () => {
    const container = document.createElement('div');
    container.classList.add('x1lliihq');
    const level1 = document.createElement('div');
    const level2 = document.createElement('div');
    const link = document.createElement('a');
    link.setAttribute('href', '/reels/deep');
    level2.appendChild(link);
    level1.appendChild(level2);
    container.appendChild(level1);
    document.body.appendChild(container);

    hideReelElements(document.body);

    expect(container.style.display).toBe('none');
  });
});
