import { SVGProps } from "react";

/**
 * Plus icon component for add buttons and actions
 * @param props - SVG props including className for color customization
 * @returns JSX element representing a plus sign
 */
const PlusIcon = ({ className = "w-5 h-5", ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    )
}

export default PlusIcon;
