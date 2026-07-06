/**
 * Application error classes for consistent error handling across server functions.
 *
 * Use these instead of raw `throw new Error(...)` to give the client
 * structured error information it can display to users.
 */

/**
 * User-facing error: the message is safe to show to end users.
 * Use this for validation errors, payment failures, rate limits, etc.
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Rates limit exceeded — user should retry after a delay.
 */
export class TooManyRequestsError extends AppError {
  retryAfterSec: number;

  constructor(
    message = 'Too many requests. Please try again later.',
    retryAfterSec = 60
  ) {
    super(message);
    this.name = 'TooManyRequestsError';
    this.retryAfterSec = retryAfterSec;
  }
}

/**
 * Payment not configured — the feature exists but payment is disabled.
 */
export class PaymentNotConfiguredError extends AppError {
  constructor(message = 'Payment is not configured') {
    super(message);
    this.name = 'PaymentNotConfiguredError';
  }
}
