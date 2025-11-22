import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { ROUTE_PATHS } from "../../router/routePaths";
import axios from "axios";
import CommonConstant from "../../constant/CommonConstant";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import { HiOutlinePlusCircle } from "react-icons/hi";
import Swal from "sweetalert2";
import RedButton from "../../components/RedButton";
import BlueButton from "../../components/BlueButton";

const STATUS_LIST = [
  { label: "Active", value: "ACT" },
  { label: "Inactive", value: "INA" },
];

const MainPage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistedTeam, setWishlistedTeam] = useState(undefined);
  const [isLeader, setIsLeader] = useState(false);
  const [teamData, setTeamData] = useState(undefined);
  const [isAlreadyJoinedCompetition, setIsAlreadyJoinedCompetition] =
    useState(false);
  const { users } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompetitions = competitions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(competitions.length / itemsPerPage);

  const { errorToast, successToast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [competitions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(CommonConstant.GetAllCompetition);
        setCompetitions(res.data.data);
      } catch (error: any) {
        console.error(error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred";
        errorToast(errorMessage);
      }
    };

    const fetchTeamData = async () => {
      try {
        const response = await axios.post(CommonConstant.TeammatesList);
        if (response.data.success) {
          setTeamData(response.data.data.competition_id);
          if (response.data.data.competition_id !== null) {
            setIsWishlisted(true);
            setWishlistedTeam(response.data.data.competition_id);
          }
        }
      } catch (error: any) {
        console.error(error);
        errorToast(error);
      }
    };

    const fetchIsLeader = async () => {
      try {
        const response = await axios.post(CommonConstant.CheckIsLeader);
        if (response.data.data.isLeader) {
          setIsLeader(true);
        }
      } catch (error: any) {
        console.log(error);
        errorToast(error);
      }
    };

    const fetchIsAlreadyJoinedCompetition = async () => {
      try {
        const response = await axios.post(
          CommonConstant.CheckAnyCompetitionsJoined
        );
        if (response.data.data.hasJoined) {
          setIsAlreadyJoinedCompetition(true);
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred";

        errorToast(errorMessage);
      }
    };

    fetchTeamData();
    fetchData();
    fetchIsLeader();
    fetchIsAlreadyJoinedCompetition();
  }, []);

  const getStatusLabel = (code) => {
    const match = STATUS_LIST.find((item) => item.value === code);
    return match ? match.label : code;
  };

  const deleteCompetition = async (competition_id) => {
    try {
      const response = await axios.post(CommonConstant.RemoveCompetition, {
        competition_id,
      });

      if (response.data.success) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        errorToast("Error deleting competition");
      }
    } catch (error) {
      console.log(error);
      errorToast("Error deleting competition");
    }
  };

  const handleWishlist = async (competition_id) => {
    try {
      const response = await axios.post(CommonConstant.AddWishlistCompetition, {
        competition_id: competition_id,
      });
      if (response.data.success) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        setWishlistedTeam(competition_id);
        successToast(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred";

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

  return (
    <div className="main-container">
      <div className="main-col-container">
        <h1 className="text-4xl mb-4 w-full">Competition List</h1>
        {users?.role === "admin" && (
          <div className="w-full">
            <BlueButton
              label="Add Competition"
              onClick={() => navigate(ROUTE_PATHS.ADD_COMPETITION)}
              extendedClassName="text-lg"
            />
          </div>
        )}
        <div className="mt-10">
          {competitions.length === 0 ? (
            <p>No competitions available.</p>
          ) : (
            <ul className="space-y-2 grid grid-cols-3 gap-2">
              {currentCompetitions.map((comp: any, idx) => (
                <>
                  <div>
                    <li
                      key={idx}
                      className="border border-[#BBB5B5] bg-white rounded-xl shadow-sm h-full flex flex-col"
                    >
                      <img
                        src={`${CommonConstant.ImageSource}${comp.poster}`}
                        alt={comp.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="flex justify-between p-3">
                        <div>
                          <h3 className="font-semibold text-xl">
                            {comp.title}
                          </h3>
                          <p className="text-gray-600">
                            {new Date(comp.date).toLocaleString("id-ID", {
                              dateStyle: "long",
                            })}
                          </p>
                          <p className="pt-2 text-gray-600 text-md">
                            {`Min member: ${comp.min_member} | Max member: ${comp.max_member}`}
                          </p>
                          <p className="mt-3 break-all">
                            {comp.description.length > 170
                              ? `${comp.description.substring(0, 140)}...`
                              : comp.description}
                          </p>
                        </div>
                        <div>
                          <div
                            className={`cursor-default px-2 py-1 rounded-md font-semibold border-2 ${
                              comp.status === "ACT"
                                ? " text-green-600 border-green-600"
                                : "text-gray-500 border-gray-500"
                            }`}
                          >
                            {getStatusLabel(comp.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2 h-full px-3 pb-3">
                        {users?.role === "admin" && (
                          <>
                            <BlueButton
                              label="Edit"
                              onClick={() =>
                                navigate(
                                  `${ROUTE_PATHS.EDIT_COMPETITION}/${comp.competition_id}`
                                )
                              }
                              extendedClassName="self-end h-fit"
                            />
                            <RedButton
                              label="Delete"
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
                                  await deleteCompetition(comp.competition_id);

                                  await Swal.fire({
                                    title: "Competition Removed!",
                                    text: `${comp.title} has been removed.`,
                                    icon: "success",
                                  });
                                }
                              }}
                            />
                          </>
                        )}
                        <BlueButton
                          label="View Details"
                          onClick={() =>
                            viewCompetitionDetail(comp, comp.competition_id)
                          }
                        />
                        {!isAlreadyJoinedCompetition ? (
                          <button
                            onClick={() => handleWishlist(comp.competition_id)}
                            className="self-end cursor-pointer h-[40px] items-center font-semibold border-2 py-2 px-3 rounded-md duration-300 text-red-500 bg-white border-red-500 hover:duration-300"
                          >
                            <HiOutlinePlusCircle className="text-2xl font-bold" />
                          </button>
                        ) : (
                          wishlistedTeam == comp.competition_id && (
                            <button
                              className="self-end cursor-not-allowed h-[40px] items-center font-semibold border-2 py-2 px-3 rounded-md duration-300 text-white bg-red-400 enabled:hover:bg-red-500 border-none disabled:bg-red-300 disabled:text-white hover:duration-300"
                              disabled
                            >
                              <HiOutlinePlusCircle className="text-2xl font-bold" />
                            </button>
                          )
                        )}
                      </div>
                    </li>
                  </div>
                </>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
      </div>
    </div>
  );
};

export default MainPage;
