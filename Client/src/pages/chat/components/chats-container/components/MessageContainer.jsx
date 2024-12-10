// import debounce from "lodash/debounce";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_MESSAGES, HOST } from "@/utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatMessages,
    selectedChatData,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (
          response.data.messages &&
          JSON.stringify(response.data.messages) !==
            JSON.stringify(selectedChatMessages)
        ) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedChatData._id && selectedChatType === "contact") {
      fetchMessages();
    }
  }, [
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    setSelectedChatMessages,
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const downloadFile = async (filePath) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const response = await apiClient.get(`${HOST}/${filePath}`, {
        responseType: "blob", // Ensure binary data is returned
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setFileDownloadProgress(progress);
        },
      });

      const urlBlob = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", filePath.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center my-2 text-gray-500">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessages(message)}
        </div>
      );
    });
  };

  const renderDmMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`border inline-block rounded p-4 my-1 max-w-[50%] break-words ${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-white/20"
          }`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`border inline-block rounded p-4 my-1 max-w-[50%] break-words ${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-white/20"
          }`}
        >
          {checkIfImage(message.fileURL) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileURL);
              }}
            >
              <img
                src={`${HOST}/${message.fileURL}`}
                alt="image"
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileURL.split("/").pop()}</span>
              <span
                onClick={() => downloadFile(message.fileURL)}
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt="image"
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              onClick={() => downloadFile(imageUrl)}
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
