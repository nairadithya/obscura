import "./hiders.css";

export default defineContentScript({
    matches: ["*://*.instagram.com/*"],
    main() {
        function deleteReelsSuggestions() {
            if (!location.pathname.startsWith("/reel/")) return;
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
            return;
        }

        deleteReelsSuggestions();
    },
});
