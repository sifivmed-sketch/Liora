/**
 * Formats an identity card (cedula) string to 999-9999999-9 format
 * Only allows numeric input and automatically adds dashes
 * @param value - The input value to format
 * @returns Formatted identity card string
 */
export const formatIdentityCard = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Limit to 11 digits (3-7-1 format)
  const limitedNumbers = numbers.slice(0, 11);

  // Apply formatting based on length
  if (limitedNumbers.length === 0) {
    return "";
  } else if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 10) {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 10)}-${limitedNumbers.slice(10)}`;
  }
};

/**
 * Handles identity card input keydown to prevent non-numeric characters
 * @param e - Keyboard event
 */
export const handleIdentityCardKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>
): void => {
  // Allow: backspace, delete, tab, escape, enter
  if (
    [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
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
