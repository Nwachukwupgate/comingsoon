/**
 * Site-wide settings: launch switch, contact details and feature flags.
 * Copy lives in /messages. Contact facts live here because they are used by
 * links, structured data and the email API as well as by the pages.
 */

/**
 * LAUNCH SWITCH
 * false: the coming soon page stays at "/", the new site is at "/v2" and is
 *        hidden from search engines.
 * true:  the new site moves to "/", "/v2/..." redirects to it, and search
 *        engines may index it.
 */
export const launched: boolean = false;

/** Path the marketing site is served from. Every internal link uses this. */
export const basePath = launched ? "" : "/v2";

export const site = {
  name: "Upsworth PMS",
  legalName: "Upsworth Project Management Services",
  url: "https://www.upsworth-pms.com",
  email: "info@upsworth-pms.com",
  phones: [
    { display: "+971 54 751 0211", tel: "+971547510211" },
    { display: "+971 58 280 1022", tel: "+971582801022" },
  ],
  whatsapp: "971547510211",
  address: {
    line1: "Office 408, Elite Business Center",
    line2: "Al Barsha 1, Dubai, UAE",
    street: "Office 408, Elite Business Center, Al Barsha 1",
    city: "Dubai",
    country: "AE",
  },
  mapQuery: "Elite Business Center, Al Barsha 1, Dubai",
  social: [
    { name: "Instagram", url: "https://www.instagram.com/upsworth_project_management" },
    { name: "Facebook", url: "https://www.facebook.com/share/19grDZyaam/" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/upsworth-project-management-services-a25667350" },
  ],
  /** Footer credit. TODO: replace with the studio's name, and a URL if wanted. */
  credit: { name: "Studio name", url: "" },
} as const;

export const features = {
  /** Shows the "Investor Login" link in the header. For the future portal. */
  investorLogin: false,
  investorLoginUrl: "/investor",
} as const;
