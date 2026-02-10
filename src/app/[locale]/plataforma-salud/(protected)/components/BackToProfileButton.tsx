'use client';

import Link from 'next/link';

interface BackToProfileButtonProps {
  label: string;
}

/**
 * Client component for back to profile button with hover effects
 * @param label - The button label text
 * @returns JSX element with styled button
 */
const BackToProfileButton = ({ label }: BackToProfileButtonProps) => {
  return (
    <Link
      href="/plataforma-salud/perfil"
      className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ backgroundColor: '#2F80ED' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E6FD9'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F80ED'}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
        />
      </svg>
      {label}
    </Link>
  );
};

export default BackToProfileButton;
