import axios from "axios";
import { useEffect, useState } from "react";
import CommonConstant from "../../constant/CommonConstant";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/AuthProvider";
import BlueButton from "../../components/BlueButton";
import GreenButton from "../../components/GreenButton";
import { ROUTE_PATHS } from "../../router/routePaths";
import { useNavigate } from "react-router-dom";
import BlueLabel from "../../components/BlueLabel";
import RedButton from "../../components/RedButton";

const TeammatesMainPage = () => {
  const [teammates, setTeammates] = useState([]);
  const [teamCompetition, setTeamCompetition] = useState<any | undefined>();
  const [competitionId, setCompetitionId] = useState<number | undefined>(
    undefined
  );
  const [isLeader, setIsLeader] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState<number | undefined>(undefined);
  const [error, setError] = useState(null);
  const [isJoinedTeam, setIsJoinedTeam] = useState(false);
  const [isTeamFinalized, setIsTeamFinalized] = useState(false);
  const [skillOptions, setSkillOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofTransaction, setProofTransaction] = useState<any | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errorToast, successToast, warningToast } = useToast();
  const { users } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.post(CommonConstant.CheckIsHaveTeam);
        const hasTeam = response1.data.success;
        setIsJoinedTeam(response1.data.success);

        if (hasTeam) {
          const response2 = await axios.post(CommonConstant.TeammatesList, {});

          const result_teammates = response2.data.data;
          const member_id = result_teammates.member_id;
          const memberIds = member_id.split(",").map((id) => id.trim());
          setIsTeamFinalized(response2.data.data.is_finalized);
          setCompetitionId(result_teammates.competition_id);

          const userPromises = memberIds.map(async (id) => {
            const response = await axios.post(CommonConstant.GetUserById, {
              user_id: id,
            });
            return response.data.data;
          });

          const users: any = await Promise.all(userPromises);
          setTeammates(users);

          const response3 = await axios.post(CommonConstant.CheckIsLeader);
          setIsLeader(response3.data.data.isLeader);

          try {
            const response = await axios.post(
              CommonConstant.GetCompetitionById,
              { id: result_teammates.competition_id }
            );
            if (response.data.success) {
              const team_competition_result = response.data.data;
              setTeamCompetition(team_competition_result);
            }
          } catch (error: any) {
            console.log(error);
            const errorMessage =
              error.response?.data?.message || "Failed to fetch competition";
            // errorToast(errorMessage);
          }

          // Set the team name for editing
          setTeamName(result_teammates.team_name);

          // Set the team ID for editing
          setTeamId(result_teammates.team_id);
          setDescription(result_teammates.description || null);
          setNotes(result_teammates.notes || null);

          await fetchListPendingRequest(result_teammates.team_id);
          await fetchProofTransactions(result_teammates.team_id);
        }
      } catch (error) {
        console.log(error);
      }
    };

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

    const fetchListPendingRequest = async (id: number) => {
      try {
        const response = await axios.post(CommonConstant.GetAllPendingRequest, {
          team_id: id,
        });
        if (response.data.success) {
          const pendingRequests = response.data.data || [];
          setPendingRequests(pendingRequests);
        } else {
          const errorMessage = response.data.message;
          errorToast(errorMessage);
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage = error?.response?.data?.message;
        errorToast(errorMessage);
      }
    };

    const fetchProofTransactions = async (teamId: number) => {
      try {
        const response = await axios.post(CommonConstant.GetProofTransaction, {
          team_id: teamId,
        });
        if (response.data.success) {
          setProofTransaction(response.data.data || null);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    if (users) {
      fetchData();
      fetchSkillsets();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(CommonConstant.CreateTeam, {
        team_name: teamName,
        leader_id: users?.user_id,
      });

      if (response.data.success) {
        console.log(response.data.message);
        successToast(response.data.message);
        setIsSubmitting(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        console.log(error);
        errorToast(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      errorToast(errorMessage);
    }
  };

  const handleFinalizeTeam = async () => {
    try {
      const response = await axios.post(CommonConstant.FinalizeTeam, {
        team_id: teamId,
      });
      if (response.data.success) {
        successToast(response.data.message);
        setIsTeamFinalized(true);
      } else {
        errorToast(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      errorToast(errorMessage);
    }
  };

  const viewCompetitionDetail = (
    competitionData: any,
    competition_id: number
  ) => {
    navigate(`${ROUTE_PATHS.COMPETITION}/${competition_id}`, {
      state: { competition: competitionData },
    });
  };

  const handleAcceptRequest = async (user_id: number, team_id: number) => {
    try {
      const response = await axios.post(CommonConstant.AcceptJoinRequest, {
        user_id,
        team_id,
      });
      if (response.data.success) {
        successToast(response.data.message);
        setIsSubmitting(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        errorToast(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      errorToast(errorMessage);
    }
  };

  const handleDeclineRequest = async (user_id: number, team_id: number) => {
    try {
      const response = await axios.post(CommonConstant.RejectJoinRequest, {
        user_id,
        team_id,
      });
      if (response.data.success) {
        successToast(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        errorToast(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      errorToast(errorMessage);
    }
  };

  const handleEditTeam = async (id: number) => {
    try {
      const response = await axios.post(CommonConstant.EditTeam, {
        team_id: id,
        notes: notes || "",
        description: description || "",
      });
      if (response.data.success) {
        successToast(response.data.message);
      } else {
        errorToast(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      errorToast(errorMessage);
    }
  };

  const handleFinalizeWithImage = async () => {
    if (!proofImage)
      return warningToast("Please upload transaction proof first!");

    const formData = new FormData();
    formData.append("team_id", String(teamId));
    formData.append("proof_image", proofImage);

    try {
      const response = await axios.post(CommonConstant.FinalizeTeam, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        successToast(response.data.message);
        setIsTeamFinalized(true);
        setShowFinalizeModal(false);
        setIsSubmitting(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        errorToast(response.data.message);
      }
    } catch (error: any) {
      errorToast(error.response?.data?.message || "Failed to finalize");
    }
  };

  const handleTextClick = async (filename: string) => {
    try {
      setIsTextLoading(true);
      const response = await axios.get(
        `${CommonConstant.FinalizationFileSource}/${filename}`,
        { responseType: "text" }
      );
      setSelectedText(response.data);
    } catch (error: any) {
      console.error(error);
      errorToast("Failed to load transaction details file");
    } finally {
      setIsTextLoading(false);
    }
  };
  console.log("competitionId:", competitionId);
  const handleShowFinalizeModal = () => {
    if(competitionId === undefined || competitionId === null) {
      warningToast("Join competition first before finalize the team!");
      return;
    }
    setShowFinalizeModal(true);
  }

  return (
    <div className="main-container px-4 md:px-8">
      <div className="main-col-container">
        <div className="w-full mb-16">
          {isJoinedTeam ? (
            <>
              <div className="flex flex-col md:flex-row justify-between gap-5">
                <div>
                  <h2 className="text-2xl md:text-3xl">
                    Team Name: <span className="font-semibold">{teamName}</span>
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {isTeamFinalized ? (
                    <>
                      <BlueButton
                        label="View Proof Image"
                        onClick={() =>
                          setSelectedImage(
                            `${CommonConstant.ImageProofSource}/${proofTransaction.proof_image_path}`
                          )
                        }
                      />
                      <BlueButton
                        label="View Transaction Details"
                        onClick={() =>
                          handleTextClick(proofTransaction.txn_hash_path)
                        }
                      />
                      <GreenButton
                        label="Team Finalized!"
                        extendedClassName="disabled:hover:bg-green-500"
                        disabled
                      />
                    </>
                  ) : (
                    <BlueButton
                      label="Finalize Team"
                      onClick={() => handleShowFinalizeModal()}
                      extendedClassName="disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-not-allowed"
                      disabled={!isLeader}
                    />
                  )}
                </div>
              </div>
              <hr className="mt-8 text-gray-300" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                <ul className="list-none space-y-4 w-full">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                    Team Members
                  </h3>
                  {teammates.map((user: any) => (
                    <li key={user.user_id} className="card-container">
                      <div>
                        <strong>{user.username}</strong> ({user.fullname})
                        {user.user_id === users?.user_id && (
                          <span className="text-blue-500"> (You)</span>
                        )}
                        <p>{user.email}</p>
                        <p>Semester: {user.semester}</p>
                        <a
                          href={user.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 break-all"
                        >
                          {user.portfolio == null
                            ? "-"
                            : user.portfolio.substring(0, 50)}
                        </a>
                        <div className="mt-5 flex flex-wrap gap-2 w-full">
                          {getFieldLabels(user.field_of_preference).map(
                            (label, idx) => (
                              <BlueLabel text={label} key={idx} />
                            )
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <ul className="w-full space-y-10">
                  {/* Competition Card */}
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                    Joined Competition
                  </h3>
                  <li className="card-container">
                    {teamCompetition ? (
                      <>
                        <div className="w-full h-full">
                          <img
                            src={`${CommonConstant.ImageSource}${teamCompetition.poster}`}
                            alt={teamCompetition.title}
                            className="w-full max-h-[300px] sm:max-h-[350px] object-cover rounded-t-2xl"
                          />
                        </div>
                        <p className="font-semibold text-2xl sm:text-3xl mt-5">
                          {teamCompetition.title}
                        </p>
                        <div className="flex justify-between text-sm sm:text-base mt-2">
                          <div className="w-1/2">
                            <p>Date</p>
                            <p>Min Member</p>
                            <p>Max Member</p>
                            <p>Status</p>
                          </div>
                          <div className="w-3/4">
                            <p>
                              :{" "}
                              {new Date(
                                teamCompetition.date
                              ).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            <p>: {teamCompetition.min_member}</p>
                            <p>: {teamCompetition.max_member}</p>
                            <p
                              className={`${
                                teamCompetition.status == "INA"
                                  ? "text-red-500"
                                  : "text-green-500"
                              } font-semibold`}
                            >
                              <span className="text-black">: </span>
                              {teamCompetition.status == "INA"
                                ? "Inactive"
                                : "Active"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5">
                          <BlueButton
                            label="View details"
                            onClick={() =>
                              viewCompetitionDetail(
                                teamCompetition,
                                teamCompetition.id
                              )
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <p>No competition found</p>
                    )}
                  </li>

                  {/* Description */}
                  <div className="card-container">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                      Description
                    </h3>
                    <textarea
                      name="description"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-md mt-3 p-2 border border-[#e6e6e6] rounded-lg w-full h-[150px]"
                      disabled={!isLeader}
                    />
                  </div>

                  {/* Notes */}
                  <div className="card-container">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                      Notes for candidates
                    </h3>
                    <textarea
                      name="notes"
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="text-md mt-3 p-2 border border-[#e6e6e6] rounded-lg w-full h-[150px]"
                      disabled={!isLeader}
                    />
                  </div>

                  {/* Save Button */}
                  {isLeader && (
                    <div className="flex justify-end">
                      <GreenButton
                        label="Save Changes"
                        extendedClassName="mt-3"
                        onClick={() => {
                          if (typeof teamId === "number")
                            handleEditTeam(teamId);
                          else errorToast("Team ID is not available.");
                        }}
                      />
                    </div>
                  )}
                </ul>
              </div>
            </>
          ) : (
            // Create Team No Team
            <form onSubmit={handleSubmit} className="w-full md:w-1/2">
              <h3 className="text-xl">
                You don't have a team yet, want to create one?
              </h3>
              <div className="flex flex-col bg-[#f0efef] shadow-md p-4 mt-5 rounded-lg gap-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                  <p>Team Name:</p>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full sm:w-3/4 text-md p-2 border border-[#e6e6e6] bg-white rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="cursor-pointer flex gap-2 group text-md items-center w-fit text-white bg-blue-500 border-2 py-2 px-4 rounded-md hover:bg-blue-600 duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && isLeader && (
          <>
            <hr className="text-gray-300" />
            <div className="mt-10">
              <h3 className="text-2xl sm:text-3xl">Pending Requests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {pendingRequests.map((request: any) => (
                  <div key={request.user_id} className="card-container">
                    <p className="font-semibold text-xl sm:text-2xl">
                      {request.fullname}
                    </p>
                    <p>{request.email}</p>
                    <p>Semester: {request.semester}</p>
                    <a
                      href={request.portfolio}
                      className="text-blue-500 break-all hover:underline hover:text-blue-600"
                    >
                      {request.portfolio}
                    </a>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {getFieldLabels(request.field_of_preference).map(
                        (label, idx) => (
                          <BlueLabel text={label} key={idx} />
                        )
                      )}
                    </div>

                    <div className="flex gap-3 mt-5">
                      <GreenButton
                        label="Accept"
                        onClick={() =>
                          handleAcceptRequest(request.user_id, teamId)
                        }
                        disabled={isSubmitting}
                        extendedClassName="disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <RedButton
                        label="Decline"
                        onClick={() =>
                          handleDeclineRequest(request.user_id, teamId)
                        }
                        disabled={isSubmitting}
                        extendedClassName="disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-1 font-bold shadow-md hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Text Modal */}
      {selectedText && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={() => setSelectedText(null)}
        >
          <div
            className="relative bg-white text-black rounded-lg p-6 max-w-full sm:max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {isTextLoading ? (
              <p className="text-center">Loading details...</p>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {selectedText}
              </pre>
            )}
            <button
              onClick={() => setSelectedText(null)}
              className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 font-bold shadow-md hover:bg-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Finalize Modal */}
      {showFinalizeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl text-center font-bold mb-2">
              Finalize Team
            </h2>
            <h3 className="text-md text-center text-red-500 font-bold mb-6">
              By Finalizing, you cannot invite more members & other user cannot
              join your team
            </h3>
            <p className="text-gray-600 mb-2 font-bold">
              Leader:{" "}
              <span className="text-gray-600 mb-2 font-normal">
                {users?.fullname}
              </span>{" "}
            </p>
            <p className="text-gray-600 mb-2 font-bold">Members:</p>
            <ul className="list-disc ml-5 mb-4">
              {teammates.map((m: any) => (
                <li key={m.user_id}>{m.fullname}</li>
              ))}
            </ul>
            <label className="block font-bold mt-7">
              Upload Proof of Transaction
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProofImage(e.target.files?.[0] || null)}
              className="mb-4 border border-gray-200 rounded-lg mt-2 p-3 w-full"
            />
            <div className="flex gap-4">
              <RedButton
                label="Cancel"
                onClick={() => setShowFinalizeModal(false)}
              />
              <GreenButton
                label="Confirm Finalize"
                onClick={handleFinalizeWithImage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeammatesMainPage;
