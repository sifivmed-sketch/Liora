import { SVGProps } from "react";

/**
 * Person icon component for user profile and account sections
 * @param props - SVG props including className for color customization
 * @returns JSX element representing a person icon
 */
const PersonIcon = ({ className = "w-5 h-5", ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    )
}

export default PersonIcon;

