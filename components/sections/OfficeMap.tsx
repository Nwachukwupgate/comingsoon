import { useTranslations } from "next-intl";
import { site } from "@/content/site";

export default function OfficeMap() {
  const t = useTranslations("contact");
  const q = encodeURIComponent(site.mapQuery);
  return (
    <div>
      <iframe
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        title={t("mapTitle")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block aspect-[4/3] w-full rounded-2xl border border-line bg-mist sm:aspect-[16/9] lg:aspect-[21/9]"
      />
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link mt-5"
      >
        {t("directions")}
      </a>
    </div>
  );
}
