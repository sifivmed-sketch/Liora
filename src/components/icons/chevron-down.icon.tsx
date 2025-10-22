import { SVGProps } from "react";

/**
 * Chevron down icon component for dropdowns and selects
 * @param props - SVG props
 * @returns JSX element representing a chevron down icon
 */
const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export default ChevronDownIcon;
