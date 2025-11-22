import axios from "axios";
import { useEffect, useState } from "react";
import { ROUTE_PATHS } from "../../router/routePaths";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import CommonConstant from "../../constant/CommonConstant";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Select from "react-select";

type OptionType = {
  label: string;
  value: string;
};

function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [semester, setSemester] = useState("");
  const [fieldOfPreference, setFieldOfPreference] = useState<string[]>([]);
  const [skillOptions, setSkillOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const { successToast, warningToast, errorToast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkillsets = async () => {
      try {
        const response = await axios.post(CommonConstant.GetAllSkillsets);
        if (response.data.success) {
          const skillsets = response.data.data || [];

          const options = skillsets.map((item: any) => ({
            label: item.skill_name,
            value: item.skill_code,
          }));

          setSkillOptions(options);
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message || "Failed to fetch skillsets";
        errorToast(errorMessage);
      }
    };
    fetchSkillsets();
  }, []);

  const handleSubmit = async (e) => {
    const lowerEmail = email.toLowerCase();
    const cleanFieldOfPreference = fieldOfPreference.join(",");
    console.log(cleanFieldOfPreference);
    e.preventDefault();
    try {
      if (await isFormValid()) {
        const response = await axios.post(CommonConstant.SubmitRegister, {
          fullname,
          username,
          email: lowerEmail,
          password,
          gender,
          semester,
          field_of_preference: cleanFieldOfPreference,
        });
        console.log(response.data);
        successToast(response.data.message);
        navigate(ROUTE_PATHS.LOGIN);
      }
    } catch (error) {
      console.log(error);
      errorToast("Register Failed");
    }
  };

  const isFormValid = async (): Promise<boolean> => {
    if (password.length < 4) {
      warningToast("Password must be at least 4 character");
      return false;
    }

    if (username.trim() === "") {
      warningToast("Username cannot be empty or spaces only");
      return false;
    }

    if (/\s/.test(username)) {
      warningToast("Username cannot contain spaces");
      return false;
    }

    const response = await axios.post(CommonConstant.GetExistingUser, {
      username,
      email,
    });

    if (response.data.usernameExist) {
      warningToast("Username already exist, please choose another one");
      return false;
    } else if (response.data.emailExist) {
      warningToast("Email already exist, please choose another one");
      return false;
    }

    return true;
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col h-fit w-150 border border-[#BBB5B5] bg-white p-5 rounded-2xl justify-center">
        <h2 className="text-4xl text-center">Register</h2>
        <form onSubmit={handleSubmit} method="POST">
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-lg">Full Name</label>
            <input
              type="text"
              id="fullname"
              placeholder="Your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="p-2 w-full border border-[#BBB5B5] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline"
              required
            ></input>
            <label className="text-lg">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 w-full border border-[#BBB5B5] rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline"
              required
            ></input>
            <label className="text-lg">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Your email (example@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lowercase p-2 w-full border border-[#BBB5B5] rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline"
              required
            ></input>
            <label className="text-lg">Password</label>
            <div className="flex item-center w-full border border-[#BBB5B5] rounded-lg">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password length must be more than 3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 w-full focus:outline-hidden text-gray-900 placeholder:text-gray-400 focus:outline"
                required
              ></input>
              {showPassword ? (
                <div className="flex flex-col justify-center mr-2" onClick={() => setShowPassword(false)}>
                  <IoMdEyeOff className="flex items-center text-xl" />
                </div>
              ) : (
                <div className="flex flex-col justify-center mr-2" onClick={() => setShowPassword(true)}>
                  <IoMdEye className="flex items-center text-xl" />
                </div>
              )}
            </div>
            <label className="text-lg">Gender</label>
            <select
              name="gender"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="p-2 border border-[#BBB5B5] rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline"
              required
            >
              <option value="" hidden>
                --Select One--
              </option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <label className="text-lg">Semester</label>
            <select
              name="semester"
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="p-2 w- border border-[#BBB5B5] rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline"
              required
            >
              <option value="" hidden>
                --Select One--
              </option>
              {Array.from({ length: 8 }, (_, i) => (
                <option value={i + 1} key={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <label className="text-lg">Field of preference</label>
            <Select
              isMulti
              name="field_of_preference"
              options={skillOptions}
              className="basic-multi-select w-full"
              classNamePrefix="select"
              // value={fieldOfPreference}
              onChange={(selectedOptions) =>
                setFieldOfPreference(
                  (selectedOptions as OptionType[]).map((opt) => opt.value)
                )
              }
              closeMenuOnSelect={false}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 cursor-pointer text-white mt-12 p-2 rounded-md duration-300 hover:bg-blue-600 hover:duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
