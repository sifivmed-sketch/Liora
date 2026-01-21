import { SVGProps } from "react";

/**
 * Lock security icon component for security, permissions, and access control
 * @param props - SVG props including className for color customization
 * @returns JSX element representing a lock/security icon
 */
const LockSecurityIcon = ({ className = "w-5 h-5", ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    )
}

export default LockSecurityIcon;
