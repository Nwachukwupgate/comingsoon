import { getImageProps } from "next/image";

type Props = {
  desktop: string;
  mobile: string;
  alt: string;
  className?: string;
  eager?: boolean;
};

/** One picture with different crops for phones and desktop. Fills its parent. */
export default function ArtPicture({ desktop, mobile, alt, className, eager }: Props) {
  const common = { alt, fill: true as const, sizes: "100vw" };
  const large = getImageProps({ ...common, src: desktop, quality: 75 }).props;
  const small = getImageProps({ ...common, src: mobile, quality: 75 }).props;
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={large.srcSet} sizes="100vw" />
      <img
        {...small}
        alt={alt}
        className={className}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
      />
    </picture>
  );
}
