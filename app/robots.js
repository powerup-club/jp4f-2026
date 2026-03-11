const BASE_URL = "https://jp4f.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/"
      },
      {
        userAgent: "GPTBot",
        allow: "/"
      },
      {
        userAgent: "ClaudeBot",
        allow: "/"
      },
      {
        userAgent: "PerplexityBot",
        allow: "/"
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`
  };
}
