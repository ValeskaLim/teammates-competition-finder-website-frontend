import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CommonConstant from "../../constant/CommonConstant";
import { useToast } from "../../hooks/useToast";
import { SlMagnifier } from "react-icons/sl";
import { CiFilter } from "react-icons/ci";
import { useAuth } from "../../hooks/AuthProvider";
import Swal from "sweetalert2";
import BlueButton from "../../components/BlueButton";
import GreenButton from "../../components/GreenButton";
import RedButton from "../../components/RedButton";

const FindPage = () => {
  const [inviteesUser, setInviteesUser] = useState([]);
  const [invitesUser, setInvitesUser] = useState([]);
  const [memberLength, setMemberLength] = useState();
  const [isRunFind, setIsRunFind] = useState(false);
  const [isJoinCompetition, setIsJoinCompetition] = useState(false);
  const [maxMember, setMaxMember] = useState(null);
  const [invitationNumber, setInvitationNumber] = useState(null);
  const [skillOptions, setSkillOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [isLeader, setIsLeader] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const { successToast, errorToast } = useToast();

  const invitationNumberLeft =
    (maxMember ?? 0) - ((invitationNumber ?? 0) + (memberLength ?? 0));

  const { users } = useAuth();

  const inviteeIds = inviteesUser.map((invitee) => invitee.invitee_id);
  console.log(invitesUser);

  const usersToShow = selectedSkills.length > 0 ? filteredUsers : allUsers;
  const displayedUsers = (usersToShow || []).filter((user: any) =>
    user.username?.toLowerCase().includes(username.toLowerCase())
  );

  const currentUsers = displayedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedUsers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [username, selectedSkills, displayedUsers.length]);

  useEffect(() => {
    const fetchinviteesUser = async () => {
      const response = await axios.post(CommonConstant.GetInviteesUser);
      try {
        if (response.data.success) {
          const resInviteesUser = response.data.data || [];
          setInviteesUser(resInviteesUser);
        }
      } catch (error: any) {
        console.log(error);
        errorToast(error);
      }
    };

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

    const fetchinvitesUser = async () => {
      const response = await axios.post(CommonConstant.GetInvitesUser);
      try {
        if (response.data.success) {
          const invitesUser = response.data.data || [];
          setInvitesUser(invitesUser);
        }
      } catch (error: any) {
        console.log(error);
        errorToast(error);
      }
    };

    const fetchTeammates = async () => {
      try {
        const response = await axios.post(CommonConstant.TeammatesList, {});
        const member_id = response.data.data.member_id;
        const memberIds = member_id.split(",");
        const member_length = memberIds.length;
        fetchCompetitionData(response.data.data.competition_id);
        setMemberLength(member_length);
        setIsFinalized(response.data.data.is_finalized);
      } catch (error: any) {
        console.log(error);
        errorToast(error);
      }
    };

    const fetchTeamData = async () => {
      try {
        const response = await axios.post(
          CommonConstant.CheckAnyCompetitionsJoined
        );
        setIsJoinCompetition(response.data.data.hasJoined);
      } catch (error: any) {
        console.log(error);
        const errorMessage = error.response.data.message;
        errorToast(errorMessage);
      }
    };

    const fetchCompetitionData = async (id: number) => {
      try {
        const response = await axios.post(CommonConstant.GetCompetitionById, {
          id: id,
        });
        setMaxMember(response.data.data.max_member);
        setIsJoinCompetition(true);
      } catch (error: any) {
        console.log(error);
        const errorMessage = error.response.data.message;
        setIsJoinCompetition(false);
        errorToast(errorMessage);
      }
    };

    const checkInvitationNumber = async () => {
      try {
        const response = await axios.post(
          CommonConstant.CheckNumberInvitations
        );
        if (response.data.success) {
          setInvitationNumber(response.data.data.count);
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage = error.response.data.message;
        errorToast(errorMessage);
      }
    };

    fetchTeammates();
    fetchinviteesUser();
    fetchinvitesUser();
    fetchTeamData();
    checkInvitationNumber();
    fetchSkillsets();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    const checkIsLeader = async () => {
      try {
        const response = await axios.post(CommonConstant.CheckIsLeader);
        if (response.data.success) {
          setIsLeader(response.data.data.isLeader);
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage = error.response.data.message;
        errorToast(errorMessage);
      }
    };
    checkIsLeader();

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedSkills.length > 0) {
      filterUsersBySkills(selectedSkills);
    } else {
      fetchAllUsers();
    }
  }, [selectedSkills]);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.post(CommonConstant.GetAllUsers);
      if (response.data.success) {
        setAllUsers(response.data.data);
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response.data.message;
      errorToast(errorMessage);
    }
  };

  const getFieldLabels = (valueString) => {
    if (!valueString) return [];
    const codes = valueString.split(",");
    return codes
      .map((code) => {
        const match = skillOptions.find((item) => item.value === code.trim());
        return match ? match.label : code;
      })
      .filter(Boolean);
  };

  const handleReset = () => {
    setIsRunFind(false);
    setSelectedSkills([]);
    setFilteredUsers([]);
    setUsername("");
  };

  const removeUser = async (user_id) => {
    try {
      const response = await axios.post(CommonConstant.RemoveUserInvitation, {
        user_id: user_id,
      });
      if (response.data.success) {
        setIsSubmitting(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        errorToast("Error removing user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInviteUser = async (user_id) => {
    try {
      const response = await axios.post(CommonConstant.InviteUser, {
        user_id: user_id,
      });
      if (response.data.success) {
        successToast(response.data.message);
        setIsSubmitting(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        errorToast("Error inviting user");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response.data.message;
      errorToast(errorMessage);
    }
  };

  const handleAcceptInvitation = async (user_id) => {
    try {
      const response = await axios.post(CommonConstant.AcceptInvites, {
        user_id: user_id,
      });
      if (response.data.success) {
        successToast(response.data.messages);
        setIsSubmitting(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectInvitation = async (user_id) => {
    try {
      const response = await axios.post(CommonConstant.RejectInvites, {
        user_id: user_id,
      });
      if (response.data.success) {
        console.log(response.data.messages);
        setIsSubmitting(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterClick = (skillId: number) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const filterUsersBySkills = async (skills: number[]) => {
    try {
      const response = await axios.post(CommonConstant.FilterUsers, {
        skills: skills,
      });
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFilterDropdown = () => {
    setShowFilter((prev) => !prev);
  };

  return (
    <div className="main-container">
      <div className="main-col-container">
        {!isJoinCompetition ? (
          // User has not joined a competition / have no team
          <div className="text-xl md:text-3xl font-semibold flex w-full justify-center text-red-500 text-center p-4">
            Please join / create a team and join competition to access the find
            feature.
          </div>
        ) : (
          // User has joined a competition & have team
          <div className="mt-4 flex flex-col md:flex-row items-center w-full justify-center gap-3 px-3">
            <div className="flex items-center w-full md:w-1/2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Search users by username"
                className="p-3 w-full bg-slate-50 border border-gray-300 h-full rounded-l-lg"
                disabled={
                  memberLength === maxMember ||
                  !isJoinCompetition ||
                  !isLeader ||
                  isFinalized
                }
              />
              <button
                type="button"
                className="h-[45px] cursor-pointer flex gap-2 text-lg items-center text-white bg-blue-500 py-2 px-4 rounded-r-lg font-semibold 
              hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                disabled={
                  memberLength === maxMember ||
                  !isJoinCompetition ||
                  !isLeader ||
                  isFinalized
                }
                onClick={async () => {
                  await fetchAllUsers();
                  setIsRunFind(true);
                }}
              >
                <SlMagnifier className="font-bold" />
              </button>
            </div>
            <div className="relative">
              <button
                ref={buttonRef}
                type="button"
                onClick={toggleFilterDropdown}
                className="w-full md:w-fit h-full bg-white shadow-md cursor-pointer flex text-lg items-center text-blue-500 py-2 px-4 rounded-md font-semibold border-2 border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  memberLength === maxMember ||
                  !isJoinCompetition ||
                  !isLeader ||
                  isFinalized
                }
              >
                <CiFilter className="font-bold text-3xl" />
              </button>
              {showFilter && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 mt-2 p-3 bg-white shadow-md rounded-md w-64 z-50 max-h-60 overflow-y-auto flex flex-wrap gap-2"
                >
                  {skillOptions.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No skills available
                    </div>
                  ) : (
                    skillOptions.map((skill: any) => {
                      const isSelected = selectedSkills.includes(skill.value);
                      return (
                        <button
                          key={skill.value}
                          onClick={() => handleFilterClick(skill.value)}
                          className={`px-3 py-2.5 rounded-3xl text-xs font-bold border-2 duration-300
              ${
                isSelected
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
              }`}
                        >
                          {skill.label}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
            <RedButton
              label="Reset"
              onClick={handleReset}
              className="h-full cursor-pointer text-lg items-center text-white bg-red-500 py-2 px-4 rounded-md font-semibold 
              hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300 w-full md:w-auto"
              disabled={isRunFind == false}
            />
          </div>
        )}

        {/* Results */}
        {isRunFind ? (
          <>
            {/* Run button pressed */}
            <div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
                {currentUsers.map((user: any) => (
                  <li
                    key={user.user_id}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-neutral-100 shadow-lg"
                  >
                    <div>
                      <p className="text-2xl font-semibold break-words">
                        {user.username}
                      </p>
                      <p className="text-lg mb-5 break-words">
                        {user.fullname}
                      </p>
                      <div className="flex gap-3 justify-between text-sm">
                        <div>
                          <p>Semester</p>
                          <p>Portfolio</p>
                        </div>
                        <div className="w-full break-all">
                          <p>: {user.semester}</p>
                          <a
                            href={user.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            :{" "}
                            <span className="text-blue-500 hover:text-blue-700 break-all">
                              {user.portfolio == null
                                ? "-"
                                : user.portfolio.substring(0, 40) + "..."}
                            </span>
                          </a>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        {user.skills.map((skill: any) => (
                          <span
                            key={skill.skill_id}
                            className="text-center bg-blue-100 text-blue-700 px-2 py-2 rounded text-xs font-bold"
                          >
                            {skill.skill_name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="lex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-7">
                      <BlueButton
                        label="Invite"
                        onClick={() => handleInviteUser(user.user_id)}
                        extendedClassName="w-full xl:w-fit mt-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          inviteeIds.includes(user.user_id) ||
                          invitationNumberLeft === 0 ||
                          isSubmitting
                        }
                      />
                      {inviteeIds.includes(user.user_id) && (
                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: "You won't be able to revert this!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Remove",
                            });
                            if (result.isConfirmed) {
                              setIsSubmitting(true);
                              await removeUser(user.user_id);
                              await Swal.fire({
                                title: "Invitation Deleted!",
                                text: `${user.username} has been removed.`,
                                icon: "success",
                              });
                            }
                          }}
                          className="w-full mt-2 xl:w-fit text-sm bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center md:justify-end gap-2 mt-6 px-3">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    {"<<"}
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === idx + 1 ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    {">>"}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Run button not pressed */}
            {/* Invitees Section */}
            <h3 className="mt-5 text-2xl font-semibold px-3">Your invitees:</h3>
            <p className="text-md font-semibold text-red-500 italic px-3">
              **Currently you have{" "}
              <span
                className={
                  invitationNumberLeft === 0 ? "text-red-500" : "text-green-500"
                }
              >
                {invitationNumberLeft === 0 ? "0" : invitationNumberLeft ?? 0}
              </span>{" "}
              invitations left**
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-3">
              {inviteesUser.map((user: any, idx) => (
                <li
                  key={idx}
                  className="flex flex-col border border-[#BBB5B5] p-5 rounded-xl shadow-sm bg-white"
                >
                  <div className="flex justify-between">
                    <div className="w-full mr-5">
                      <h3 className="font-semibold text-xl">
                        {user.invitee.username}
                      </h3>
                      <p className="flex justify-between">
                        <span>Gender:</span>
                        <span className="w-3/5">
                          {user.invitee.gender == "L"
                            ? "Laki-laki"
                            : "Perempuan"}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Email:</span>
                        <span className="w-3/5 break-words">
                          {user.invitee.email}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Semester:</span>
                        <span className="w-3/5">{user.invitee.semester}</span>
                      </p>
                      <p className="mt-2">Field of interest:</p>
                    </div>
                    <div className="flex h-fit p-3 font-semibold opacity-0 2xl:opacity-100 items-center text-red-600 border-2 border-red-600 rounded-md">
                      Pending
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    {user.invitee.skills.map((skill: any) => (
                      <span
                        key={skill.skill_id}
                        className="flex items-center bg-blue-100 text-blue-700 px-2 py-2 rounded text-xs font-bold"
                      >
                        {skill.skill_name}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col mt-auto self-start">
                    <RedButton
                      label="Remove"
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Remove",
                        });
                        if (result.isConfirmed) {
                          await removeUser(user.invitee_id);
                          await Swal.fire({
                            title: "Teammates Deleted!",
                            text: `${user.invitee.username} has been removed.`,
                            icon: "success",
                          });
                        }
                      }}
                      extendedClassName="w-full xl:w-fit mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    />
                  </div>
                </li>
              ))}
            </div>
            <hr className="mt-5" />

            {/* Invites Section */}
            <h3 className="mt-5 text-2xl font-semibold px-3">Your invites:</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-3">
              {invitesUser.map((user: any, idx) => (
                <li
                  key={idx}
                  className="flex flex-col border p-3 rounded-xl shadow-sm bg-white"
                >
                  <div className="flex justify-between">
                    <div className="w-full mr-5">
                      <h3 className="font-semibold text-xl">
                        {user.inviter.username}
                      </h3>
                      <p className="flex justify-between">
                        <span>Gender:</span>
                        <span className="w-3/5">
                          {user.inviter.gender == "L"
                            ? "Laki-laki"
                            : "Perempuan"}
                        </span>
                      </p>
                      <p className="flex justify-between break-words">
                        <span>Email:</span>
                        <span className="w-3/5 break-words">
                          {user.inviter.email}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Semester:</span>
                        <span className="w-3/5">{user.inviter.semester}</span>
                      </p>
                    </div>
                    <div className="opacity-0 2xl:opacity-100 flex h-fit p-3 font-semibold items-center text-red-600 border-2 border-red-600 px-2 py-1 rounded-md">
                      Pending
                    </div>
                  </div>
                  <div className="grid grid-cols-3 mt-5 gap-1">
                    {user.inviter.skills.map((skill: any) => (
                      <span
                        key={skill.skill_id}
                        className="flex items-center bg-blue-100 text-blue-700 px-2 py-2 rounded text-xs font-bold"
                      >
                        {skill.skill_name}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-7">
                    <GreenButton
                      label="Accept"
                      onClick={() =>
                        handleAcceptInvitation(user.invites.user_id)
                      }
                      disabled={isSubmitting}
                      extendedClassName="w-full xl:w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <RedButton
                      label="Reject"
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Reject",
                        });
                        if (result.isConfirmed) {
                          await handleRejectInvitation(user.invites.user_id);
                          await Swal.fire({
                            title: "Invitation Rejected!",
                            text: "Invitation has been rejected.",
                            icon: "success",
                          });
                        }
                      }}
                      disabled={isSubmitting}
                      extendedClassName="w-full xl:w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </li>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FindPage;
