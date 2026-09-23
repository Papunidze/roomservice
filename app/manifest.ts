import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RoomCall",
    short_name: "RoomCall",
    description: "Guest requests in every language, answered from one inbox.",
    start_url: "/desk",
    display: "standalone",
    background_color: "#F7F4EF",
    theme_color: "#5E7A6B",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
