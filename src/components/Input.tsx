import { forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
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
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  // React Hook Form integration
  registration?: UseFormRegisterReturn;
}

/**
 * Base Input component with customizable styling and accessibility features
 * 
 * @param label - Label text for the input
 * @param required - Whether the field is required (shows asterisk)
 * @param error - Error message to display
 * @param showError - Whether to show the error message (default: true)
 * @param helperText - Helper text below the input
 * @param icon - Icon to display inside the input
 * @param iconPosition - Position of the icon (left or right)
 * @param variant - Visual variant of the input (default, error, success, medical)
 * @param className - Additional classes for the container
 * @param containerClassName - Classes for the container div
 * @param labelClassName - Classes for the label
 * @param inputClassName - Classes for the input element
 * @param helperTextClassName - Classes for the helper text
 * @param errorClassName - Classes for the error message
 * @param registration - React Hook Form registration object for form integration
 * @returns JSX element representing a customizable input field
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
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
      inputClassName = "",
      helperTextClassName = "",
      errorClassName = "",
      registration,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

     /**
      * Gets the appropriate input classes based on variant
      */
     const getInputClasses = () => {
       // For checkbox inputs, use minimal base classes
       const baseClasses = props.type === 'checkbox' 
         ? "focus:outline-none" 
         : "w-full min-h-[44px] px-4 py-2 text-base border border-gray-300 rounded-lg bg-white transition-all duration-200 ease-in-out focus:outline-none";
       
       // Automatically use error variant if there's an error message
       const currentVariant = error ? 'error' : variant;
       
       const variantClasses = {
         default: "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100",
         error: "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-100",
         success: "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-100",
         medical: "border-gray-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgb(47_128_237_/_0.1)]"
       };

       const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
       
       // For checkbox, only apply base classes and custom input classes
       if (props.type === 'checkbox') {
         return `${baseClasses} ${inputClassName}`;
       }
       
       return `${baseClasses} ${variantClasses[currentVariant]} ${iconClasses} ${inputClassName}`;
     };

    // For checkbox inputs, render a simple native checkbox without component styling
    if (props.type === 'checkbox') {
      return (
        <div className={`${containerClassName} ${className}`}>
          <div className="flex items-center">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              className={inputClassName}
              aria-describedby={`${helperText ? helperId : ''} ${error ? errorId : ''}`.trim()}
              aria-invalid={error ? 'true' : 'false'}
              {...registration}
              {...props}
            />
            {label && (
              <label 
                htmlFor={inputId}
                className={`ml-2 text-sm font-medium text-gray-700 ${labelClassName}`}
              >
                {label}
                {required && (
                  <span className="text-red-500 ml-1" aria-label="Campo requerido">
                    *
                  </span>
                )}
              </label>
            )}
          </div>

          {/* Helper Text */}
          {helperText && (!error || !showError) && (
            <div id={helperId} className={`text-xs text-gray-500 mt-1 ${helperTextClassName}`}>
              {helperText}
            </div>
          )}

          {/* Error Message */}
          {error && showError && (
            <div 
              id={errorId} 
              className={`flex items-center gap-1 text-xs text-red-600 mt-1 ${errorClassName}`}
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

    return (
      <div className={`${containerClassName} ${className}`}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
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

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={getInputClasses()}
            aria-describedby={`${helperText ? helperId : ''} ${error ? errorId : ''}`.trim()}
            aria-invalid={error ? 'true' : 'false'}
            {...registration}
            {...props}
          />

          {/* Right Icon */}
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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

Input.displayName = 'Input';

export default Input;
