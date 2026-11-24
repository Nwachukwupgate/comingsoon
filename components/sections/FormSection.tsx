import type { ReactNode } from "react";
import ContactLinks from "./ContactLinks";
import type { PageKey } from "@/lib/pages";

type Props = { id?: string; title: string; body: string; page: PageKey; children: ReactNode; className?: string };

export default function FormSection({ id = "enquiry", title, body, page, children, className = "bg-mist-blue" }: Props) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 className="h-section">{title}</h2>
          <p className="lead mb-8 mt-5">{body}</p>
          <ContactLinks page={page} />
        </div>
        <div className="rounded-2xl bg-white p-6 sm:p-10">{children}</div>
      </div>
    </section>
  );
}
