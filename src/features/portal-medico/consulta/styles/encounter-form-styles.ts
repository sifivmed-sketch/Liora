/**
 * Shared encounter form styles (enc-*) for Consulta and Plantillas.
 * Matches reference encounter-workspace.css.
 */
export const encInput =
  'w-full min-h-[40px] rounded-[7px] border-[1.5px] border-gray-300 bg-white py-[9px] px-3 text-[13px] text-gray-900 placeholder-gray-400 ' +
  'hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/10 transition-colors';
export const encInputSelect = encInput + ' cursor-pointer pr-9';
export const encTextarea = encInput + ' min-h-[80px] resize-y leading-relaxed';
export const encLabel = 'text-[11.5px] font-semibold text-gray-700';
export const encLabelReq = encLabel;
export const encFieldGroup = 'flex flex-col gap-[5px]';
export const encFieldGrid = 'grid grid-cols-1 sm:grid-cols-2 gap-3.5';
export const encFieldGrid3 = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5';
export const encHelper = 'text-[10.5px] text-gray-500 leading-snug';
export const encProfileGrid = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4';
export const encProfileField = 'flex flex-col gap-[3px]';
export const encProfileLabel = 'text-[9.5px] font-bold uppercase tracking-[0.06em] text-gray-500';
export const encProfileValue = 'text-[13px] font-semibold text-gray-900';
export const encBloodBadge = 'inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200';
export const encSubsectionTitle = 'flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-blue-600 pb-2 mb-3.5 border-b-2 border-blue-100';
export const encNotice = 'flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-[7px] p-2.5 text-[11.5px] text-blue-800';
export const encVitalsGrid = 'grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3';
export const encVitalCard = 'bg-gray-50 border-[1.5px] border-gray-200 rounded-[9px] p-[11px] pr-3 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-[3px] focus-within:ring-blue-600/10 transition-colors';
export const encVitalLabel = 'text-[9.5px] font-bold uppercase tracking-[0.05em] text-gray-500';
export const encVitalInput = 'w-full border-0 bg-transparent p-0 text-[22px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal placeholder:text-sm focus:outline-none';
export const encConditionItem = 'flex items-center gap-2 py-2 px-2.5 border border-gray-200 rounded-[7px] cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50';
export const encConditionLabel = 'text-xs text-gray-700 cursor-pointer leading-snug';
