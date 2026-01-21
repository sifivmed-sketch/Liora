import { SVGProps } from "react";

/**
 * Arrow left icon component for navigation and back buttons
 * @param props - SVG props including className for color customization
 * @returns JSX element representing an arrow pointing left
 */
const ArrowLeftIcon = ({ className = "w-5 h-5", ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    )
}

export default ArrowLeftIcon;
