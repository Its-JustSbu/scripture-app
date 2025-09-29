import {
  User,
  Send,
  UserStar,
  ArrowLeft,
  CheckIcon,
  X,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Route } from "./+types/scripture-chat";
import type { prayerpoint, Scripture } from "~/components/add-scripture";
import { getUserID, getUserRole, isAdmin, isAuthenticated } from "~/utils/auth";
import coustomFetch from "~/utils/api";
import toast from "react-hot-toast";

const category_color = {
  "main prayer point": "bg-blue-500",
  warfare: "bg-red-500",
  protection: "bg-green-500",
  favour: "bg-yellow-500",
  wealth: "bg-purple-500",
  encouragement: "bg-pink-500",
  others: "bg-gray-500",
  family: "bg-indigo-500",
  concentration: "bg-teal-500",
  provision: "bg-orange-500",
  direction: "bg-cyan-500",
  "nation/land": "bg-lime-500",
  worship: "bg-amber-500",
};

export async function loader({ params }: Route.LoaderArgs) {
  const scriptureId = params.id;
  if (!scriptureId) {
    throw new Error("Scripture ID is required");
  }

  let scripture: Scripture = {};
  const response = await fetch(
    `http://localhost:3000/scriptures/${scriptureId}`
  );
  if (!response.ok) {
    console.error(`Error fetching scriptures: ${response.statusText}`);
    return;
  }
  const result = await response.json();
  scripture = result;

  return scripture;
}

