import { describe, it, expect } from 'vitest';
import contactUsSchema from '../../../pages/privacyPolicy/schema';

describe('contactUsSchema', () => {
  it('requires name', async () => {
    await expect(contactUsSchema.validateAt('name', { name: '' })).rejects.toThrow(
      'Name is required',
    );
  });

  it('requires email', async () => {
    await expect(contactUsSchema.validateAt('email', { email: '' })).rejects.toThrow(
      'Email is required',
    );
  });

  it('validates email format', async () => {
    await expect(contactUsSchema.validateAt('email', { email: 'invalid' })).rejects.toThrow(
      'Enter a valid email',
    );
  });

  it('requires subject', async () => {
    await expect(contactUsSchema.validateAt('subject', { subject: '' })).rejects.toThrow(
      'Subject is required',
    );
  });

  it('requires message', async () => {
    await expect(contactUsSchema.validateAt('message', { message: '' })).rejects.toThrow(
      'Message is required',
    );
  });

  it('accepts valid data', async () => {
    const result = await contactUsSchema.validate({
      name: 'John',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'Hi there',
    });
    expect(result.name).toBe('John');
  });
});
