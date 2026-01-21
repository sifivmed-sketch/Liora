import { SVGProps } from "react";

/**
 * X close icon component for delete and close actions
 * @param props - SVG props including className for color customization
 * @returns JSX element representing an X/close icon
 */
const XCloseIcon = ({ className = "w-5 h-5", ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}

export default XCloseIcon;
