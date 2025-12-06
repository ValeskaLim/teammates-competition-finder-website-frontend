import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import axios from "axios";
import CommonConstant from "../../constant/CommonConstant";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_PATHS } from "../../router/routePaths";
import GreenButton from "../../components/GreenButton";
import RedButton from "../../components/RedButton";

type Competition = {
  title: string;
  date: Date;
  status: string;
  category: number;
  min_member: number;
  max_member: number;
  description: string;
  poster: string;
  original_url: string;
};

const EditCompetitionPage = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [minMember, setMinMember] = useState<number | undefined>(undefined);
  const [maxMember, setMaxMember] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [competititonData, setCompetititonData] = useState<
    Competition | undefined
  >(undefined);
  const [poster, setPoster] = useState<string | null>("");
  const [newPoster, setNewPoster] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const { errorToast, successToast } = useToast();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    console.log(id);

    const fetchCompetition = async () => {
      try {
        const response = await axios.post(CommonConstant.GetCompetitionById, {
          id: Number(id),
        });

        if (response.data.success) {
          const competititonData = response.data.data || undefined;
          setCompetititonData(competititonData);
        } else {
          errorToast("Failed to fetch competition");
          setCompetititonData(undefined);
        }
      } catch (error) {
        console.log(error);
        errorToast("Error fetching competition");
      }
    };
    if (id) fetchCompetition();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.post(CommonConstant.GetAllCategories);
        if (response.data.success) {
          const categories = response.data.data || [];

          const options = categories.map((item: any) => ({
            label: item.competition_category_name,
            value: item.competition_category_id,
          }));

          setCategoryOptions(options);
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage = error.data.message;
        errorToast(errorMessage);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!competititonData) return;
    setTitle(competititonData.title);
    setDate(competititonData.date);
    setStatus(competititonData.status);
    setCategory(competititonData.category_id);
    setMinMember(competititonData.min_member);
    setMaxMember(competititonData.max_member);
    setDescription(competititonData.description);
    setPoster(competititonData.poster ?? "");
    setOriginalUrl(competititonData.original_url ?? "");
  }, [competititonData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("competition_id", id ?? "");
    formData.append("title", title);
    formData.append("date", date);
    formData.append("status", status);
    formData.append("category", category);
    formData.append("min_member", minMember?.toString() || "");
    formData.append("max_member", maxMember?.toString() || "");
    formData.append("description", description);
    if (newPoster) formData.append("poster", newPoster);
    formData.append("original_url", originalUrl ?? "");

    try {
      const request = await axios.post(
        CommonConstant.EditCompetition,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(request.data.success);
      if (request.data.success) {
        navigate(ROUTE_PATHS.COMPETITION);
        successToast(request.data.message);
      }
    } catch (error: any) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorToast(error.response.data.message);
      } else {
        errorToast("Error edit competition");
      }
    }
  };

  return (
    <div className="main-container">
      <div className="main-col-container bg-white p-10 rounded-2xl shadow-md">
        <div className="flex w-fit mb-5">
          <h1 className="text-4xl w-full">Edit Competition Data</h1>
        </div>
        <form method="POST" onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full h-fit overflow-hidden rounded-t-lg">
            <img
              src={`${CommonConstant.ImageSource}${poster}`}
              alt={title}
              className="w-full max-h-[500px] object-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-fit">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Input competition title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-fit">Date</label>
            <input
              type="date"
              id="date"
              placeholder="Input competition title"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-fit">Status</label>
            <select
              name="status"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full"
              required
            >
              <option value="" hidden>
                --Select one--
              </option>
              <option value="ACT">Active</option>
              <option value="INA">Inactive</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-fit">Category</label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full"
              required
            >
              <option value="" hidden>
                --Select one--
              </option>
              {categoryOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-fit">
              Original Url
            </label>
            <input
              type="text"
              id="originalUrl"
              placeholder="Input original URL"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-fit">
              Min member
            </label>
            <input
              type="number"
              id="min-member"
              min="0"
              placeholder="Input minimum member"
              value={minMember ?? ""}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setMinMember(isNaN(value) ? undefined : value);
              }}
              required
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-fit">
              Max member
            </label>
            <input
              type="number"
              id="max-member"
              min="0"
              placeholder="Input maximum member"
              value={maxMember ?? ""}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setMaxMember(isNaN(value) ? undefined : value);
              }}
              required
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-fit">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full h-[150px]"
              required
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label className="text-lg items-center flex w-64">Poster</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              min="0"
              placeholder="Input maximum member"
              onChange={(e) =>
                setNewPoster(e.target.files ? e.target.files[0] : null)
              }
              className="text-md mt-3 p-2 border border-[#BBB5B5] rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-7">
            <GreenButton
              type="submit"
              label="Save"
              extendedClassName="w-full sm:w-auto"
            />
            <RedButton
              label="Cancel"
              onClick={() => navigate(-1)}
              extendedClassName="w-full sm:w-auto"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompetitionPage;
