import { describe, it, expect } from 'vitest';
import {
  shouldRedirectReelsUrl,
  transformReelsToTv,
} from '../entrypoints/lib/reel-redirect';

describe('shouldRedirectReelsUrl', () => {
  it('returns false for the bare reels hub URL', () => {
    expect(shouldRedirectReelsUrl('https://www.instagram.com/reels/')).toBe(false);
  });

  it('returns false for the reels hub with default query param', () => {
    expect(shouldRedirectReelsUrl('https://www.instagram.com/reels/?next=%2f')).toBe(false);
  });

  it('returns true for a URL with a specific reel ID', () => {
    expect(shouldRedirectReelsUrl('https://www.instagram.com/reels/Cr8XaK-xp9H/')).toBe(true);
  });

  it('returns true for a deep reel URL with query params', () => {
    expect(
      shouldRedirectReelsUrl('https://www.instagram.com/reels/Cr8XaK-xp9H/?next=%2f'),
    ).toBe(true);
  });

  it('returns true for reel URLs with additional path segments', () => {
    expect(
      shouldRedirectReelsUrl('https://www.instagram.com/reels/Cr8XaK-xp9H/extra/'),
    ).toBe(true);
  });

  it('returns false for non-reels Instagram URLs', () => {
    expect(shouldRedirectReelsUrl('https://www.instagram.com/p/Cr8XaK-xp9H/')).toBe(false);
    expect(shouldRedirectReelsUrl('https://www.instagram.com/')).toBe(false);
    expect(shouldRedirectReelsUrl('https://www.instagram.com/explore/')).toBe(false);
  });

  it('returns false for completely unrelated URLs', () => {
    expect(shouldRedirectReelsUrl('https://example.com/reels/foo')).toBe(false);
    expect(shouldRedirectReelsUrl('')).toBe(false);
  });

});

describe('transformReelsToTv', () => {
  it('replaces /reels/ with /tv/ in a simple URL', () => {
    expect(
      transformReelsToTv('https://www.instagram.com/reels/Cr8XaK-xp9H/'),
    ).toBe('https://www.instagram.com/tv/Cr8XaK-xp9H/');
  });

  it('preserves query parameters during transformation', () => {
    expect(
      transformReelsToTv('https://www.instagram.com/reels/Cr8XaK-xp9H/?next=%2f'),
    ).toBe('https://www.instagram.com/tv/Cr8XaK-xp9H/?next=%2f');
  });

  it('preserves trailing slashes', () => {
    expect(
      transformReelsToTv('https://www.instagram.com/reels/Cr8XaK-xp9H/'),
    ).toBe('https://www.instagram.com/tv/Cr8XaK-xp9H/');
  });

  it('only replaces the first occurrence of /reels/', () => {
    expect(
      transformReelsToTv('https://www.instagram.com/reels/abc/reels/'),
    ).toBe('https://www.instagram.com/tv/abc/reels/');
  });

  it('returns the same string when /reels/ is not present', () => {
    const url = 'https://www.instagram.com/p/Cr8XaK-xp9H/';
    expect(transformReelsToTv(url)).toBe(url);
  });
});
