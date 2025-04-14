import { defineConfig } from "wxt";

export default defineConfig({
    manifest: {
        permissions: ["webNavigation"],
        host_permissions: ["*://*.instagram.com/"],
    },
});
