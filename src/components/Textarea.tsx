import { forwardRef, TextareaHTMLAttributes, ReactNode, useId } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label?: string;
  required?: boolean;
  error?: string;
  showError?: boolean;
  helperText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'error' | 'success' | 'medical';
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  // React Hook Form integration
  registration?: UseFormRegisterReturn;
}

/**
 * Base Textarea component with customizable styling and accessibility features
 * 
 * @param label - Label text for the textarea
 * @param required - Whether the field is required (shows asterisk)
 * @param error - Error message to display
 * @param showError - Whether to show the error message (default: true)
 * @param helperText - Helper text below the textarea
 * @param icon - Icon to display inside the textarea
 * @param iconPosition - Position of the icon (left or right)
 * @param variant - Visual variant of the textarea (default, error, success, medical)
 * @param className - Additional classes for the container
 * @param containerClassName - Classes for the container div
 * @param labelClassName - Classes for the label
 * @param textareaClassName - Classes for the textarea element
 * @param helperTextClassName - Classes for the helper text
 * @param errorClassName - Classes for the error message
 * @param registration - React Hook Form registration object for form integration
 * @returns JSX element representing a customizable textarea field
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      required = false,
      error,
      showError = true,
      helperText,
      icon,
      iconPosition = 'left',
      variant = 'default',
      className = "",
      containerClassName = "",
      labelClassName = "",
      textareaClassName = "",
      helperTextClassName = "",
      errorClassName = "",
      registration,
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || `textarea-${generatedId}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    /**
     * Gets the appropriate textarea classes based on variant
     */
    const getTextareaClasses = () => {
      const baseClasses = "w-full min-h-[44px] px-4 py-2 text-base border border-gray-300 rounded-lg bg-white transition-all duration-200 ease-in-out focus:outline-none resize-y";
      
      // Automatically use error variant if there's an error message
      const currentVariant = error ? 'error' : variant;
      
      const variantClasses = {
        default: "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100",
        error: "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100",
        success: "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-100",
        medical: "border-gray-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgb(47_128_237_/_0.1)]"
      };

      const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
      
      return `${baseClasses} ${variantClasses[currentVariant]} ${iconClasses} ${textareaClassName}`;
    };

    return (
      <div className={`${containerClassName} ${className}`}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={textareaId}
            className={`block text-sm font-medium text-gray-700 mb-1 mx-1 ${labelClassName}`}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="Campo requerido">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            </div>
          )}

          {/* Textarea Field */}
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            className={getTextareaClasses()}
            aria-describedby={`${helperText ? helperId : ''} ${error ? errorId : ''}`.trim()}
            aria-invalid={error ? 'true' : 'false'}
            {...registration}
            {...props}
          />

          {/* Right Icon */}
          {icon && iconPosition === 'right' && (
            <div className="absolute top-3 right-0 pr-3 flex items-start pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && (!error || !showError) && (
          <div id={helperId} className={`text-xs text-gray-500 mt-1 mx-1 ${helperTextClassName}`}>
            {helperText}
          </div>
        )}

        {/* Error Message */}
        {error && showError && (
          <div 
            id={errorId} 
            className={`flex items-center gap-1 text-xs text-red-600 mt-1 mx-1 ${errorClassName}`}
            role="alert"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
