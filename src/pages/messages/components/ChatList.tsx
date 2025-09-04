/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { createSearchParams, useNavigate } from 'react-router-dom';
import book from '../../../assets/book3.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import Input from '../../../components/shared/Input';
import { useGetAllMessagesByUserIdQuery } from '../../../redux/feature/messages/messagesApi';
import { useAppSelector } from '../../../redux/hooks';
import { truncateText } from '../../../utility/helper';
export default function ChatList() {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>('');
  // const { chats, selectedChatId } = useAppSelector((state) => state.chat);
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);
  const { data: messages } = useGetAllMessagesByUserIdQuery({ userId: id }, { skip: !id });
  console.log(messages);
  // const filteredChats = chats.filter((chat) => {
  //   return chat.name.toLowerCase().includes(search.toLowerCase());
  // });
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0">
        <div className="xl:hidden h-14 bg-white fixed top-0 left-0 w-full flex items-center justify-center z-20 border-b border-platinumMix">
          <h4 className="text-base font-poppins font-normal">Message</h4>
        </div>
        <div className="xl:bg-white px-4 mt-12 lg:mt-0">
          <div className="relative h-[40px]">
            <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-grayDark text-xl" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 mb-3 border rounded-full border-gray !bg-white h-[40px] pl-10 xl:pl-[52px]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-5 mb-6">
            <Button className="bg-primary text-white font-poppins text-xs font-medium py-2 px-3 rounded-full">
              Inbox
            </Button>
            <Button className="font-poppins text-xs font-medium py-2 px-3 rounded-full border border-gray text-grayDark">
              Archive
            </Button>
            <Button className="font-poppins text-xs font-medium py-2 px-3 rounded-full border border-gray text-grayDark">
              Message Request
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-16 lg:pb-0 lg:px-0">
        {messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm font-poppins">No chats found.</p>
          </div>
        ) : (
          <div>
            {messages?.map((chat: any, index: number) => {
              // const lastMsg = chat.messages[chat.messages.length - 1];
              console.log(chat);
              return (
                <div
                  key={chat.id}
                  className={`group border-b border-platinumMix ${messages.length - 1 > index ? '' : 'mb-6'}`}
                >
                  <Button
                    type="button"
                    onClick={() => {
                      // dispatch(selectChat(chat.id));
                      navigate({
                        pathname: '/user/messages',
                        search: `?${createSearchParams({
                          messageId: String(chat.id ?? ''),
                          userId: id ?? '',
                        })}`,
                      });
                    }}
                    className="w-full py-3 text-left px-3 cursor-pointer focus:outline-none items-center gap-4 flex group-hover:bg-AntiFlashWhite"
                    tabIndex={0}
                    // aria-pressed={selectedChatId === chat.id}
                  >
                    <div className="w-14 min-w-14 h-14 max-h-14">
                      <Image src={book} alt="book cover" className="rounded-full w-full h-full" />
                    </div>
                    <div className="w-10/12 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="w-full flex items-center gap-1">
                          <p className="font-medium text-smokyBlack text-sm font-poppins">
                            {truncateText(chat?.bookToSwapWith?.title, 12)}
                          </p>
                          <span className="text-grayDark font-poppins text-sx">
                            [{chat?.sender?.name}]
                          </span>
                        </div>
                        <p className="font-poppins text-blackOlive text-xs w-7">5 m</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs w-10/12 font-poppins ${
                            chat.unread ? 'text-smokyBlack' : 'text-grayDark'
                          }`}
                        >
                          {/* {truncateText(lastMsg?.text, 25)} */}
                        </p>
                        {chat.unread && (
                          <div className="w-6 h-6 text-white bg-primary rounded-full flex items-center justify-center">
                            <p className="font-poppins text-sm font-medium">2</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
