import Image from "next/image";
import type { ReactNode } from "react";

type Props = { title: string; lead: string; image: string; alt: string; children?: ReactNode };

/** Top of every inner page. */
export default function PageHero({ title, lead, image, alt, children }: Props) {
  return (
    <section className="bg-mist pt-[var(--header)]">
      <div className="wrap grid items-center gap-x-12 gap-y-8 pb-0 pt-12 sm:pt-16 lg:min-h-[35rem] lg:grid-cols-[1.02fr_1fr] lg:pb-16">
        <div>
          <h1 className="h-display">{title}</h1>
          <p className="lead mt-6 max-w-xl">{lead}</p>
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="relative -mx-5 aspect-[4/3] sm:-mx-8 lg:mx-0 lg:-me-[max(2rem,calc((100vw-78rem)/2+2rem))] lg:aspect-auto lg:h-full lg:min-h-[27rem]">
          <Image
            src={image}
            alt={alt}
            fill
            preload
            fetchPriority="high"
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover lg:rounded-s-2xl"
          />
        </div>
      </div>
    </section>
  );
}
