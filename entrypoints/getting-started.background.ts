export default defineBackground(() => {
    browser.runtime.onInstalled.addListener(async ({ reason }) => {
        if (reason !== "install") return;
        await browser.tabs.create({
            url: browser.runtime.getURL("/get-started.html"),
            active: true,
        });
    });
});
