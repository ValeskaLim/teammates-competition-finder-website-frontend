import axios from "axios";
import { useEffect, useState } from "react";
import CommonConstant from "../../constant/CommonConstant";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../router/routePaths";

const VerifyPage = () => {
  const { token } = useParams();
  const { successToast, errorToast } = useToast();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(CommonConstant.VerifyUserEmail, {
          token: token,
        });
        console.log(response.data);
        successToast(response.data.message);
        setSuccessMsg(response.data.message);
        setTimeout(() => {
          navigate(ROUTE_PATHS.LOGIN, { replace: true });
        }, 3000);
      } catch (error: any) {
        console.log(error);
        const errorMessage =
          error.response?.data?.message || "Email verification failed";
        setErrorMsg(errorMessage);
        if (
          errorMessage === "Invalid token" ||
          errorMessage === "Token expired and has been invalidated"
        ) {
          errorToast(errorMessage);
        }
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <>
      {errorMsg === "Invalid token" && (
        <div className="w-full min-h-screen flex justify-center items-center flex-col">
          <h1 className="text-2xl font-bold">{errorMsg}</h1>
          <p className="text-lg mt-4">
            Token is invalid. Please check your verification link that we sent
            to your email.
          </p>
        </div>
      )}
      {errorMsg === "Token expired and has been invalidated" && (
        <div className="w-full min-h-screen flex justify-center items-center flex-col">
          <h1 className="text-2xl font-bold">Token expired</h1>
          <p className="text-lg mt-4">
            Token has expired. Please register again to receive a new verification link.
          </p>
        </div>
      )}
      {errorMsg === "" && (
        <div className="w-full min-h-screen flex justify-center items-center flex-col">
          <h1 className="text-2xl font-bold">{successMsg}</h1>
          <p className="text-lg mt-4">
            You can now close this tab. We will redirect you to the login page
            shortly.
          </p>
        </div>
      )}
    </>
  );
};

export default VerifyPage;
