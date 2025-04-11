export default defineContentScript({
    matches: ["*://*.instagram.com/reel/*"],
    main() {
        if (!location.pathname.startsWith("/reel/")) return;
        console.log("Hello from content.ts");
        const divs = document.querySelectorAll("div");
        let morePostsFromDiv;
        for (const div of divs) {
            if (
                div.textContent &&
                div.textContent.startsWith("More posts from")
            ) {
                morePostsFromDiv = div;
                morePostsFromDiv.remove();
                console.log(morePostsFromDiv);
                break;
            }
        }
    },
});
