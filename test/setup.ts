import { vi } from 'vitest';

function createBrowserMock() {
  return {
    runtime: {
      onInstalled: { addListener: vi.fn() },
      getURL: vi.fn((path: string) => `moz-extension://fake${path}`),
    },
    tabs: {
      create: vi.fn(),
      update: vi.fn(),
    },
    webNavigation: {
      onHistoryStateUpdated: { addListener: vi.fn() },
    },
  };
}

const browserMock = createBrowserMock();

(globalThis as any).browser = browserMock;
(globalThis as any).chrome = browserMock;

// WXT injects `defineBackground` and `defineContentScript` as globals.
// We mock them so entry-point modules can be imported in tests.
(globalThis as any).defineBackground = vi.fn((options: any) => {
  if (typeof options === 'function') return options();
  if (options.main) return options.main();
  return options;
});
(globalThis as any).defineContentScript = vi.fn((options: any) => {
  if (typeof options === 'function') return options();
  if (options.main) return options.main();
  return options;
});
