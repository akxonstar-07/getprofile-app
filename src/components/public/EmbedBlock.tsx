"use client";

import { Play, Music, ExternalLink } from "lucide-react";

interface EmbedBlockProps {
  url: string;
  title?: string;
}

/**
 * Smart embed block for YouTube, Spotify, TikTok, and SoundCloud URLs.
 * Auto-detects the platform and renders the appropriate embed player.
 */
export default function EmbedBlock({ url, title }: EmbedBlockProps) {
  const embedData = getEmbedData(url);

  if (!embedData) {
    // Fallback: render as a regular link
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all group">
        <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400" />
        <span className="text-sm font-bold text-white truncate">{title || url}</span>
      </a>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
      {title && (
        <div className="px-4 py-2 flex items-center gap-2">
          <embedData.icon className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{embedData.platform}</span>
        </div>
      )}
      <div className="relative" style={{ paddingBottom: embedData.aspectRatio }}>
        <iframe
          src={embedData.embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
}

function getEmbedData(url: string) {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return {
      platform: "YouTube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
      aspectRatio: "56.25%", // 16:9
      icon: Play,
    };
  }

  // Spotify Track
  const spotifyTrackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (spotifyTrackMatch) {
    return {
      platform: "Spotify",
      embedUrl: `https://open.spotify.com/embed/track/${spotifyTrackMatch[1]}?theme=0`,
      aspectRatio: "80px",
      icon: Music,
    };
  }

  // Spotify Playlist/Album
  const spotifyMatch = url.match(/spotify\.com\/(playlist|album)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return {
      platform: "Spotify",
      embedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?theme=0`,
      aspectRatio: "380px",
      icon: Music,
    };
  }

  // SoundCloud
  if (url.includes("soundcloud.com")) {
    return {
      platform: "SoundCloud",
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%236366f1&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false`,
      aspectRatio: "166px",
      icon: Music,
    };
  }

  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (tiktokMatch) {
    return {
      platform: "TikTok",
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      aspectRatio: "177.78%", // 9:16 vertical
      icon: Play,
    };
  }

  return null;
}
