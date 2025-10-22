import { SVGProps } from "react";

/**
 * Email icon component for forms and contact sections
 * @param props - SVG props including className for color customization
 * @returns JSX element representing an email icon
 */
const EmailIcon = ({ className = "h-5 w-5 text-gray-400", ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
        </svg>
    )
}

export default EmailIcon;