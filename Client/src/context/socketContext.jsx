import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();
  
    useEffect(() => {
      if (userInfo) {
        socket.current = io(HOST, {
          query: { userId: userInfo.id },
          withCredentials: true,
        });
  
        socket.current.on("connect", () => {
          console.log("Connected to socket server");
        });
  
        // Inline the handler to avoid the warning
        socket.current.on("recievedMessage", (message) => {
          const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

          if (
            selectedChatType !== undefined &&
            (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
          ) {
            // console.log("Message received:", message);
            addMessage(message);
          }
        });
  
        return () => {
          socket.current.disconnect();
        };
      }
    }, [userInfo]);
  
    return (
      <SocketContext.Provider value={socket.current}>
        {children}
      </SocketContext.Provider>
    );
  };
  