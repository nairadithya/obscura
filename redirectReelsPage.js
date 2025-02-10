export function redirectShortsPage() {
    const cleanURL = window.location.toString().replace('reels/', 'reel/');
    window.location.replace(cleanURL);
}
