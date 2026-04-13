import { describe, it, expect } from 'vitest';
import { registerSchema, otpSchema } from '../../../pages/auth/register/Schema';

describe('registerSchema', () => {
  it('requires firstName', async () => {
    await expect(registerSchema.validateAt('firstName', { firstName: '' })).rejects.toThrow(
      'Please enter first name.',
    );
  });

  it('requires lastName', async () => {
    await expect(registerSchema.validateAt('lastName', { lastName: '' })).rejects.toThrow(
      'Please enter last name.',
    );
  });

  it('requires email', async () => {
    await expect(registerSchema.validateAt('email', { email: '' })).rejects.toThrow(
      'Please enter email.',
    );
  });

  it('validates email format', async () => {
    await expect(registerSchema.validateAt('email', { email: 'bad' })).rejects.toThrow(
      'Please enter a valid email.',
    );
  });

  it('requires password', async () => {
    await expect(registerSchema.validateAt('password', { password: '' })).rejects.toThrow(
      'Please enter password.',
    );
  });

  it('requires confirmPassword to match', async () => {
    await expect(
      registerSchema.validate({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        password: 'password123',
        confirmPassword: 'different',
      }),
    ).rejects.toThrow('Passwords must match.');
  });

  it('accepts valid data', async () => {
    const result = await registerSchema.validate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.firstName).toBe('John');
  });
});

describe('otpSchema', () => {
  it('requires otp', async () => {
    await expect(otpSchema.validateAt('otp', { otp: '' })).rejects.toThrow('OTP is required');
  });

  it('accepts valid otp', async () => {
    const result = await otpSchema.validate({ otp: '123456' });
    expect(result.otp).toBe('123456');
  });
});
