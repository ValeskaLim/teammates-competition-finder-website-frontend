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
    <div className="w-full min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md border border-gray-300 bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} method="POST">
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-1">
              <label className="text-lg">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="lowercase p-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-lg">Password</label>
              <div className="border border-gray-300 rounded-lg flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 w-full focus:outline-none text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-xl text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm sm:text-base mt-2">
              <a
                href={ROUTE_PATHS.REGISTER}
                className="text-blue-500 hover:text-blue-600 hover:underline"
              >
                Don't have an account? Register
              </a>
              <a
                href={ROUTE_PATHS.RESET_PASSWORD}
                className="text-blue-500 hover:text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="w-2/3 sm:w-1/2 font-semibold cursor-pointer bg-blue-500 text-white p-3 rounded-xl duration-300 hover:bg-blue-600"
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
