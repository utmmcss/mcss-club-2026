import Link from "next/link";
import { forwardRef } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  children?: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, activeClassName, exact = false, children, ...props }, ref) => {
    const router = useRouter();
    const pathname = router.pathname || router.asPath;
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
      <Link href={href} legacyBehavior>
        <a ref={ref} className={cn(className, isActive && activeClassName)} {...props}>
          {children}
        </a>
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
