import { describe, it, expect } from 'vitest';
import { loginSchema } from '../../../pages/auth/login/Schema';

describe('loginSchema', () => {
  it('requires email', async () => {
    await expect(loginSchema.validateAt('email', { email: '' })).rejects.toThrow(
      'Please enter email.',
    );
  });

  it('validates email format', async () => {
    await expect(loginSchema.validateAt('email', { email: 'bad' })).rejects.toThrow(
      'Please Enter your valid email',
    );
  });

  it('requires password', async () => {
    await expect(loginSchema.validateAt('password', { password: '' })).rejects.toThrow(
      'Please enter Password.',
    );
  });

  it('accepts valid data', async () => {
    const result = await loginSchema.validate({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.email).toBe('test@example.com');
  });
});
