import {
  shouldRedirectReelsUrl,
  transformReelsToTv,
} from "./lib/reel-redirect";

export default defineBackground({
  persistent: true,
  type: "module",
  main() {
    browser.runtime.onInstalled.addListener(async ({ reason }) => {
      if (reason !== "install") return;
      await browser.tabs.create({
        url: browser.runtime.getURL("/get-started.html"),
        active: true,
      });
    });

    browser.webNavigation.onHistoryStateUpdated.addListener(
      (details) => {
        if (shouldRedirectReelsUrl(details.url)) {
          const newUrl = transformReelsToTv(details.url);
          browser.tabs.update(details.tabId, { url: newUrl });
        }
      },
      { url: [{ hostSuffix: "instagram.com" }] },
    );
  },
});
