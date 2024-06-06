import type { ZodError } from 'zod';

export class ValidationError extends Error {
  constructor(
    public readonly zodError: ZodError,
    message?: string,
  ) {
    super(message ?? zodError.message);
    this.name = 'ValidationError';
  }
}
