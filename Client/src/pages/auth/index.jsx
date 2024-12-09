import background from "@/assets/login2.png";
import victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useAppStore();
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const validateLogin = () => {
    if (!email.trim().length) {
      toast.error("Email is required!");
      return false;
    }
    if (!password.trim().length) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.trim().length) {
      toast.error("Email is required!");
      return false;
    }
    if (!password.trim().length) {
      toast.error("Password is required!");
      return false;
    }
    if (!confirmPassword.trim().length) {
      toast.error("Password Confirmation is required!");
      return false;
    }
    if (confirmPassword.trim() !== password.trim()) {
      toast.error("Password Confirmation doesn't match!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
        toast.success("Logged in successfully!");
        console.log(response);
      } catch (error) {
        toast.error("Invalid login details!");
        console.error(error);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
     try {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      setUserInfo(response.data.user);
      if (response.status === 201) {
        navigate("/profile");
      }
      toast.success("Signed up successfully!");
      console.log(response);
     } catch (error) {
      toast.error("Failed to sign up!");
      console.error(error);
     }
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid grid-cols-1 xl:grid-cols-2">
        {/* Form Section */}
        <div className="flex flex-col gap-10 items-center justify-center px-5">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold lg:text-6xl">Welcome</h1>
              <img src={victory} alt="victory emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex w-full items-center justify-center">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="flex justify-center items-center bg-transparent w-full rounded-none">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-black text-opacity-90 border-b-2 rounded-none w-full"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-black text-opacity-90 border-b-2 rounded-none w-full"
                  value="signup"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value.trim())}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="hidden xl:flex items-center justify-center bg-gray-100 rounded-r-3xl">
          <img
            src={background}
            alt="background"
            className="h-[80%] w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
