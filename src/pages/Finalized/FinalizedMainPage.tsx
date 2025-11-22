import axios from "axios";
import { useEffect, useState } from "react";
import CommonConstant from "../../constant/CommonConstant";
import { useToast } from "../../hooks/useToast";
import BlueButton from "../../components/BlueButton";

const FinalizedMainPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const { successToast, errorToast } = useToast();

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.post(CommonConstant.GetAllTransactions);
        if (response.data.success) {
          const transactionList = response.data.data;
          setTransactions(transactionList);
        }
      } catch (error: any) {
        console.log(error);
        const errorMessage =
          error.response?.data?.message || "Failed to fetch transactions";
        errorToast(errorMessage);
      }
    };

    fetchTransactions();
  }, []);

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

  return (
    <div className="main-container">
      <div className="main-col-container items-center">
        <h1 className="text-4xl font-semibold">Finalized List</h1>
        <div className="w-full mt-20">
          {transactions.length === 0 ? (
            <p className="text-center text-lg">
              No finalized transactions available.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-wrap">
              {currentTransactions.map((transaction: any) => (
                <div
                  key={transaction.proof_transaction_id}
                  className="border border-[#e6e6e6] rounded-2xl p-4 shadow-md mb-4 w-full bg-white"
                >
                  <h2 className="mb-1 text-2xl">
                    <span className="font-semibold">
                      {transaction.team_name}
                    </span>
                    's Team
                  </h2>
                  <h3 className="text-md">{transaction.txn_hash}</h3>
                  <hr className="border-dotted my-4" />
                  <p>
                    Status:{" "}
                    <span className="font-semibold text-green-500">
                      {transaction.status}
                    </span>
                  </p>
                  <p>
                    Block Number:{" "}
                    <span className="font-semibold">
                      {transaction.block_number}
                    </span>
                  </p>
                  <p>
                    Competition:{" "}
                    <span className="font-semibold">
                      {transaction.competition_name}
                    </span>
                  </p>
                  <div className="flex gap-3 mt-5">
                    <BlueButton
                      label="View Proof Image"
                      onClick={() =>
                        setSelectedImage(
                          `${CommonConstant.ImageProofSource}/${transaction.proof_image_path}`
                        )
                      }
                    />
                    <BlueButton
                      label="View Transaction Details"
                      onClick={() => handleTextClick(transaction.txn_hash_path)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Proof"
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

      {selectedText && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedText(null)}
        >
          <div
            className="relative bg-white text-black rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg"
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
    </div>
  );
};

export default FinalizedMainPage;
