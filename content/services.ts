/** The four services. `cutout` is the transparent model on the phone cards. Text is in messages/<locale>.json under `services.<key>`. */
export const services = [
  { key: "project", slug: "project-management", image: "/images/construction-site.webp", cutout: "/images/service-project.webp" },
  { key: "logistics", slug: "logistics-investment", image: "/images/truck-fleet.webp", cutout: "/images/service-logistics.webp" },
  { key: "realEstate", slug: "real-estate", image: "/images/residential-towers.webp", cutout: "/images/service-real-estate.webp" },
  { key: "sourcing", slug: "sourcing-shipping", image: "/images/container-port.webp", cutout: "/images/service-sourcing.webp" },
] as const;

export type ServiceKey = (typeof services)[number]["key"];

export const servicePath = (key: ServiceKey) =>
  `/services/${services.find((s) => s.key === key)!.slug}`;
