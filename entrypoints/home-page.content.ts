export default defineContentScript({
    matches: ["*://*.instagram.com/*"],
    runAt: "document_start",
    main() {
        let currentPath = location.pathname;
        let scrollLockStyle: HTMLStyleElement | null = null;
        // Initial check
        if (currentPath === "/") {
            homePagePatches();
        }

        const observer = new MutationObserver((mutations) => {
            if (location.pathname !== currentPath) {
                currentPath = location.pathname;
                if (currentPath === "/") {
                    homePagePatches();
                    for (const mutation of mutations) { removeArticles(mutation); }
                } else {
                    removeScrollLock();
                }
            }
        });

        observer.observe(document, { childList: true, subtree: true });

        function homePagePatches() {
            // Instagram loads suggesed posts when the user scrolls down,
            // so we need to enforce scroll lock to prevent the page from scrolling.
            enforceScrollLock();
            // Just visual improvements, no functional changes:
            removeProgressBar();
            removeSuggestedPostsH3();
            removeAllElementsAfterSuggestedPosts();
        }

        function enforceScrollLock() {
            if (!scrollLockStyle) {
                scrollLockStyle = document.createElement("style");
                scrollLockStyle.textContent = `
                html, body {
                    overflow: hidden !important;
                    height: 100% !important;
                    position: fixed !important;
                    width: 100% !important;
                }
                `;
                document.documentElement.appendChild(scrollLockStyle);
            }
        }

        function removeScrollLock() {
            if (scrollLockStyle) {
                scrollLockStyle.remove();
                scrollLockStyle = null;
            }
        }

        function removeProgressBar() {
            const progressBar = document.querySelector("div[role='progressbar']");
            if (progressBar) {
                progressBar.parentElement?.remove();
            }
        }

        function removeArticles(mutation: MutationRecord) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) return;

                // If the added node is an article, remove it.
                if (node.matches('article')) {
                    node.style.display = 'none';
                    node.remove();
                    return;
                }

                // If the added node contains articles, remove them.
                const articles = node.querySelectorAll('article');
                articles.forEach((article) => { article.style.display = 'none'; article.remove(); });
            }
        }

        function removeAllElementsAfterSuggestedPosts() {
            const divs = document.querySelectorAll("div");
            let suggestedPostsSpan: HTMLSpanElement | null = null;
            for (const div of divs) {
                const spans = div.querySelectorAll("span");
                for (const span of spans) {
                    if (
                        span.textContent &&
                        span.textContent.toLowerCase() == "suggested posts"
                    ) {
                        suggestedPostsSpan = span;
                        break;
                    }
                }
            }

            if (suggestedPostsSpan != null) {
                let element: HTMLSpanElement | HTMLDivElement | null = suggestedPostsSpan;
                // Traverse up the DOM tree to find the parent element that contains the suggested posts.
                // 5 seems to be the sweet spot for Instagram's structure, but you can adjust it if needed.
                for (let i = 0; i < 5; i++) {
                    if (element.parentElement) { element = element.parentElement; }
                    else { break; }
                }
                if (element != null) {
                    element.remove();
                }
            }
        }

        function removeSuggestedPostsH3() { document.querySelectorAll("h3").forEach(h3 => { if (h3.textContent?.toLowerCase() === "suggested posts") h3.remove(); }); }

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
            removeScrollLock();
        });
    }
});