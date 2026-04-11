import { useState } from "react";

export function parseLiveUrl(url: string | null): string | null {
  if (!url) return null;
  const u = url.toLowerCase();
  
  // YouTube 
  // https://youtu.be/xyz -> xyz
  // https://youtube.com/watch?v=xyz -> xyz
  if (u.includes("youtube.com") || u.includes("youtu.be")) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1`;
    }
  }

  // Twitch
  // https://twitch.tv/username -> username
  if (u.includes("twitch.tv")) {
    const parts = url.split("/");
    const username = parts[parts.length - 1];
    if (username) {
      const parentUrl = typeof window !== "undefined" ? window.location.hostname : "localhost";
      return `https://player.twitch.tv/?channel=${username}&parent=${parentUrl}&autoplay=true&muted=true`;
    }
  }

  return null;
}
