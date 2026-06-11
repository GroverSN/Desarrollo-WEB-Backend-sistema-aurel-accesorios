export enum PasswordStrength {
  WEAK = 'weak',
  INTERMEDIATE = 'intermediate',
  STRONG = 'strong',
}

export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  message: string;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (password.length < 6) {
    return {
      isValid: false,
      strength: PasswordStrength.WEAK,
      message: 'La contraseña debe tener al menos 6 caracteres',
    };
  }

  if (score <= 2) {
    return {
      isValid: true,
      strength: PasswordStrength.WEAK,
      message: 'Contraseña débil: usa mayúsculas, minúsculas, números y caracteres especiales',
    };
  }

  if (score <= 3) {
    return {
      isValid: true,
      strength: PasswordStrength.INTERMEDIATE,
      message: 'Contraseña intermedia',
    };
  }

  return {
    isValid: true,
    strength: PasswordStrength.STRONG,
    message: 'Contraseña fuerte',
  };
};