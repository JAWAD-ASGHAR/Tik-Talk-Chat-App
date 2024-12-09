import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-8">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="flex justify-start items-center gap-3">
            <div className="w-12 h-12 relative ">
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 flex items-center justify-center text-lg border-[1px] rounded-full ${getColor(
                      selectedChatData.color
                    )} `}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.trim().charAt(0)
                      : selectedChatData.email.trim().charAt(0)}
                  </div>
                )}
              </Avatar>
            </div>
            <div className="flex flex-col">
              {selectedChatType === "contact" && (
                <>
                  <span>
                    {selectedChatData.firstName && selectedChatData.lastName
                      ? ` ${selectedChatData.firstName} ${selectedChatData.lastName}`
                      : `${selectedChatData.email}`}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {selectedChatData.email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
