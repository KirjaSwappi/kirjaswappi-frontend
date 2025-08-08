import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IoIosArrowBack, IoIosInformationCircleOutline } from 'react-icons/io';
import cameraIcon from '../../../assets/cameraIcon.svg';
import sendIcon from '../../../assets/sendIcon.png';
import Button from '../../../components/shared/Button';
import ControlledInputField from '../../../components/shared/ControllerField';
import Image from '../../../components/shared/Image';
import { receiveMessage, sendMessage } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { messagesSchema, MessagesType } from '../Schema';
import FilesUpload from './FilesUpload';
export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chats, selectedChatId } = useAppSelector((state) => state.chat);

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
  const findChat = chats.find((chat) => chat.id === selectedChatId);
  const imageFiles = watch('files');

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      inputRef?.current?.focus();
    }
  }, [imageFiles]);
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(receiveMessage({ chatId: selectedChatId, text: 'Hello, this is a reply!' }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch, selectedChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [findChat?.messages]);

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
    <div className="w-full relative">
      <div className="px-4 py-4 border-b border-platinumMix flex items-center justify-between ">
        <Button>
          <IoIosArrowBack size={20} className="text-black" />
        </Button>
        <p className="font-poppins text-base font-normal text-[#1A1A1A]">Minhazur Rahman</p>
        <Button>
          <IoIosInformationCircleOutline size={20} className="text-black" />
        </Button>
      </div>
      <div
        className="h-[73vh] overflow-y-auto custom-scrollbar space-y-2 pb-10 mt-4 px-6"
        style={{ scrollbarWidth: 'none' }}
      >
        {findChat?.messages.map((msg) => {
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[60%]`}
              >
                {msg.images && (
                  <div className="">
                    {msg.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={msg.text}
                        className="rounded-xl max-w-[200px] mb-0.5"
                      />
                    ))}
                  </div>
                )}
                {msg.text && (
                  <div
                    className={`inline-block font-poppins text-sm font-normal max-w-fit break-words ${
                      msg.sender === 'me'
                        ? 'bg-primary text-white rounded-xl p-3 self-end'
                        : 'bg-gray-200 text-black rounded-xl  self-star'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                <div
                  className={`text-sx mt-2  ${msg.sender === 'me' ? 'text-right pr-3' : 'text-left '}`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="px-6 py-3 bg-white absolute -bottom-14 left-0 w-full">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${imageFiles && imageFiles?.length > 0 ? 'rounded-[29px]' : 'rounded-full'}  border border-platinumMix !bg-white`}
          >
            <div className={`${imageFiles && imageFiles?.length > 0 ? 'ml-4 mt-3' : ''} `}>
              <FilesUpload name="files" errors={errors} />
            </div>
            <div className="relative">
              <Button
                id="files"
                type="button"
                className={`w-[36px] h-[36px] rounded-full  absolute left-2 top-1/2 -translate-y-1/2 bg-smokyBlack hover:bg-blackOlive flex items-center justify-center ${imageFiles && imageFiles?.length <= 0 ? 'block' : 'hidden'}`}
              >
                <Image src={cameraIcon} alt="upload Image" />
              </Button>

              <ControlledInputField
                ref={inputRef}
                name="message"
                className={`border-none !bg-transparent ${imageFiles && imageFiles?.length <= 0 ? 'px-14' : ''} `}
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
                className="w-[36px] h-[36px] rounded-full  absolute right-2 top-1/2 -translate-y-1/2 flex items-center hover:bg-AntiFlashWhite justify-center"
              >
                <Image src={sendIcon} alt="upload Image" />
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
