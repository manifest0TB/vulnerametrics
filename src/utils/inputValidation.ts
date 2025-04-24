import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email format')
  .min(5, 'Email is too short')
  .max(254, 'Email is too long') // RFC 5321
  .regex(/^[^<>'"`;%{}]*$/, 'Email contains invalid characters');

// Verification code schema (6 digits)
export const verificationCodeSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{6}$/, 'Verification code must be exactly 6 digits');

// Nickname schema
export const nicknameSchema = z
  .string()
  .trim()
  .min(4, 'Nickname must be at least 4 characters')
  .max(20, 'Nickname must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_-]*$/, 'Nickname can only contain letters, numbers, underscores, and hyphens');

// Password schema following AWS Cognito requirements
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(256, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
  .regex(/^[^<>'"`;%{}]*$/, 'Password contains invalid characters');

// Input sanitization function
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>'"`;%{}]/g, '') // Remove potentially dangerous characters
    .slice(0, 1000); // Prevent extremely long inputs
}

// Type for validation errors
export type ValidationError = {
  isValid: boolean;
  error: string | undefined;
};

// Validation functions that return ValidationError
export function validateEmail(email: string): ValidationError {
  const result = emailSchema.safeParse(sanitizeInput(email));
  return {
    isValid: result.success,
    error: result.success ? undefined : result.error.errors[0].message
  };
}

export function validateVerificationCode(code: string): ValidationError {
  if (!code) {
    return {
      isValid: false,
      error: 'Verification code is required'
    };
  }
  
  if (!/^\d{6}$/.test(code)) {
    return {
      isValid: false,
      error: 'Verification code must be 6 digits'
    };
  }

  return {
    isValid: true,
    error: undefined
  };
}

export function validateNickname(nickname: string): ValidationError {
  const result = nicknameSchema.safeParse(sanitizeInput(nickname));
  return {
    isValid: result.success,
    error: result.success ? undefined : result.error.errors[0].message
  };
}

export function validatePassword(password: string): ValidationError {
  const result = passwordSchema.safeParse(password); // Don't sanitize passwords
  return {
    isValid: result.success,
    error: result.success ? undefined : result.error.errors[0].message
  };
} 