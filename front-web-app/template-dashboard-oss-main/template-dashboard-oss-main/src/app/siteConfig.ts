export const siteConfig = {
  name: "Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/",
    overview: "/overview",
    details: "/details",
    settings: "/settings",
    adding:"/adding",
    archive:"/archive",
    login:"/adminlogin",
  },
  externalLink: {
    blocks: "https://blocks.tremor.so/templates#dashboard",
  },
}

export type siteConfig = typeof siteConfig
