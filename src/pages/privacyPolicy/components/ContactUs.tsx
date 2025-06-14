import { useForm, FormProvider } from 'react-hook-form';
import ControlledInputField from '../../../components/shared/ControllerField';
import InputLabel from '../../../components/shared/InputLabel';
import Button from '../../../components/shared/Button';
import { useNavigate } from 'react-router-dom';
import BookAddUpdateHeader from '../../addUpdateBook/_components/BookAddUpdateHeader';
import { yupResolver } from '@hookform/resolvers/yup';
import contactUsSchema from '../schema';
import contactFrame from '../../../assets/contactFrame.png';
import { InferType } from 'yup';

type ContactFormData = InferType<typeof contactUsSchema>;

export default function ContactUs() {
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(contactUsSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: ContactFormData) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <>
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title="Contact Us" />
      </div>
      <div className="bg-[#F5F7FA] container min-h-screen pb-24 font-poppins lg:bg-white lg:pt-14">
        <div className="px-4 py-8 lg:mt-0 mx-auto lg:px-0 lg:py-0 lg:mx-0 lg:ml-40">
          <h2 className="text-[16px] lg:text-[32px] lg:font-semibold font-medium mb-3 leading-[40px] mt-10 lg:mt-0">
            Contact Us
          </h2>
          <p className="w-full block font-normal text-[10px] lg:text-[14px] leading-5 lg:leading-6 tracking-[0px] text-[#808080] mb-8 whitespace-normal">
            We are here to help and answer any question you might have. We look forward to hearing
            from you.
          </p>
          <div className="w-full lg:max-w-lg">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-4 pb-4 ">
                  <InputLabel label="Name" />
                  <ControlledInputField
                    name="name"
                    placeholder="Enter your name"
                    className="rounded-md border-[#CCCCCC] text-[14px] leading-[20px]  hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    showErrorMessage
                  />
                </div>
                <div className="mt-4 pb-4">
                  <InputLabel label="Email" />
                  <ControlledInputField
                    name="email"
                    placeholder="Enter your email"
                    className="rounded-md border-[#CCCCCC] text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    showErrorMessage
                  />
                </div>
                <div className="mt-4 pb-4 ">
                  <InputLabel label="Subject" />
                  <ControlledInputField
                    name="subject"
                    placeholder="Enter your subject"
                    className="rounded-md border-[#CCCCCC] text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    showErrorMessage
                  />
                </div>
                <div className="mt-4 pb-4">
                  <InputLabel label="Message" />
                  <ControlledInputField
                    type="textarea"
                    name="description"
                    placeholder="Enter your message"
                    className="rounded-md min-h-[122px]  border-[#CCCCCC] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    showErrorMessage
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full lg:w-[151px] lg:h-[48px] lg:text-[14px] bg-primary text-white py-3 rounded-lg mt-4 lg:mt-2"
                >
                  Send Message
                </Button>
              </form>
            </FormProvider>
          </div>
          <div className="hidden lg:block mt-16 mb-8">
            <div className="w-full max-w-2xl bg-white mb-8">
              <h3 className="font-semibold text-[22px] text-base mb-5">Contact Information</h3>
              <p className="font-normal text-[16px] leading-[24px] mb-2 tracking-[0px] font-[Poppins] mr-2">
                Website:{' '}
                <a href="https://www.kirjaswappi.fi" target="_blank" rel="noopener noreferrer">
                  www.Kirjaswappi.fi
                </a>
              </p>
              <p className="font-normal text-[16px] leading-[24px] mb-2 tracking-[0px] font-[Poppins] mr-2">
                Email:{' '}
                <a href="mailto:info@kirjaswappi.fi" className="">
                  info@kirjaswappi.fi
                </a>
              </p>
              <p className="font-normal text-[16px] leading-[24px] mb-2 tracking-[0px] font-[Poppins] mr-2">
                Mailing Address: Emännäntie 10K 25
              </p>
              <p className="font-normal text-[16px] leading-[24px] mb-2 tracking-[0px] font-[Poppins] mr-2">
                Phone:{' '}
                <a href="tel:+358408536161" className="">
                  +358408536161
                </a>
              </p>
            </div>
            <img
              src={contactFrame}
              alt="Contact Map"
              className="w-full max-w-2xl rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
