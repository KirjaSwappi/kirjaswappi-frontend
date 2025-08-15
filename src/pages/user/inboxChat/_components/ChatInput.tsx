import { useState } from 'react';
import sendIcon from '../../../../assets/sendIcon.png';
import cameraIcon from '../../../../assets/solar_camera-bold.png';
import { ChatInputProps } from '../interface';

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="sticky bottom-0 w-full px-4 py-3 z-40 lg:pr-5 lg:pl-5">
      <div className="flex items-center gap-2 px-3 py-2 border border-platinumMix bg-[#FFFFFF] rounded-[29px] shadow-sm">
        {/* Camera Icon */}
        <button className="flex items-center justify-center min-w-[36px] min-h-[36px] bg-black rounded-full">
          <img src={cameraIcon} alt="Camera" className="h-5 w-5" />
        </button>

        {/* Input */}
        <input
          type="text"
          className="flex-1 outline-none bg-transparent text-base px-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{ lineHeight: '24px' }}
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="flex items-center justify-center min-w-[36px] min-h-[36px] rounded-full"
        >
          <img src={sendIcon} alt="Send" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
