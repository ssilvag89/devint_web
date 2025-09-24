// Validation utilities for forms and data

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateField(
  value: string,
  rules: ValidationRule
): ValidationResult {
  const errors: string[] = [];

  if (rules.required && (!value || value.trim() === "")) {
    errors.push(rules.message || "Este campo es requerido");
    return { isValid: false, errors };
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push(
      rules.message || `Debe tener al menos ${rules.minLength} caracteres`
    );
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    errors.push(
      rules.message || `No debe exceder ${rules.maxLength} caracteres`
    );
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.message || "El formato no es válido");
  }

  if (value && rules.custom && !rules.custom(value)) {
    errors.push(rules.message || "El valor no es válido");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateEmail(email: string): ValidationResult {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return validateField(email, {
    required: true,
    pattern: emailPattern,
    message: "Ingrese un email válido",
  });
}

export function validatePhone(phone: string): ValidationResult {
  // Chilean phone number validation
  const phonePattern = /^(\+56)?[2-9]\d{7,8}$/;
  const cleanPhone = phone.replace(/[\s-]/g, "");

  return validateField(cleanPhone, {
    pattern: phonePattern,
    message: "Ingrese un teléfono válido (ej: +56 9 1234 5678)",
  });
}

export function validateRUT(rut: string): ValidationResult {
  const cleanRUT = rut.replace(/[^0-9kK]/g, "");

  if (cleanRUT.length < 8 || cleanRUT.length > 9) {
    return {
      isValid: false,
      errors: ["RUT debe tener entre 8 y 9 caracteres"],
    };
  }

  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const calculatedDV =
    remainder < 2
      ? remainder.toString()
      : remainder === 2
      ? "K"
      : (11 - remainder).toString();

  return {
    isValid: dv === calculatedDV,
    errors: dv === calculatedDV ? [] : ["RUT no es válido"],
  };
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Debe contener al menos una mayúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Debe contener al menos una minúscula");
  }

  if (!/\d/.test(password)) {
    errors.push("Debe contener al menos un número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Debe contener al menos un carácter especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateForm(
  data: Record<string, string>,
  rules: Record<string, ValidationRule>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [field, rule] of Object.entries(rules)) {
    results[field] = validateField(data[field] || "", rule);
  }

  return results;
}

export function hasFormErrors(
  validationResults: Record<string, ValidationResult>
): boolean {
  return Object.values(validationResults).some((result) => !result.isValid);
}

export function getFormErrors(
  validationResults: Record<string, ValidationResult>
): string[] {
  return Object.values(validationResults)
    .filter((result) => !result.isValid)
    .flatMap((result) => result.errors);
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/[^\w\s@.-]/g, ""); // Keep only alphanumeric, spaces, email chars
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password) &&
    !/(.)\1{2,}/.test(password) // No more than 2 consecutive identical characters
  );
}
