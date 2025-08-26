import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import cameraIcon from '../../../assets/cameraIcon.svg';
import sendIcon from '../../../assets/sendIcon.png';
import Button from '../../../components/shared/Button';
import ControlledInputField from '../../../components/shared/ControllerField';
import Image from '../../../components/shared/Image';
import { sendMessage } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { messagesSchema, MessagesType } from '../Schema';
import FilesUpload from './FilesUpload';

export default function ChatInboxInput() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedChatId } = useAppSelector((state) => state.chat);
  const methods = useForm({
    resolver: yupResolver(messagesSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
      files: [],
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;
  const imageFiles = watch('files');

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      inputRef?.current?.focus();
    }
  }, [imageFiles]);

  const onSubmit = (data: MessagesType) => {
    const { message } = data;
    const images = [];
    if (data.files?.length) {
      const fileUrls = data?.files
        ?.filter((file): file is File => file instanceof File)
        .map((file) => URL.createObjectURL(file));
      images.push(...fileUrls);
    }

    const trimmedMessage = message?.trim();

    if (trimmedMessage || images.length > 0) {
      dispatch(
        sendMessage({
          chatId: selectedChatId,
          text: trimmedMessage ?? '',
          images: images.length > 0 ? images : undefined,
        }),
      );
    }
    reset();
  };

  return (
    <div className="px-4 py-3 xl:py-4 bg-light lg:bg-white w-full">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${
            imageFiles && imageFiles?.length > 0 ? 'rounded-[29px]' : 'rounded-full'
          } border border-platinumMix !bg-white`}
        >
          <div className={`${imageFiles && imageFiles?.length > 0 ? 'ml-4 mt-3' : ''}`}>
            <FilesUpload name="files" errors={errors} />
          </div>
          <div className="relative">
            <Button
              id="files"
              type="button"
              className={`w-[36px] h-[36px] rounded-full absolute left-2 top-1/2 -translate-y-1/2 bg-smokyBlack hover:bg-blackOlive flex items-center justify-center ${
                imageFiles && imageFiles?.length <= 0 ? 'block' : 'hidden'
              }`}
            >
              <Image src={cameraIcon} alt="upload Image" />
            </Button>
            <ControlledInputField
              ref={inputRef}
              name="message"
              className={`border-none !bg-transparent ${
                imageFiles && imageFiles?.length <= 0 ? 'px-14' : ''
              }`}
              placeholder="Write here..."
              autoComplete="off"
            />
            <Button
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              type="submit"
              className="w-[36px] h-[36px] rounded-full absolute right-2 top-1/2 -translate-y-1/2 flex items-center hover:bg-AntiFlashWhite justify-center"
            >
              <Image src={sendIcon} alt="upload Image" />
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
