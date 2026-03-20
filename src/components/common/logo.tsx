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
    <div className={cn(className)} {...props}>
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
      className={cn(
        `flex items-center gap-2 text-h6 text-primary-700/88`,
        className,
      )}
    >
      {children}
    </Link>
  );
};

// icon
export interface OptionalIconProps extends Omit<IconProps, "Icon"> {
  Icon?: LucideIcon;
}
const LogoIcon = ({ className, ...props }: OptionalIconProps) => {
  return <Icon Icon={ListCollapse} className={cn(className)} {...props} />;
};

//title
//
const LogoTitle = ({ className, ...props }: ComponentProps<"h1">) => {
  return (
    <h1 {...props} className={cn("text-primary-700 tracking-normal", className)}>
      FlatNotebook
    </h1>
  );
};

// description
const LogoDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return <p className={cn("text-muted-foreground", className)} {...props} />;
};

export { LogoDescription, LogoIcon, LogoLink, LogoTitle, Logo };
