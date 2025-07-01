import * as yup from 'yup';
import { SUPPORTED_FORMATS } from '../../../utility/constant';

const FILE_SIZE = 10 * 1024 * 1024; // 10MB

const imageSchema = yup
  .mixed<File | string>()
  .required('Image is required')
  .test('fileType', 'Only JPG, JPEG or PNG file types are allowed', (value) => {
    if (typeof value === 'string') return true;
    return value instanceof File && SUPPORTED_FORMATS.includes(value.type);
  })
  .test('fileSize', 'File size must be less than 10MB', (value) => {
    if (typeof value === 'string') return true;
    return value instanceof File && value.size <= FILE_SIZE;
  })
  .test('validUrlOrFile', 'Must provide a valid image file or a non-empty image URL', (value) => {
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return value instanceof File;
  });

const bookDetails = yup.object().shape({
  coverPhotos: yup.array().of(imageSchema).min(1, 'At least one image is required'),
  title: yup.string().required('Book title is required'),
  author: yup.string().required('Author name is required'),
  language: yup.string().required('Book language is required'),
  condition: yup.string().required('Book condition is required'),
});

const otherDetails = yup.object().shape({
  genres: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select at least one genre.')
    .required('Genres are required.'),
});

const conditionDetails = yup.object().shape({
  swapType: yup.string().required('Swap type is required'),
  swappableBooks: yup.array().when('swapType', {
    is: 'ByBooks',
    then: (schema) =>
      schema
        .of(
          yup.object().shape({
            title: yup.string().required('Book title is required'),
            author: yup.string().required('Author name is required'),
            coverPhoto: yup
              .mixed<File | string>()
              .required('Book cover is required')
              .test('fileType', 'Unsupported file format. Only JPG, PNG allowed.', (value) => {
                if (typeof value === 'string') return true; // skip if URL
                if (value instanceof File) {
                  return SUPPORTED_FORMATS.includes(value.type);
                }
                return false;
              })
              // File size validation
              .test('fileSize', 'File size must be less than 10MB.', (value) => {
                if (typeof value === 'string') return true; // skip if URL
                if (value instanceof File) {
                  return value.size <= FILE_SIZE;
                }
                return false;
              })
              // URL validation
              .test(
                'validUrlOrFile',
                'Must provide a valid image file or a non-empty image URL.',
                (value) => {
                  if (typeof value === 'string') {
                    return value.trim() !== '';
                  }
                  return value instanceof File;
                },
              ),
          }),
        )
        .min(1, 'Please add at least one book'),
    otherwise: (schema) => schema.notRequired(),
  }),
  swappableGenres: yup
    .array()
    .of(yup.string())
    .when('swapType', {
      is: 'ByGenres',
      then: () => yup.array().min(1, 'Please select at least one genre.'),
    }),
});

export type IBookDetailsType = yup.InferType<typeof bookDetails>;
export type IOtherDetailsType = yup.InferType<typeof otherDetails>;
export type IConditionDetailsType = yup.InferType<typeof conditionDetails>;

export const validationSchemas = [bookDetails, otherDetails, conditionDetails];
