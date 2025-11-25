import axios from "axios";
import GreenButton from "../../components/GreenButton";
import CommonConstant from "../../constant/CommonConstant";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const { successToast, errorToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(CommonConstant.ResetPassword, {
      email: email,
    });
    if (response.data.success) {
      successToast(response.data.message);
      setEmail("");
      setIsSubmit(true);
    } else {
      errorToast(response.data.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-lg p-8 md:p-10 rounded-3xl border border-[#BBB5B5] w-full max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Reset Password
        </h1>
        <p className="text-base md:text-lg mt-6 text-center">
          Please enter your email address to receive a password reset link.
        </p>
        {isSubmit && (
          <p className="bg-green-100 p-3 text-green-700 font-semibold mt-4 rounded-lg text-center">
            A password reset link has been sent to your email.
            <br />
            Please check your inbox and follow the instructions.
          </p>
        )}
        <form onSubmit={handleSubmit} method="POST" className="mt-6">
          <input
            type="email"
            id="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="py-2 px-3 w-full rounded-xl border border-[#BBB5B5] bg-white focus:outline-blue-500 text-lg"
          />
          <GreenButton label="Submit" extendedClassName="mt-5 w-full" />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
