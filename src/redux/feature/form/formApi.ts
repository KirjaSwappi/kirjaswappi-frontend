import { api } from '../../api/apiSlice';

interface FormSubmissionRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  amount?: string;
}

const formApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitForm: builder.mutation<void, { type: string; data: FormSubmissionRequest }>({
      query: ({ type, data }) => ({
        url: `/forms/${type}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubmitFormMutation } = formApi;
