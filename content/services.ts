/** The four services. Text is in messages/<locale>.json under `services.<key>`. */
export const services = [
  { key: "project", slug: "project-management", image: "/images/construction-site.webp" },
  { key: "logistics", slug: "logistics-investment", image: "/images/truck-fleet.webp" },
  { key: "realEstate", slug: "real-estate", image: "/images/residential-towers.webp" },
  { key: "sourcing", slug: "sourcing-shipping", image: "/images/container-port.webp" },
] as const;

export type ServiceKey = (typeof services)[number]["key"];

export const servicePath = (key: ServiceKey) =>
  `/services/${services.find((s) => s.key === key)!.slug}`;
