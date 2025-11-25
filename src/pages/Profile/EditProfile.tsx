import axios from "axios";
import Select from "react-select";
import CommonConstant from "../../constant/CommonConstant";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import RedButton from "../../components/RedButton";
import GreenButton from "../../components/GreenButton";
import BlueButton from "../../components/BlueButton";

type OptionType = {
  label: string;
  value: string;
};

const EditProfile = ({ users, setIsEdit }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [semester, setSemester] = useState("");
  const [major, setMajor] = useState("");
  const [fieldOfPreference, setFieldOfPreference] = useState<string[]>([]);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [skillOptions, setSkillOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isChangePwMode, setIsChangePwMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { successToast, warningToast, errorToast } = useToast();

  const handleSubmit = async (e) => {
    const lowerEmail = email.toLowerCase();
    const cleanFieldOfPreference = fieldOfPreference.join(",");
    e.preventDefault();
    try {
      if (await isFormValid()) {
        const response = await axios.post(CommonConstant.EditUser, {
          user_id: users?.user_id,
          username,
          email: lowerEmail,
          gender,
          semester,
          major,
          field_of_preference: cleanFieldOfPreference,
          portfolio: portfolioLink,
        });
        console.log(response.data);
        successToast(response.data.message);
        setIsSubmitting(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error: any) {
      console.log(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        warningToast(error.response.data.message);
      } else {
        errorToast("Edit data failed");
      }
    }
  };

  const isFormValid = async (): Promise<boolean> => {
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

    return true;
  };

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

    if (users) {
      setUsername(users.username || "");
      setEmail(users.email || "");
      setGender(users.gender || "");
      setSemester(users.semester || "");
      setMajor(users.major || "");
      setFieldOfPreference(
        users.field_of_preference ? users.field_of_preference.split(",") : []
      );
      setPortfolioLink(users.portfolio || null);
    }
    fetchSkillsets();
  }, [users]);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      oldPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmNewPassword.trim() === ""
    ) {
      warningToast("All fields are required");
      return;
    }

    if (newPassword.length < 4) {
      warningToast("Password must be at least 4 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      warningToast("Password confirmation does not match");
      return;
    }

    try {
      const response = await axios.post(CommonConstant.ChangePassword, {
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.data.success) {
        successToast(response.data.message);
        setIsChangePwMode(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Change password failed";
      errorToast(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-5 sm:p-8 lg:p-10">
      <h1 className="font-bold text-3xl sm:text-4xl">
        {users?.fullname}'s <span className="font-normal">Profile</span>
      </h1>
      <div className="w-full">
        {!isChangePwMode ? (
          <form className="mt-8 sm:mt-10" onSubmit={handleSubmit} method="POST">
            <div className="flex flex-col">
              <h3 className="required text-lg">Username</h3>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-md mt-3 p-3 border border-[#e6e6e6] rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="text-lg">Password</h3>
              <div>
                <BlueButton
                  label="Change"
                  onClick={() => setIsChangePwMode(true)}
                  extendedClassName="mt-3 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="required text-lg">Email</h3>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-md mt-3 p-3 border border-[#e6e6e6] rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="text-lg">Gender</h3>
              <select
                name="gender"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="text-md mt-3 p-3 border border-[#e6e6e6] rounded-lg w-full"
              >
                <option value="" hidden>
                  --Select one--
                </option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="text-lg">Semester</h3>
              <select
                name="semester"
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="text-md mt-3 p-3 border border-[#e6e6e6] rounded-lg w-full"
              >
                <option value="" hidden>
                  --Select one--
                </option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option value={i + 1} key={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="required text-lg">Major</h3>
              <input
                name="major"
                id="major"
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                disabled
                className="text-md mt-3 p-3 bg-[#f2f2f2] border border-[#e6e6e6] rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="required text-lg">Field of Preference</h3>
              <Select
                isMulti
                name="field_of_preference"
                options={skillOptions}
                value={skillOptions.filter((option) =>
                  fieldOfPreference.includes(option.value)
                )}
                className="basic-multi-select w-full mt-3"
                classNamePrefix="select"
                closeMenuOnSelect={false}
                onChange={(selectedOptions) =>
                  setFieldOfPreference(
                    (selectedOptions as OptionType[]).map((opt) => opt.value)
                  )
                }
              />
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="text-lg">Portfolio Link</h3>
              <input
                type="text"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                className="text-md mt-3 p-3 border border-[#e6e6e6] rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-7">
              <GreenButton
                label="Save Changes"
                type="submit"
                extendedClassName="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              />
              <RedButton
                label="Cancel"
                onClick={() => setIsEdit(false)}
                extendedClassName="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              />
            </div>
          </form>
        ) : (
          <form
            className="mt-8 sm:mt-10"
            onSubmit={handleChangePasswordSubmit}
            method="POST"
          >
            <div className="flex flex-col">
              <h3 className="text-lg">Old Password</h3>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="text-md mt-3 p-3 border border-[#e6e6e6] rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="text-lg">New Password</h3>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-md mt-3 p-3 border border-[#e6e6e6] rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col mt-5">
              <h3 className="text-lg">Confirm Password</h3>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="text-md mt-3 p-3 border border-[#e6e6e6] rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-7">
              <GreenButton
                label="Save Changes"
                type="submit"
                extendedClassName="w-full sm:w-auto"
              />
              <RedButton
                label="Cancel"
                onClick={() => setIsChangePwMode(false)}
                extendedClassName="w-full sm:w-auto"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
