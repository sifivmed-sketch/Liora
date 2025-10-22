import { forwardRef, ReactNode, useId, useState, useRef } from "react";
import Select, { StylesConfig, SingleValue, components, DropdownIndicatorProps, MenuPlacement } from 'react-select';
import { UseFormRegisterReturn } from "react-hook-form";
import ChevronDownIcon from "./icons/chevron-down.icon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
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
  selectClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  registration?: UseFormRegisterReturn;
}

const CustomSelect = forwardRef<HTMLDivElement, SelectProps>(
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
      selectClassName = "",
      helperTextClassName = "",
      errorClassName = "",
      options,
      placeholder,
      value = "",
      onChange,
      name,
      registration,
      id,
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;
    
    const [menuPlacement, setMenuPlacement] = useState<MenuPlacement>('bottom');
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value) || null;

    // Calculate menu placement based on available space
    const calculateMenuPlacement = () => {
      if (!selectRef.current) return;
      
      const selectRect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - selectRect.bottom;
      const spaceAbove = selectRect.top;
      const menuHeight = Math.min(options.length * 42 + 8, 240); // Approximate height
      
      // If not enough space below but more space above, open upward
      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        setMenuPlacement('top');
      } else {
        setMenuPlacement('bottom');
      }
    };

    const handleChange = (newValue: SingleValue<SelectOption>) => {
      const optionValue = newValue?.value || '';
      onChange?.(optionValue);
      
      if (registration?.onChange) {
        const event = {
          target: { 
            name: registration.name || name || '', 
            value: optionValue 
          }
        };
        registration.onChange(event);
      }
    };

    // Custom Dropdown Indicator with ChevronDownIcon
    const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, false>) => {
      return (
        <components.DropdownIndicator {...props}>
          <div className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${props.selectProps.menuIsOpen ? 'rotate-180' : ''}`}>
            <ChevronDownIcon />
          </div>
        </components.DropdownIndicator>
      );
    };

    const customStyles: StylesConfig<SelectOption, false> = {
      control: (provided, state) => {
        const currentVariant = error ? 'error' : variant;
        
        const variantStyles = {
          default: {
            borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.1)' : 'none',
            '&:hover': {
              borderColor: state.isFocused ? '#2563eb' : '#9ca3af'
            }
          },
          error: {
            borderColor: '#dc2626',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(220, 38, 38, 0.1)' : 'none',
            '&:hover': {
              borderColor: '#ef4444'
            }
          },
          success: {
            borderColor: '#10b981',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.1)' : 'none',
            '&:hover': {
              borderColor: '#059669'
            }
          },
          medical: {
            borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(47, 128, 237, 0.1)' : 'none',
            '&:hover': {
              borderColor: state.isFocused ? '#2563eb' : '#9ca3af'
            }
          }
        };

        return {
          ...provided,
          minHeight: '44px',
          borderRadius: '0.75rem',
          fontSize: '16px',
          backgroundColor: '#ffffff',
          transition: 'all 0.2s ease-in-out',
          paddingLeft: icon && iconPosition === 'left' ? '36px' : '12px',
          paddingRight: icon && iconPosition === 'right' ? '36px' : '8px',
          cursor: 'pointer',
          ...variantStyles[currentVariant]
        };
      },
      valueContainer: (provided) => ({
        ...provided,
        padding: '2px 4px',
      }),
      input: (provided) => ({
        ...provided,
        margin: '0',
        padding: '0',
      }),
      placeholder: (provided) => ({
        ...provided,
        color: '#6b7280',
        margin: '0',
      }),
      singleValue: (provided) => ({
        ...provided,
        color: '#111827',
        margin: '0',
      }),
      indicatorSeparator: () => ({
        display: 'none'
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: '#9ca3af',
        padding: '8px',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          color: '#9ca3af'
        }
      }),
      menuPortal: (provided) => ({
        ...provided,
        zIndex: 9999,
      }),
      menu: (provided) => ({
        ...provided,
        marginTop: '2px',
        marginBottom: '2px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        minWidth: '100%',
      }),
      menuList: (provided) => ({
        ...provided,
        padding: '4px 0',
        maxHeight: '240px',
        overflowY: 'auto',
      }),
      option: (provided, state) => ({
        ...provided,
        fontSize: '16px',
        padding: '10px 16px',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        backgroundColor: state.isDisabled 
          ? '#f9fafb' 
          : state.isSelected 
          ? '#eff6ff'
          : state.isFocused 
          ? '#f9fafb'
          : '#ffffff',
        color: state.isDisabled 
          ? '#9ca3af' 
          : state.isSelected 
          ? '#1d4ed8'
          : '#111827',
        fontWeight: state.isSelected ? '500' : '400',
        transition: 'background-color 0.15s ease-in-out',
        '&:active': {
          backgroundColor: state.isDisabled ? '#f9fafb' : '#eff6ff',
        }
      }),
    };

    return (
      <div className={`${containerClassName} ${className}`} ref={ref}>
        {label && (
          <label 
            htmlFor={selectId}
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

        <div className="relative z-0" ref={selectRef}>
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            </div>
          )}

          <Select
            instanceId={selectId}
            inputId={selectId}
            value={selectedOption}
            onChange={handleChange}
            options={options}
            placeholder={placeholder}
            isDisabled={false}
            isClearable={false}
            isSearchable={false}
            styles={customStyles}
            className={selectClassName}
            classNamePrefix="custom-select"
            aria-describedby={`${helperText ? helperId : ''} ${error ? errorId : ''}`.trim()}
            aria-invalid={error ? 'true' : 'false'}
            components={{
              DropdownIndicator
            }}
            isOptionDisabled={(option) => option.disabled || false}
            menuPlacement={menuPlacement}
            menuPosition="fixed"
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            menuShouldScrollIntoView={false}
            maxMenuHeight={240}
            onMenuOpen={calculateMenuPlacement}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none z-10">
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            </div>
          )}

          {registration && (
            <input
              type="hidden"
              {...registration}
              value={value}
            />
          )}
        </div>

        {helperText && (!error || !showError) && (
          <div id={helperId} className={`text-xs text-gray-500 mt-1 mx-1 ${helperTextClassName}`}>
            {helperText}
          </div>
        )}

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

CustomSelect.displayName = 'Select';

export default CustomSelect;