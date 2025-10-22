'use client';

import { forwardRef, ReactNode, useId } from "react";
import NextLink from "next/link";
import { Link as NavigationLink } from "@/i18n/navigation";

export type LinkVariant = 'default' | 'medical' | 'health';
export type LinkType = 'next' | 'navigation';

// Type for Next.js Link href
type NextLinkHref = string | { pathname: string };

// Type for NavigationLink href (more restrictive)
type NavigationLinkHref = "/" | "/portal-medico/login" | "/portal-medico/registro" | { pathname: "/" } | { pathname: "/portal-medico/login" } | { pathname: "/portal-medico/registro" };

interface BaseLinkProps {
  children: ReactNode;
  href: NextLinkHref | NavigationLinkHref;
  variant?: LinkVariant;
  type?: LinkType;
  className?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  ariaLabel?: string;
  tabIndex?: number;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

/**
 * Reusable Link component with customizable variants and navigation types
 * 
 * @param children - Content to display inside the link
 * @param href - URL or path to navigate to
 * @param variant - Visual variant of the link (default, medical, health)
 * @param type - Type of navigation (next for Next.js Link, navigation for i18n NavigationLink)
 * @param className - Additional CSS classes
 * @param target - Target attribute for the link
 * @param rel - Rel attribute for the link
 * @param disabled - Whether the link is disabled
 * @param ariaLabel - Accessible label for screen readers
 * @param tabIndex - Tab index for keyboard navigation
 * @param onClick - Click handler function
 * @param onKeyDown - Keyboard event handler
 * @returns JSX element representing a customizable link
 */
const Link = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  (
    {
      children,
      href,
      variant = 'medical',
      type = 'navigation',
      className = "",
      target,
      rel,
      disabled = false,
      ariaLabel,
      tabIndex = 0,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const linkId = `link-${generatedId}`;

    /**
     * Gets the appropriate link classes based on variant
     */
    const getLinkClasses = () => {
      const baseClasses = "transition-colors duration-200 focus:outline-none rounded-md px-1";
      
      const variantClasses = {
        default: "",
        medical: "text-blue-600 underline hover:text-blue-800 focus:ring-blue-500",
        health: "text-[var(--color-primary)] underline hover:text-[#248456] focus:ring-[var(--color-primary)]"
      };

      const disabledClasses = disabled 
        ? "text-gray-400 cursor-not-allowed hover:text-gray-400" 
        : "";

      return `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;
    };

    /**
     * Handles click events
     */
    const handleClick = () => {
      if (disabled) return;
      onClick?.();
    };

    /**
     * Handles keyboard events for accessibility
     */
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;
      
      // Handle Enter and Space keys
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
      
      onKeyDown?.(event);
    };

    // Common props for all link types
    const commonProps = {
      id: linkId,
      className: getLinkClasses(),
      'aria-label': ariaLabel,
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : tabIndex,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      ...props
    };

    // Render based on link type
    if (type === 'next') {
      return (
        <NextLink
          ref={ref}
          href={href}
          target={target}
          rel={rel}
          {...commonProps}
        >
          {children}
        </NextLink>
      );
    }

    // Default to NavigationLink (i18n navigation)
    return (
      <NavigationLink
        ref={ref}
        href={href as NavigationLinkHref}
        target={target}
        rel={rel}
        {...commonProps}
      >
        {children}
      </NavigationLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
