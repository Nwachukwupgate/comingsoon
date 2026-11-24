import {
  Building2, ChartNoAxesCombined, Clock3, Cog, Factory, FileText, Handshake, HardHat, KeyRound,
  Layers, MapPin, MessagesSquare, Package, Route, Scale, SearchCheck, ShieldCheck, Tag, Truck,
  Users, Wallet, Wrench, ClipboardList,
} from "lucide-react";

const icons = {
  building: Building2, chart: ChartNoAxesCombined, clock: Clock3, cog: Cog, factory: Factory,
  file: FileText, handshake: Handshake, hardhat: HardHat, key: KeyRound, layers: Layers, pin: MapPin,
  contact: MessagesSquare, package: Package, route: Route, scale: Scale, inspect: SearchCheck,
  shield: ShieldCheck, tag: Tag, truck: Truck, users: Users, wallet: Wallet, wrench: Wrench,
  report: ClipboardList,
};

/** Icon names used in the message files map to lucide icons here. */
export default function Icon({ name, className = "h-7 w-7" }: { name: string; className?: string }) {
  const Svg = icons[name as keyof typeof icons] ?? FileText;
  return <Svg aria-hidden="true" strokeWidth={1.6} className={`shrink-0 text-accent ${className}`} />;
}
