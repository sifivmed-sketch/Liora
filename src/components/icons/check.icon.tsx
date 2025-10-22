import { SVGProps } from "react";

/**
 * Check icon component for success states and confirmations
 * @param props - SVG props including className for color customization
 * @returns JSX element representing a check icon
 */
const CheckIcon = ({ className = "w-5 h-5 text-blue-600 mr-2", ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            className={className} 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            {...props}
        >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
    )
}

export default CheckIcon;