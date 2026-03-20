import type { LucideIcon as LucideIconType, LucideProps } from "lucide-react";

type StrokeWidthValue = keyof typeof weights;

const weights = {
  thin: 1.55,
  extralight: 1.7,
  light: 1.85,
  normal: 2,
  medium: 2.15,
  semibold: 2.3,
  bold: 2.45,
  extrabold: 2.6
}

type SizeValue = keyof typeof iconSizes;

const iconSizes = {
  xxs: "0.889em",
  xs: "0.943em",
  sm: "1em",
  base: "1.061em",
  md: "1.125em",
  lg: "1.266em",
  xl: "1.424em",
  "2xl": "1.602em",
  h6: "1.125em",
  h5: "1.266em",
  h4: "1.424em",
  h3: "1.602em",
};

export interface IconProps extends Omit<LucideProps, "size" | "strokeWidth"> {
  Icon: LucideIconType;
  size?: SizeValue | string;
  strokeWidth?: StrokeWidthValue | string;
}

export const Icon = ({
  Icon,
  size,
  className,
  strokeWidth = "normal",
  fill,
}: IconProps) => {
  return (
    <div className="h-3 inline-flex justify-center items-center overflow-visible [&_svg]:shrink-0">
      <Icon
        size={iconSizes[size as SizeValue] || size || iconSizes.base}
        strokeWidth={
          weights[strokeWidth as StrokeWidthValue] ||
          strokeWidth ||
          weights.normal
        }
        className={className}
        fill={fill || "none"}
      />
    </div>
  );
};
