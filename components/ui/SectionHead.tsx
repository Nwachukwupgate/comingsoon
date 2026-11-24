export default function SectionHead({ title, lead, className = "" }: { title: string; lead?: string; className?: string }) {
  return (
    <div data-reveal className={`max-w-2xl ${className}`}>
      <h2 className="h-section">{title}</h2>
      {lead && <p className="lead mt-5">{lead}</p>}
    </div>
  );
}
