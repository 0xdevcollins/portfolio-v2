import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // GitHub avatars for the hero and open-source section (URLs carry ?v= / ?s= queries).
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Anime cover art in the "Off the clock" section.
      { protocol: "https", hostname: "s4.anilist.co" },
    ],
  },
};

export default nextConfig;
