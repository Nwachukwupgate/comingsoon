export type PageKey = "home" | "about" | "contact" | "project" | "logistics" | "realEstate" | "sourcing";

export const pagePaths: Record<PageKey, string> = {
  home: "/",
  about: "/about",
  contact: "/contact",
  project: "/services/project-management",
  logistics: "/services/logistics-investment",
  realEstate: "/services/real-estate",
  sourcing: "/services/sourcing-shipping",
};
