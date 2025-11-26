import { defineConfig } from "wxt";

export default defineConfig({
    webExt: {
        disabled: false,
        startUrls: ['https://instagram.com'],
    },
    manifest: {
        permissions: ["webNavigation"],
        host_permissions: ["*://*.instagram.com/"],
    },
});
