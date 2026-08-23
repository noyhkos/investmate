import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Only the public marketing routes belong here; /dashboard is per-user.
const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/terms", priority: 0.3 },
  { path: "/privacy", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    priority,
  }));
}
