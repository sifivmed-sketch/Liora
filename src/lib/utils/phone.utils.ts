/**
 * Formats a phone number string to (000) 000-0000 format
 * Only allows numeric input and automatically adds parentheses and dashes
 * @param value - The input value to format
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Limit to 10 digits
  const limitedNumbers = numbers.slice(0, 10);

  // Apply formatting based on length
  if (limitedNumbers.length === 0) {
    return "";
  } else if (limitedNumbers.length <= 3) {
    return `(${limitedNumbers}`;
  } else if (limitedNumbers.length <= 6) {
    return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3)}`;
  } else {
    return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(
      3,
      6
    )}-${limitedNumbers.slice(6)}`;
  }
};

/**
 * Cleans a phone number by removing all formatting characters
 * @param phoneNumber - The phone number string to clean
 * @returns Phone number with only digits
 */
export const cleanPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, "");
};

/**
 * Handles phone number input keydown to prevent non-numeric characters
 * @param e - Keyboard event
 */
export const handlePhoneKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>
): void => {
  // Allow: backspace, delete, tab, escape, enter, and decimal point
  if (
    [8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (e.keyCode === 65 && e.ctrlKey === true) ||
    (e.keyCode === 67 && e.ctrlKey === true) ||
    (e.keyCode === 86 && e.ctrlKey === true) ||
    (e.keyCode === 88 && e.ctrlKey === true) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)
  ) {
    return;
  }
  // Ensure that it is a number and stop the keypress
  if (
    (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
    (e.keyCode < 96 || e.keyCode > 105)
  ) {
    e.preventDefault();
  }
};

