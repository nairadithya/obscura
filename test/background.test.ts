import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

let onHistoryStateUpdated: (details: { url: string; tabId: number }) => void;

beforeAll(async () => {
  await import('../entrypoints/background');
  const addListener = vi.mocked(
    (globalThis as any).browser.webNavigation.onHistoryStateUpdated.addListener,
  );
  onHistoryStateUpdated = addListener.mock.calls[0][0];
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('background reel navigation', () => {
  it('redirects a specific reels URL to the TV page', () => {
    onHistoryStateUpdated({
      url: 'https://www.instagram.com/reels/Dd_D0E0z4dO/',
      tabId: 7,
    });

    expect((globalThis as any).browser.tabs.update).toHaveBeenCalledWith(7, {
      url: 'https://www.instagram.com/tv/Dd_D0E0z4dO/',
    });
  });

  it('does not redirect the reels hub', () => {
    onHistoryStateUpdated({
      url: 'https://www.instagram.com/reels/',
      tabId: 7,
    });

    expect((globalThis as any).browser.tabs.update).not.toHaveBeenCalled();
  });
});
