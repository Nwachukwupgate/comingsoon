import Icon from "@/components/ui/Icon";

export type Feature = { icon: string; title: string; text?: string };

const columns = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

/** Hairline grid of icon, title and one line. */
export default function FeatureGrid({ items, cols = 3 }: { items: Feature[]; cols?: 2 | 3 | 4 }) {
  return (
    <ul className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${columns[cols]}`}>
      {items.map((item, i) => (
        <li key={item.title} className="bg-white p-7 sm:p-8">
          <div data-reveal={i % cols}>
            <Icon name={item.icon} className="h-8 w-8" />
            <h3 className="mt-5 text-xl">{item.title}</h3>
            {item.text && <p className="mt-2 text-muted">{item.text}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
