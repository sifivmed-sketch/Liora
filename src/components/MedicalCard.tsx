import { ReactNode } from "react";

interface MedicalCardProps {
  children: ReactNode;
  variant?: 'medical-portal' | 'health-platform';
  className?: string;
}

/**
 * MedicalCard component with different variants for medical and health platform sections
 * 
 * Variants:
 * - 'medical-portal': Features a blue gradient top border for portal médico
 * - 'health-platform': Clean white card with shadow for health platform
 * 
 * @param children - Content to be displayed inside the card
 * @param variant - Card variant determining the styling ('medical-portal' | 'health-platform')
 * @param className - Additional CSS classes to apply to the card
 * @returns JSX element representing a medical-themed card
 */
const MedicalCard = ({ 
  children, 
  variant = 'health-platform', 
  className = "" 
}: MedicalCardProps) => {
  const baseClasses = "relative bg-white rounded-xl shadow-xl overflow-hidden";
  
  const variantClasses = {
    'medical-portal': "border border-blue-100",
    'health-platform': "rounded-3xl shadow-2xl"
  };

  const topBorderClasses = {
    'medical-portal': "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400",
    'health-platform': ""
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Top border for medical-portal variant */}
      {variant === 'medical-portal' && (
        <div className={topBorderClasses[variant]}></div>
      )}
      
      {/* Card content */}
      <div className={variant === 'health-platform' ? 'p-6 md:p-8' : ''}>
        {children}
      </div>
    </div>
  );
};

export default MedicalCard;
