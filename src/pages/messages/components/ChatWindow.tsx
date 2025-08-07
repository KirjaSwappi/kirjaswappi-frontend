import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
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
export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const { chats, selectedChatId } = useAppSelector((state) => state.chat);

  const methods = useForm({
    resolver: yupResolver(messagesSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
      files: [],
    },
  });

  const { handleSubmit, reset, getValues } = methods;
  const findChat = chats.find((chat) => chat.id === selectedChatId);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(receiveMessage({ chatId: selectedChatId, text: 'Hello, this is a reply!' }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch, selectedChatId]);

  console.log(getValues());
  const onSubmit = (data: MessagesType) => {
    const { message } = data;
    if (!message?.trim()) return;

    if (message?.trim()) {
      dispatch(sendMessage({ chatId: selectedChatId, text: message }));
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
        {findChat?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[60%]`}>
              <div
                className={`font-poppins text-sm font-normal ${msg.sender === 'me' ? 'bg-primary text-white rounded-xl p-4  ' : ''}`}
              >
                {msg.text}
              </div>
              <div
                className={`text-sx mt-2  ${msg.sender === 'me' ? 'text-right pr-3' : 'text-left '}`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-white absolute -bottom-14 left-0 w-full">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button className="w-[36px] h-[36px] rounded-full  absolute left-8 top-1/2 -translate-y-1/2 bg-smokyBlack hover:bg-blackOlive flex items-center justify-center">
              <Image src={cameraIcon} alt="upload Image" />
            </Button>
            <ControlledInputField
              name="message"
              className="rounded-full border border-platinumMix !bg-white px-16"
              placeholder="Write here..."
            />
            <Button
              type="submit"
              className="w-[36px] h-[36px] rounded-full  absolute right-10 top-1/2 -translate-y-1/2 flex items-center hover:bg-AntiFlashWhite justify-center"
            >
              <Image src={sendIcon} alt="upload Image" />
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
