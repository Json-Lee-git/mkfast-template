import { describe, it, expect } from 'vitest';
import {
  AppError,
  TooManyRequestsError,
  PaymentNotConfiguredError,
} from '../errors';

describe('AppError', () => {
  it('has the correct name', () => {
    const err = new AppError('something went wrong');
    expect(err.name).toBe('AppError');
    expect(err.message).toBe('something went wrong');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('TooManyRequestsError', () => {
  it('has the correct name and default values', () => {
    const err = new TooManyRequestsError();
    expect(err.name).toBe('TooManyRequestsError');
    expect(err.message).toBe('Too many requests. Please try again later.');
    expect(err.retryAfterSec).toBe(60);
    expect(err).toBeInstanceOf(AppError);
    expect(err).toBeInstanceOf(Error);
  });

  it('accepts custom message and retryAfterSec', () => {
    const err = new TooManyRequestsError('Rate limited', 30);
    expect(err.message).toBe('Rate limited');
    expect(err.retryAfterSec).toBe(30);
  });
});

describe('PaymentNotConfiguredError', () => {
  it('has the correct name', () => {
    const err = new PaymentNotConfiguredError();
    expect(err.name).toBe('PaymentNotConfiguredError');
    expect(err).toBeInstanceOf(AppError);
  });
});
