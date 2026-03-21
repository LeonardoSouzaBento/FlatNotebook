import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export const buttonVariants = cva(
  "w-auto tracking-wide inline-flex items-center justify-center gap-2 font-medium rounded-md ring-offset-background transition-colors disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 relative data-w-full:w-full data-rounded:rounded-full focus:outline-none data-option:rounded-full data-black:text-foreground data-option:text-sm data-option:px-[0.64em] leading-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary-600 text-primary-foreground disabled:bg-neutral-300 disabled:text-neutral-500/80 active:bg-primary-800 hover:bg-primary-600 focus:border-3 focus:border-selected/75",
        outline:
          "border-2 border-primary/88 text-primary bg-transparent hover:bg-gray-50 shadow-xs/12 disabled:bg-neutral-100 disabled:border-neutral-300 disabled:text-neutral-500/75 hover:bg-primary-50 focus:outline-selected/70 focus:outline-2 active:bg-primary-100",
        ghost:
          "hover:bg-primary-50 border text-primary bg-transparent disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-none hover:bg-primary-50 focus:outline-selected/70 focus:outline-3 focus:border-primary-400 active:bg-primary-100",
        transparent: "bg-transparent text-primary-800 hover:bg-primary-100/70",
        link: "text-primary underline-offset-4 hover:underline",
        secondary:
          "bg-primary-100/75 text-primary hover:bg-primary-100 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-none hover:bg-primary-50/75 focus:outline-3 focus:outline-selected/75 active:bg-primary-100",
        destructive:
          "bg-red-700 text-red-50 hover:bg-red-600 hover:bg-red-600 focus:outline-3 focus:outline-red-200 active:bg-red-800",
      },
      size: {
        sm: "h-9 text-sm-button",
        default: `h-10`,
        lg: "h-11 text-lg-button",
        "icon-sm": "size-8",
        icon: "size-9",
        "icon-md": "size-10",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const paddings = {
  default: {
    sm: "px-[0.93em] py-[0.63885rem]",
    default: "px-[0.93em] py-[0.73438rem]",
    lg: "px-[0.93em] py-[0.82813rem]",
  },
  outline: {
    sm: "px-[0.82716em] py-[0.54794rem]",
    default: "px-[0.83304em] py-[0.64347rem]",
    lg: "px-[0.83857em] py-[0.73722rem]",
  },
  ghost: {
    sm: "px-[0.82841em] py-[0.6076rem]",
    default: "px-[0.83429em] py-[0.70313rem]",
    lg: "px-[0.83982em] py-[0.79688rem]",
  },
};

type OmitVariant = keyof typeof paddings | "destructive" | "secondary";
type OmitSize = keyof typeof paddings.default;
const paddingExptions = {
  variants: ["link", "transparent"],
  sizes: ["icon", "icon-sm", "icon-md", "icon-lg"],
};

const otherVariants = ["destructive", "secondary", "transparent"];

const getPaddings = (variant: OmitVariant, size: OmitSize): string => {
  let padding = "";
  if (
    !paddingExptions.sizes.includes(size) &&
    !paddingExptions.variants.includes(variant)
  ) {
    if (otherVariants.includes(variant)) {
      padding = paddings.default[size];
    } else {
      padding = paddings[variant][size];
    }
  }
  return padding;
};

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  selected?: boolean;
  disabled?: boolean;
  closeButton?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      selected,
      disabled,
      closeButton = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const padding = getPaddings(variant as OmitVariant, size as OmitSize);
    const selectedCSS = selected
      ? "border-2 border-selected text-primary bg-primary-50/25 hover:bg-card"
      : "";
    const closeButtonCSS = closeButton ? "rounded-full text-foreground" : "";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          selectedCSS,
          closeButtonCSS,
          padding,
          className,
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
