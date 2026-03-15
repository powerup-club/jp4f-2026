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
        userAgent: "Bingbot",
        allow: "/"
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/"
      },
      {
        userAgent: "YandexBot",
        allow: "/"
      },
      {
        userAgent: "Baiduspider",
        allow: "/"
      },
      {
        userAgent: "PerplexityBot",
        allow: "/"
      }
    ],
    sitemap: 'https://innov-indus.vercel.app/sitemap.xml',
  };  
}

