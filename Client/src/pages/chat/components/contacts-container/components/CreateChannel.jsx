import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL,
  GET_ALL_CONTACTS,
  SEARCH_CONTACT,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleSelect";

const CreateChannel = () => {
  const { setSelectedChatData, setSelectedChatType, addChannel } =
    useAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.trim().length === 0) return;
      if (selectedContacts.length === 0) return;
      if (channelName.trim().length > 0) {
        const response = apiClient.post(
          CREATE_CHANNEL,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          const channel = response.data.channel;
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          addChannel(channel);
        }
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-sm text-opacity-90 hover:text-neutral-100 transition-all duration-300 cursor-pointer"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Craete New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920]  border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel
            </DialogTitle>
          </DialogHeader>
          <div>
            <Input
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel Name..."
              className="bg-[#2c2e3b] border-none rounded-lg p-6"
            />
          </div>
          <div>
            <MultipleSelector
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No results found.
                </p>
              }
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Select Contacts..."
            />
          </div>
          <div>
            <Button
              onClick={createChannel}
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
