import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";

type Item = { icon: string; title: string; text: string };

/** The three themes: project risk, supply chains, bottom line. */
export default function Themes() {
  const items = useTranslations().raw("themes") as Item[];
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <li key={item.title} data-reveal={i} className="flex gap-5 py-7">
          <Icon name={item.icon} className="mt-0.5 h-8 w-8" />
          <div>
            <h3 className="text-xl">{item.title}</h3>
            <p className="mt-2 text-muted">{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
