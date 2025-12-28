import Image from "next/image";

/**
 * Logo component for Whobi application
 * @returns {JSX.Element} The logo component
 */
const Logo = () => {
    return (
        <Image 
            src="/logo.png" 
            alt="Whobi Logo"
            width={200}
            height={200}
            className="w-32 h-32 mx-auto mb-6 object-contain relative"
            priority
        />
    )
}

export default Logo;