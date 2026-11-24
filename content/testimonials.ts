/**
 * TODO: the owner must supply real testimonials, with each person's permission
 * to publish their words, name and company. Do not add invented ones.
 *
 * While this list is empty the testimonial sections do not render, and the
 * scroll stories show a key fact or the disclaimer instead.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
  /** Shows in that service's scroll story as well as on the home page. */
  service?: "project" | "logistics" | "realEstate" | "sourcing";
};

export const testimonials: Testimonial[] = [];
