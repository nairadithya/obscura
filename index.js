chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.startsWith("https://www.instagram.com/reels/")) {
    let newUrl = details.url.replace("/reels/", "/reel/");
    chrome.tabs.update(details.tabId, { url: newUrl });
  }
}, { url: [{ urlPrefix: "https://www.instagram.com/reels/" }] });
