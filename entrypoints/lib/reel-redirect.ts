

export function shouldRedirectReelsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "www.instagram.com" &&
      segments[0] === "reels" &&
      Boolean(segments[1])
    );
  } catch {
    return false;
  }
}

export function transformReelsToTv(url: string): string {
  return url.replace("/reels/", "/tv/");
}
