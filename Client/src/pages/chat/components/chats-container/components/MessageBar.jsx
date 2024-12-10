import { useSocket } from "@/context/socketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const MessageBar = () => {
  const emojiRef = useRef(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const socket = useSocket();
  const fileInputRef = useRef(null);
  const { userInfo, selectedChatType, selectedChatData, setIsUploading, setFileUploadProgress } = useAppStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileURL: undefined,
      });
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setFileUploadProgress(0);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setFileUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          }
        });

        if (response.status === 200 && response.data) {
          setTimeout(() => setIsUploading(false), 1000);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileURL: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[10vh] bg[#1c1d25] flex justify-center items-center px-8 gap-6 mb-6">
      <div className="flex-1 flex bg-[#2a2d33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent focus:outline-none focus:border-none p-5 rounded-md"
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div ref={emojiRef} className="absolute bottom-16 right-0">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        disabled={!message}
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#6a29b6] focus:bg-[#6a29b6] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
