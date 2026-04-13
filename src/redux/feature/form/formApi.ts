import { api } from '../../api/apiSlice';

interface FormSubmissionRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  amount?: string;
}

type FormType = 'contact' | 'volunteer' | 'donation' | 'collaboration' | 'feedback';

const formApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitForm: builder.mutation<void, { type: FormType; data: FormSubmissionRequest }>({
      query: ({ type, data }) => ({
        url: `/forms/${type}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubmitFormMutation } = formApi;
