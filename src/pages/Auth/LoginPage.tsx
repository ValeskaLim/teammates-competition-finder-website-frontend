import { useState } from "react";
import { ROUTE_PATHS } from "../../router/routePaths";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { useToast } from "../../hooks/useToast";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { errorToast, successToast } = useToast();

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email.toLowerCase(), password);
      navigate(ROUTE_PATHS.HOME);
      successToast("Success logged in!");
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      errorToast(errorMessage);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col h-fit w-150 border border-[#BBB5B5] bg-white  p-5 rounded-2xl justify-center">
        <h2 className="text-4xl text-center">Login</h2>
        <form onSubmit={handleSubmit} method="POST">
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-lg">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lowercase p-2 w-full border border-[#BBB5B5] rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline"
            ></input>
            <label className="text-lg">Password</label>
            <div className="border flex border-[#BBB5B5] rounded-lg w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 w-full focus:outline-none text-gray-900 placeholder:text-gray-400"
              ></input>
              {showPassword ? (
                <div
                  className="flex flex-col justify-center mr-2"
                  onClick={() => setShowPassword(false)}
                >
                  <IoMdEyeOff className="flex items-center text-xl" />
                </div>
              ) : (
                <div
                  className="flex flex-col justify-center mr-2"
                  onClick={() => setShowPassword(true)}
                >
                  <IoMdEye className="flex items-center text-xl" />
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <a
                href={ROUTE_PATHS.REGISTER}
                className="text-blue-400 duration-300 hover:duration:300 hover:text-blue-500 hover:underline"
              >
                Don't have account? Register here
              </a>
              <a
                href={ROUTE_PATHS.RESET_PASSWORD}
                className="text-blue-400 duration-300 hover:duration:300 hover:text-blue-500 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 font-semibold cursor-pointer bg-blue-500 text-white mt-12 p-2 rounded-xl duration-300 hover:bg-blue-600 hover:duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
