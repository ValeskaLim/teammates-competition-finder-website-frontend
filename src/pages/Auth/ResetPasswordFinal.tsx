import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommonConstant from "../../constant/CommonConstant";
import axios from "axios";
import { useToast } from "../../hooks/useToast";
import GreenButton from "../../components/GreenButton";
import { ROUTE_PATHS } from "../../router/routePaths";

const ResetPasswordFinal = () => {
  const { token } = useParams();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { successToast, errorToast, warningToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(CommonConstant.ValidateToken, {
          token: token,
        });
        if (response.data.success) {
          setIsTokenValid(true);
        }
      } catch (error: any) {
        console.log(error);
        setIsTokenValid(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      warningToast("Confirm password does not match");
      return;
    }

    if (password == "" || confirmPassword == "") {
      warningToast("Password fields cannot be empty");
      return;
    }

    try {
      const response = await axios.post(CommonConstant.ResetPasswordFinal, {
        token: token,
        new_password: password,
      });

      if (response.data.success) {
        successToast("Password reset successful!");
        setIsSubmitting(true);
        setTimeout(() => {
          navigate(ROUTE_PATHS.LOGIN, { replace: true });
        }, 3000);
      } else {
        errorToast("Password reset failed.");
      }
    } catch (error: any) {
      console.log(error);
      errorToast("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-4 py-10">
      <div className="border border-[#BBB5B5] bg-white shadow-lg p-8 md:p-10 rounded-3xl w-full max-w-md">
        {isTokenValid ? (
          <form onSubmit={handleSubmit} method="POST" className="flex flex-col">
            <input
              type="password"
              id="password"
              placeholder="Your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-5 py-2 px-3 w-full rounded-xl border border-[#BBB5B5] bg-white focus:outline-blue-500 text-lg"
            />
            <input
              type="password"
              id="confirmpassword"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-5 py-2 px-3 w-full rounded-xl border border-[#BBB5B5] bg-white focus:outline-blue-500 text-lg"
            />
            <GreenButton
              label="Submit"
              extendedClassName="mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            />
          </form>
        ) : (
          <p className="bg-red-100 p-3 text-red-700 font-semibold rounded-lg text-center">
            The password reset link is invalid or has expired. Please request a
            new password reset link.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordFinal;
