import { cn } from "@/lib/utils";
import { Icon, IconProps } from "@/ui";
import { ListCollapse, LucideIcon, LucideProps } from "lucide-react";
import { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";

// wrapper
interface LogoWrapperProps extends ComponentProps<"div"> {
  children: ReactNode;
}
const Logo = ({ children, className, ...props }: LogoWrapperProps) => {
  return (
    <div className={cn(`flex flex-col gap-1 max-w-max`, className)} {...props}>
      {children}
    </div>
  );
};

// link wrapper
interface LogoLinkProps extends ComponentProps<"a"> {
  children: ReactNode;
  className?: string;
  to?: string;
}
const LogoLink = ({ children, className, to = "/" }: LogoLinkProps) => {
  return (
    <Link
      to={to}
      style={{ color: "var(--color-primary-700)" }}
      className={cn(`flex items-center gap-2 text-h6 max-w-max`, className)}
    >
      {children}
    </Link>
  );
};

// icon
export interface OptionalIconProps extends Omit<IconProps, "Icon"> {
  Icon?: LucideIcon;
}
const LogoIcon = ({
  className,
  size = "md",
  strokeWidth = "normal",
  ...props
}: OptionalIconProps) => {
  return (
    <Icon
      Icon={ListCollapse}
      className={cn("mb-px", className)}
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
};

//title
const LogoTitle = ({ className, ...props }: ComponentProps<"h1">) => {
  return (
    <h1
      {...props}
      className={cn(
        "tracking-tight font-[566] text-base flex gap-[0.33ex] leading-none",
        className,
      )}
    >
      <span>Flat</span> <span>Notebook</span>
    </h1>
  );
};

// description
const LogoDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return (
    <p
      className={cn("text-muted-foreground font-normal leading-none", className)}
      {...props}
    />
  );
};

export { LogoDescription, LogoIcon, LogoLink, LogoTitle, Logo };
