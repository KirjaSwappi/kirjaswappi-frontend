import * as yup from 'yup';
import { InferType } from 'yup';

const FILE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];

const imageSchema = yup
  .mixed<File | string>()
  .test('fileType', 'Only JPG, JPEG, or PNG file types are allowed', (value) => {
    if (!value) return true; // Optional
    if (typeof value === 'string') return true;
    return value instanceof File && SUPPORTED_FORMATS.includes(value.type);
  })
  .test('fileSize', 'File size must be less than 10MB', (value) => {
    if (!value) return true;
    if (typeof value === 'string') return true;
    return value instanceof File && value.size <= FILE_SIZE;
  });

export const messagesSchema = yup.object().shape({
  message: yup.string().optional(),
  files: yup.array().of(imageSchema).optional(),
});

export type MessagesType = InferType<typeof messagesSchema>;
