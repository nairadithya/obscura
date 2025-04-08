import "./hiders.css";

export default defineContentScript({
  matches: ["*://*.instagram.com/*"],
  main(ctx) {
    document.addEventListener("DOMContentLoaded", (event) => {
      element = document.querySelectorAll(
        "a[href='https://aistudio.instagram.com/?utm_source=ig_web_nav']",
      )[0];
      if (element) {
        element.remove();
      }
      console.log("Hello content.");
    });
  },
});