function scripturechat({ loaderData }: Route.ComponentProps) {
  const isAuthenticatedUser = isAuthenticated();
  const isAuthenticatedAdmin = isAdmin();
  const [prayers, setPrayer] = useState<prayerpoint[]>([]);
  const [inputPrayer, setInputPrayer] = useState("");
  const [inputCategory, setInputCategory] = useState("");

  useEffect(() => {
    const fetchPrayerPoints = async () => {
      const response = await coustomFetch(
        `http://localhost:3000/scriptures/prayerpoints/${loaderData?._id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        console.error(`Error fetching prayer points: ${response.statusText}`);
        return;
      }

      setPrayer(await response.json());
    };
    fetchPrayerPoints();
  }, []);

  const handleSendMessage = async () => {
    console.log("posting prayer:", inputPrayer);
    if (inputPrayer.trim() === "") return;

    const newUserPrayer: prayerpoint = {
      id: prayers.length + 1,
      point: inputPrayer,
      category: inputCategory,
      user_role: getUserRole(),
      last_updated: new Date(),
      isApporved: isAuthenticatedAdmin,
      userID: getUserID(),
    };
    prayers.push(newUserPrayer);

    try {
      const response = await coustomFetch(
        `http://localhost:3000/scriptures/post-prayerpoint/${loaderData?._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ prayer_point: prayers }),
        }
      );

      if (!response.ok) {
        console.error(`Error posting prayer: ${response.statusText}`);
        return;
      }

      console.log("Prayer posted successfully.");
    } catch (error) {
      console.error("Error posting prayer:", error);
    } finally {
      setInputPrayer("");
      setInputCategory("");
    }
  };

  const handleKeyPress = (e: {
    key: string;
    shiftKey: any;
    preventDefault: () => void;
  }) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: {
    toLocaleTimeString: (
      arg0: string,
      arg1: { hour: string; minute: string; hour12: boolean }
    ) => any;
  }) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleApproval = async (i: number, approve: boolean) => {
    if (approve) {
      prayers[i] = { ...prayers[i], isApporved: approve };
    }

    try {
      const response = await coustomFetch(
        `http://localhost:3000/scriptures/approve/${loaderData?._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            prayer_point: approve ? prayers : prayers.filter((x) => x.id != i),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(`Prayer point approved`, {
          duration: 4000,
          position: "top-right",
        });
        //TODO: Send Notification
      }
    } catch (error) {
      toast.error(`Error approving prayer point`, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="border border-gray-200 p-3 flex flex-row items-center space-x-4">
          <button
            onClick={handleGoBack}
            className={`inline-flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2>
              {loaderData ? loaderData.book : ""}{" "}
              {loaderData ? loaderData.chapter : ""}:
              {loaderData ? loaderData.verse : ""}
            </h2>
          </div>
        </div>
        <div className="flex flex-row h-full w-full">
          <div className="w-1/4 border border-gray-200 p-3">
            <h4>Scripture: </h4>
            <p className="font-light text-sm">
              {loaderData ? loaderData.scripture : ""}
            </p>
          </div>
          <div className="flex flex-col justify-between w-full bg-transparent shadow-lg border border-gray-200">
            {/* prayers Area */}
            <div className="flex-1 overflow-auto space-y-4 p-3">
              {prayers?.map((prayer, index) => (
                <>
                  {(prayer.isApporved ||
                    isAuthenticatedAdmin ||
                    prayer.userID == getUserID()) && (
                    <div
                      key={index}
                      className={`flex flex-col items-start space-x-3`}
                    >
                      {/* Avatar */}
                      <div
                        className={`h-8 w-full rounded-t-xl flex flex-row justify-between items-center px-5 flex-shrink-0 ${
                          category_color[
                            prayer.category as keyof typeof category_color
                          ] || "bg-gray-500"
                        }`}
                      >
                        <>
                          <div className="flex flex-row items-center text-white">
                            {prayer.user_role == "admin" ? (
                              <UserStar className="w-5 h-5 mx-2 text-white" />
                            ) : (
                              <User className="w-5 h-5 mx-2 text-white" />
                            )}
                            posted by {prayer.user_role || "Unknown"} -
                            {prayer.category === "main prayer point"
                              ? prayer.category
                              : `praying for ${prayer.category}`}
                          </div>
                          {isAuthenticatedAdmin ? (
                            !prayer.isApporved ? (
                              <div className="flex flex-row items-center space-x-1">
                                <button
                                  className={`my-4 h-10 relative text-center bg-green-500 hover:bg-green-600 text-white text-xs p-2 rounded-2xl transition-colors duration-200`}
                                  onClick={() =>
                                    handleApproval(prayer.id, true)
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className={`my-4 h-10 relative text-center bg-red-500 hover:bg-red-600 text-white text-xs p-2 rounded-2xl transition-colors duration-200`}
                                  onClick={() =>
                                    handleApproval(prayer.id, false)
                                  }
                                >
                                  Deny
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-row items-center space-x-1">
                                <CheckIcon className="w-6 h-6 text-white" />{" "}
                                Approved
                              </div>
                            )
                          ) : (
                            !prayer.isApporved && (
                              <div className="flex flex-row items-center space-x-1">
                                <Clock className="w-6 h-6 text-white" /> Waiting
                                for Approval
                              </div>
                            )
                          )}
                        </>
                      </div>
                      {/* Message Bubble */}
                      <div
                        className={`w-full ${isAuthenticatedUser ? "text-right" : ""}`}
                      >
                        <div
                          className={`px-4 py-2 rounded-b-xl shadow-sm bg-white text-gray-800 border border-gray-200`}
                        >
                          <p className="text-sm leading-relaxed">
                            {prayer.point}
                          </p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 ${isAuthenticatedUser ? "text-right" : ""}`}
                        >
                          {prayer.last_updated
                            ? new Date(prayer.last_updated).toLocaleDateString()
                            : "Unknown date"}
                          -
                          {prayer.last_updated
                            ? formatTime(new Date(prayer.last_updated))
                            : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Input Area */}
            {isAuthenticatedUser && (
              <div className="bg-transparent border-t border-gray-200 p-4">
                {/* Prayer Category Dropdown */}
                <div className="flex items-center mb-3 flex-row">
                  <label
                    htmlFor="prayerCategory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Prayer Category
                  </label>
                  <select
                    id="prayerCategory"
                    className="appearance-none w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    value={inputCategory}
                    onChange={(e) => {
                      setInputCategory(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="main prayer point">Main Prayer Point</option>
                    <option value="warfare">Warfare</option>
                    <option value="protection">Protection</option>
                    <option value="favour">Favour</option>
                    <option value="wealth">Wealth</option>
                    <option value="encouragement">Encouragement</option>
                    <option value="others">Others</option>
                    <option value="family">Family</option>
                    <option value="concentration">Concentration</option>
                    <option value="provision">Provision</option>
                    <option value="direction">Direction</option>
                    <option value="nation/land">Nation/Land</option>
                    <option value="worship">Worship</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputPrayer}
                      onChange={(e) => setInputPrayer(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your prayer point..."
                      className="text-black p-2 w-full bg-gray-100 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      inputPrayer.trim() === "" || inputCategory.trim() === ""
                    }
                    className={`p-4 rounded-full transition-colors duration-200 ${
                      inputPrayer.trim() === "" || inputCategory.trim() === ""
                        ? "bg-gray-300 text-blue-950 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default scripturechat;
