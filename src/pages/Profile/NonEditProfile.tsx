import Select from "react-select";
import BlueButton from "../../components/BlueButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../hooks/useToast";
import CommonConstant from "../../constant/CommonConstant";

const NonEditProfile = ({ users, setIsEdit }) => {
  const [skillOptions, setSkillOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { errorToast } = useToast();
  const selectedValues = users?.skills?.map((s: any) => s.skill_id) || [];

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
  }, [users]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-5 sm:p-8 lg:p-10">
      <h1 className="font-bold text-3xl sm:text-4xl">
        {users?.fullname}'s <span className="font-normal">Profile</span>
      </h1>
      <div className="w-full">
        <form className="mt-8 sm:mt-10">
          <div className="flex flex-col">
            <h3 className="required text-lg">Username</h3>
            <input
              type="text"
              disabled
              value={users?.username}
              className="text-md mt-3 bg-[#f2f2f2] p-3 border border-[#e6e6e6] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col mt-5">
            <h3 className="text-lg">Password</h3>
            <div className="w-full mt-3">
              <BlueButton
                label="Change"
                disabled
                extendedClassName="disabled:opacity-50 disabled:hover:cursor-not-allowed disabled:hover:bg-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col mt-5">
            <h3 className="required text-lg">Email</h3>
            <input
              type="email"
              disabled
              value={users?.email}
              className="text-md mt-3 bg-[#f2f2f2] p-3 border border-[#e6e6e6] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col mt-5">
            <h3 className="text-lg">Gender</h3>
            <input
              type="text"
              disabled
              value={users?.gender === "L" ? "Laki-Laki" : "Perempuan"}
              className="text-md mt-3 bg-[#f2f2f2] p-3 border border-[#e6e6e6] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col mt-5">
            <h3 className="text-lg">Semester</h3>
            <input
              type="number"
              disabled
              value={users?.semester}
              className="text-md mt-3 bg-[#f2f2f2] p-3 border border-[#e6e6e6] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col mt-5">
            <h3 className="required text-lg">Major</h3>
            <input
              type="text"
              disabled
              value={users?.major}
              className="text-md mt-3 bg-[#f2f2f2] p-3 border border-[#e6e6e6] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col mt-5">
            <h3 className="required text-lg">Field of Preference</h3>
            <Select
              isMulti
              name="field_of_preference"
              options={skillOptions}
              value={skillOptions.filter((option) =>
                selectedValues.includes(option.value)
              )}
              className="basic-multi-select w-full mt-3"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              required
              isDisabled
            />
          </div>
          <div className="flex flex-col mt-5">
            <h3 className="text-lg">Portfolio Link</h3>
            <input
              type="text"
              disabled
              value={users?.portfolio}
              className="text-md mt-3 bg-[#f2f2f2] p-3 border border-[#e6e6e6] rounded-lg w-full"
            />
          </div>
          <BlueButton
            label="Edit Profile"
            onClick={() => setIsEdit(true)}
            extendedClassName="mt-7 w-full sm:w-1/4 md:w-1/6 mx-auto"
          />
        </form>
      </div>
    </div>
  );
};

export default NonEditProfile;
