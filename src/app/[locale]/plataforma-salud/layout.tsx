import { ReactNode } from "react";

interface PlataformaSaludLayoutProps {
  children: ReactNode;
}

/**
 * Layout component for the health platform section
 * Provides specific styling and structure for the health platform pages
 * 
 * @param children - The child components to render within this layout
 * @returns JSX element with health platform layout structure
 */
const PlataformaSaludLayout = ({ children }: PlataformaSaludLayoutProps) => {
  return (
    <div className="plataforma-salud">
      {children}
    </div>
  );
};

export default PlataformaSaludLayout;
