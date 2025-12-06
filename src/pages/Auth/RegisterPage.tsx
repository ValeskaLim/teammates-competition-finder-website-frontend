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
  const [fieldOfPreference, setFieldOfPreference] = useState<number[]>([]);
  const [skillOptions, setSkillOptions] = useState<
    { label: string; value: number }[]
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
            value: item.skill_id,
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
    <div className="w-full min-h-screen flex justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white border border-gray-300 p-6 sm:p-8 rounded-2xl shadow-sm">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center">
          Register
        </h2>
        <form onSubmit={handleSubmit} method="POST">
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-1">
              <label className="text-lg">Full Name</label>
              <input
                type="text"
                id="fullname"
                placeholder="Your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-blue-400"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-lg">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-blue-400"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-lg">Email</label>
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 lowercase border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-blue-400"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-lg">Password</label>
              <div className="border border-gray-300 rounded-lg flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password must be > 3 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 w-full text-gray-900 placeholder-gray-400 focus:outline-none"
                  required
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
            <div className="flex flex-col gap-1">
              <label className="text-lg">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-blue-400"
                required
              >
                <option value="" hidden>
                  --Select One--
                </option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-lg">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-blue-400"
                required
              >
                <option value="" hidden>
                  --Select One--
                </option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-lg">Field of Preference</label>
              <Select
                isMulti
                options={skillOptions}
                onChange={(selectedOptions) =>
                  setFieldOfPreference(
                    (selectedOptions as OptionType[]).map((opt) => opt.value)
                  )
                }
                className="w-full"
                classNamePrefix="select"
                closeMenuOnSelect={false}
              />
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="w-2/3 sm:w-1/2 bg-blue-500 text-white p-3 rounded-xl font-semibold hover:bg-blue-600 duration-300"
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
