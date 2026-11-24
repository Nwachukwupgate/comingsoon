import Image from "next/image";

const files = {
  horizontal: { file: "upsworth-horizontal", width: 1366, height: 341 },
  stacked: { file: "upsworth-logo", width: 602, height: 421 },
};

type Props = {
  layout?: keyof typeof files;
  /** For dark backgrounds: the navy parts are white. */
  light?: boolean;
  className?: string;
  eager?: boolean;
};

/** The company logo. Artwork is in public/brand. Decorative: name it on the link. */
export default function Logo({ layout = "horizontal", light = false, className = "", eager = false }: Props) {
  const { file, width, height } = files[layout];
  return (
    <Image
      src={`/brand/${file}${light ? "-light" : ""}.svg`}
      alt=""
      width={width}
      height={height}
      unoptimized
      loading={eager ? "eager" : "lazy"}
      className={`w-auto max-w-none ${className}`}
    />
  );
}
