import { useAppStore } from "@/store";
import NewDM from "./components/NewDM";
import ProfileInfo from "./components/ProfileInfo";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_DM_CONTACTS } from "@/utils/constants";
import ContactList from "@/components/ui/contactList";

const ContactsContainer = () => {
  const { closeChat, setDirectMessagesContacts, directMessagesContacts } = useAppStore();
  const [contactsLoaded, setContactsLoaded] = useState(false); // State to track if contacts are loaded

  useEffect(() => {
    const getDmContacts = async () => {
      try {
        const response = await apiClient.get(GET_DM_CONTACTS, {
          withCredentials: true,
        });

        if (response.data.contacts) {
          console.log("Fetched contacts:", response.data.contacts);

          // Only update state if contacts are different
          if (
            JSON.stringify(response.data.contacts) !==
            JSON.stringify(directMessagesContacts)
          ) {
            setDirectMessagesContacts(response.data.contacts);
          }

          setContactsLoaded(true); // Mark contacts as loaded
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    // Fetch contacts only if they are not already loaded
    if (!contactsLoaded) {
      getDmContacts();
    }
  }, [contactsLoaded, setDirectMessagesContacts, directMessagesContacts]);

  

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="cursor-pointer" onClick={closeChat}>
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-5">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="overflow-y-auto max-h-[38vh] scrollbar-hidden">
          <ContactList contacts={directMessagesContacts}/>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-5">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Tik Talk</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 px-5 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
