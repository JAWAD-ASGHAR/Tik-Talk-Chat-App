import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Logged out successfully!");
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Failed to logout!");
      console.log(error);
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-5 w-full bg-[#2a2b33]">
      <div className="flex items-center w-full justify-between">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 relative ">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {userInfo.image ? (
                <AvatarImage
                  src={`${HOST}/${userInfo.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 flex items-center justify-center text-lg border-[1px] rounded-full ${getColor(
                    userInfo.selectedColor
                  )} `}
                >
                  {userInfo.firstName
                    ? userInfo.firstName.trim().charAt(0)
                    : userInfo.email.trim().charAt(0)}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {userInfo.firstName && userInfo.lastName
              ? ` ${userInfo.firstName} ${userInfo.lastName}`
              : `${userInfo.email}`}
          </div>
        </div>
        <div className="flex gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={() => navigate("/profile")}>
                <FiEdit2 className={"text-purple-500 font-md text-xl"} />
              </TooltipTrigger>
              <TooltipContent className={"bg-[#1c1b1e] border-none text-white"}>
                <p>Edit Profile</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger onClick={logoutHandler}>
                <IoPowerSharp className={"text-red-500 font-md text-xl"} />
              </TooltipTrigger>
              <TooltipContent className={"bg-[#1c1b1e] border-none text-white"}>
                <p>Log Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
