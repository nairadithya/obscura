import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

let onInstalledCallback: (details: { reason: string }) => unknown;

beforeAll(async () => {
  vi.clearAllMocks();
  await import('../entrypoints/background');
  const calls = vi.mocked(
    (globalThis as any).browser.runtime.onInstalled.addListener,
  ).mock.calls;
  onInstalledCallback = calls[0][0];
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('background', () => {
  it('opens the welcome page on fresh install', async () => {
    await onInstalledCallback({ reason: 'install' });

    const tabsCreate = (globalThis as any).browser.tabs.create;
    expect(tabsCreate).toHaveBeenCalledOnce();
    expect(tabsCreate).toHaveBeenCalledWith({
      url: 'moz-extension://fake/get-started.html',
      active: true,
    });
  });

  it('does nothing on extension update', async () => {
    await onInstalledCallback({ reason: 'update' });

    expect((globalThis as any).browser.tabs.create).not.toHaveBeenCalled();
  });

  it('does nothing on browser update', async () => {
    await onInstalledCallback({ reason: 'browser_update' });

    expect((globalThis as any).browser.tabs.create).not.toHaveBeenCalled();
  });

  it('does nothing on other install reasons', async () => {
    await onInstalledCallback({ reason: 'unknown_reason' });

    expect((globalThis as any).browser.tabs.create).not.toHaveBeenCalled();
  });

  it('calls getURL with the correct path on install', async () => {
    await onInstalledCallback({ reason: 'install' });

    expect(
      (globalThis as any).browser.runtime.getURL,
    ).toHaveBeenCalledWith('/get-started.html');
  });
});
