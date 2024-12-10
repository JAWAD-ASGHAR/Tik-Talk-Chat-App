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
  import { useState } from "react";
  import { FaPlus } from "react-icons/fa";
  import { Input } from "@/components/ui/input";
  import { apiClient } from "@/lib/api-client";
  import { SEARCH_CONTACT } from "@/utils/constants";
  import { useAppStore } from "@/store";
  
  const CreateChannel = () => {
    const { setSelectedChatData, setSelectedChatType } = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
  
    const searchContacts = async (searchTerm) => {
      try {
        if (searchTerm.trim().length > 0) {
          const response = await apiClient.post(
            SEARCH_CONTACT,
            { searchTerm },
            { withCredentials: true }
          );
  
          if (response.status === 200) {
            setSearchedContacts(response.data.contacts);
          }
        } else {
          setSearchedContacts([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const selectNewContact = async (contact) => {
      setOpenNewContactModal(false);
      setSelectedChatType("contact");
      setSelectedChatData(contact);
      setSearchedContacts([]);
    };
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className="text-neutral-400 font-light text-sm text-opacity-90 hover:text-neutral-100 transition-all duration-300 cursor-pointer"
                onClick={() => setOpenNewContactModal(true)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
              <p>Select New Contact</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
          <DialogContent className="bg-[#181920]  border-none text-white w-[400px] h-[400px] flex flex-col">
            <DialogHeader>
              <DialogTitle>Please select a contact</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                onChange={(e) => searchContacts(e.target.value)}
                placeholder="Search..."
                className="bg-[#2c2e3b] border-none rounded-lg p-6"
              />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  export default CreateChannel;
  