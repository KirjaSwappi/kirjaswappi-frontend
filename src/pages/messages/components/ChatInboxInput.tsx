import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import cameraIcon from '../../../assets/cameraIcon.svg';
import sendIcon from '../../../assets/sendIcon.png';
import Button from '../../../components/shared/Button';
import ControlledInputField from '../../../components/shared/ControllerField';
import Image from '../../../components/shared/Image';
import { showToast } from '../../../components/shared/toast';
import { useSendChatMessageMutation } from '../../../redux/feature/messages/inboxApi';
import { addChatMessages, removeTempMessages } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { MessagesType, messagesSchema } from '../Schema';
import FilesUpload from './FilesUpload';

export default function ChatInboxInput() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraButtonRef = useRef<HTMLButtonElement>(null);
  const { selectedChatId } = useAppSelector((state) => state.chat);
  const { userInformation } = useAppSelector((state) => state.auth);

  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();

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

  const onSubmit = async (data: MessagesType) => {
    if (!selectedChatId || !userInformation.id) return;

    const { message, files } = data;
    const trimmedMessage = message?.trim();

    if (!trimmedMessage && (!files || files.length === 0)) {
      return;
    }

    const imageFiles = files?.filter((file): file is File => file instanceof File) || [];

    // Optimistic update
    const objectUrls: string[] = [];
    if (trimmedMessage || imageFiles.length > 0) {
      const urls =
        imageFiles.length > 0 ? imageFiles.map((f) => URL.createObjectURL(f)) : undefined;
      if (urls) objectUrls.push(...urls);
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        sender: 'me' as const,
        text: trimmedMessage || '',
        time: new Date().toISOString(),
        images: urls,
      };

      dispatch(
        addChatMessages({
          chatId: selectedChatId,
          messages: [optimisticMessage],
        }),
      );
    }

    try {
      await sendChatMessage({
        swapRequestId: selectedChatId,
        message: trimmedMessage || undefined,
        images: imageFiles.length > 0 ? imageFiles : undefined,
      }).unwrap();

      // Remove temp optimistic messages after successful send
      dispatch(removeTempMessages({ chatId: selectedChatId }));
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      reset();
    } catch (error) {
      dispatch(removeTempMessages({ chatId: selectedChatId }));
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      showToast('error', t('toast.messageSendFailed'));
      console.error('Failed to send message:', error);
    }
  };

  if (!selectedChatId) {
    return null;
  }

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
            <FilesUpload name="files" errors={errors} triggerRef={cameraButtonRef} />
          </div>
          <div className="relative">
            <Button
              ref={cameraButtonRef}
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
              placeholder={t('chat.writeHere')}
              autoComplete="off"
              disabled={isLoading}
            />
            <Button
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              type="submit"
              disabled={isLoading}
              className="w-[36px] h-[36px] rounded-full absolute right-2 top-1/2 -translate-y-1/2 flex items-center hover:bg-AntiFlashWhite justify-center disabled:opacity-50"
            >
              <Image src={sendIcon} alt="upload Image" />
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
