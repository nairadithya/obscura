const CONTAINER_CLASS = "x1lliihq";
const REEL_SELECTOR = 'a[href^="/reels/"]';

export function findReelContainer(
  element: HTMLElement,
): HTMLElement | null {
  let candidate: HTMLElement | null = element;
  while (candidate && !candidate.classList.contains(CONTAINER_CLASS)) {
    candidate = candidate.parentElement;
  }
  return candidate;
}

export function hideReelElements(root: HTMLElement): void {
  const reels = Array.from(root.querySelectorAll<HTMLAnchorElement>(REEL_SELECTOR));
  if (root instanceof HTMLAnchorElement && root.matches(REEL_SELECTOR)) {
    reels.unshift(root);
  }
  for (const reel of reels) {
    const container = findReelContainer(reel);
    if (container) {
      container.style.display = "none";
    }
  }
}
