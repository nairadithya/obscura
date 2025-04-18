export default defineBackground({
  persistent: true,
  type: "module",
  main() {
    const browserAPI = typeof browser !== "undefined" ? browser : chrome;
    browserAPI.webNavigation.onHistoryStateUpdated.addListener(
      (details) => {
        if (
          details.url.startsWith("https://www.instagram.com/reels/") &&
          details.url.length >
            "https://www.instagram.com/reels/?next=%2f".length
        ) {
          const newUrl: url = details.url.replace("/reels/", "/reel/");
          browserAPI.tabs.update(details.tabId, { url: newUrl });
        }
      },
      { url: [{ hostSuffix: "instagram.com" }] },
    );
  },
});
