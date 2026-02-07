'use client';

import { useState } from 'react';
import ProfileCard from './ProfileCard';
import ProfilePersonalInfoForm from './ProfilePersonalInfoForm';

interface ProfilePageContentProps {
  sessionId: string;
  idPaciente: string;
  userName: string;
  userEmail: string;
}

/**
 * Main profile page content component
 * Displays profile card on the left and forms on the right
 * @param sessionId - Session ID from login
 * @param idPaciente - Patient ID from session
 * @param userName - User's full name
 * @param userEmail - User's email
 * @returns JSX element with complete profile page layout
 */
const ProfilePageContent = ({ 
  sessionId, 
  idPaciente, 
  userName, 
  userEmail 
}: ProfilePageContentProps) => {
  const [profileProgress, setProfileProgress] = useState(0);

  /**
   * Handles profile progress updates from the form
   * @param progress - The new progress percentage (0-100)
   */
  const handleProgressChange = (progress: number) => {
    setProfileProgress(progress);
  };

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
              <p className="text-gray-600 text-sm lg:text-base">Gestiona tu información personal y configuración del sistema</p>
            </div>
            
            {/* Profile completion */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Perfil completado</div>
              <div className="text-xl font-semibold" style={{ color: '#6FCF97' }}>
                {profileProgress}%
              </div>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full ml-auto mt-1.5">
                <div 
                  className="h-full rounded-full transition-all duration-300" 
                  style={{ 
                    backgroundColor: '#6FCF97',
                    width: `${profileProgress}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="#" className="hover:underline" style={{ color: '#2CA66F' }}>
                  Dashboard
                </a>
              </li>
              <li><span>/</span></li>
              <li><span className="text-gray-900">Mi Perfil</span></li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4">
            <ProfileCard 
              userName={userName}
              userEmail={userEmail}
            />
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-8">
            <ProfilePersonalInfoForm 
              sessionId={sessionId}
              idPaciente={idPaciente}
              onProgressChange={handleProgressChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageContent;

