chrome.webNavigation.onHistoryStateUpdated.addListener((code) => {
  if (code.url.startsWith("https://www.instagram.com/reels/") &&
      code.url.length > "https://www.instagram.com/reels/?next=%2F".length) {

    let newUrl = code.url.replace("/reels/", "/reel/");
    chrome.tabs.update(code.tabId, { url: newUrl });
  }
}, { url: [{ urlPrefix: "https://www.instagram.com/reels/" }] });
