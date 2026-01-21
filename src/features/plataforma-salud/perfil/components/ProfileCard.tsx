'use client';

import { useRouter } from '@/i18n/navigation';

interface ProfileCardProps {
  userName: string;
  userEmail?: string;
  status?: string;
  plan?: string;
  lastVisit?: string;
}

/**
 * Component for displaying patient's profile card with avatar and basic info
 * @param userName - User's full name
 * @param userEmail - User's email address
 * @param status - Account status (ACTIVO, INACTIVO, etc)
 * @param plan - User's plan type (BÁSICO, PREMIUM, etc)
 * @param lastVisit - Date of last visit
 * @returns JSX element with profile card
 */
const ProfileCard = ({ 
  userName, 
  userEmail,
  status = 'ACTIVO',
  plan = 'BÁSICO',
  lastVisit = '15 Oct 2024'
}: ProfileCardProps) => {
  const router = useRouter();
  
  /**
   * Gets initials from user name
   * @param name - Full name of the user
   * @returns Initials (max 2 characters)
   */
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  /**
   * Handles photo change action
   */
  const handleChangePhoto = () => {
    console.log('Cambiar foto');
    // TODO: Implement photo change functionality
  };

  /**
   * Handles medical profile button click
   * Navigates to the medical profile page
   */
  const handleMedicalProfile = () => {
    router.push({ pathname: '/plataforma-salud/perfil-medico' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div 
          className="w-[120px] h-[120px] rounded-full flex items-center justify-center shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #2CA66F 0%, #6FCF97 100%)' 
          }}
        >
          <span className="text-[2.5rem] font-semibold text-white">
            {getInitials(userName)}
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{userName}</h3>
        <p className="text-gray-600">Paciente</p>
      </div>

      {/* Status Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Estado:</span>
          <span 
            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide"
            style={{ 
              backgroundColor: '#dcfce7',
              color: '#166534'
            }}
          >
            {status}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Plan:</span>
          <span 
            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide"
            style={{ 
              backgroundColor: '#dbeafe',
              color: '#1e40af'
            }}
          >
            {plan}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Última visita:</span>
          <span className="font-medium" style={{ color: '#6FCF97' }}>
            {lastVisit}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleChangePhoto}
          className="w-full min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Cambiar Foto
        </button>
        <button
          onClick={handleMedicalProfile}
          className="w-full min-h-[44px] px-4 py-2 text-sm font-medium text-white rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: '#2CA66F',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#248456'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2CA66F'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Mi Perfil Médico
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;

