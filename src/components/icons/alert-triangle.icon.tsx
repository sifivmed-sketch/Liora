import { SVGProps } from "react";

/**
 * Alert triangle icon component for warnings and important information
 * @param props - SVG props including className for color customization
 * @returns JSX element representing an alert triangle
 */
const AlertTriangleIcon = ({ className = "w-5 h-5", ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
    )
}

export default AlertTriangleIcon;
