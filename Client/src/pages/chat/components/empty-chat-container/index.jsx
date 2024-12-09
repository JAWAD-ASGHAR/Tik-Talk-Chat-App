import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-1000 transition-all hidden">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="text-white text-opacity-80 mt-10 flex flex-col text-center gap-5 lg:text-4xl text-3xl transition-all duration-300 items-center">
        <h3 className="poppins-medium">
          Hi <span className="text-purple-500">!</span> Welcome to <span className="text-purple-500 ">Tik Talk</span> Chat App<span className="text-purple-500">!</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
