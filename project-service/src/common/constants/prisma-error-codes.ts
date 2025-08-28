/**
 * Prisma Error Codes
 * Reference: https://www.prisma.io/docs/reference/api-reference/error-reference
 */
export const PRISMA_ERROR_CODES = {
  // Unique constraint violation
  UNIQUE_CONSTRAINT_VIOLATION: 'P2002',
  // Record not found
  RECORD_NOT_FOUND: 'P2025',
  // Foreign key constraint violation
  FOREIGN_KEY_CONSTRAINT_VIOLATION: 'P2003',
  // Required field missing
  REQUIRED_FIELD_MISSING: 'P2011',
  // Invalid field value
  INVALID_FIELD_VALUE: 'P2007',
} as const;

export type PrismaErrorCode = (typeof PRISMA_ERROR_CODES)[keyof typeof PRISMA_ERROR_CODES];
