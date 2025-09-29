import { Trash } from "lucide-react";
import React, { useState } from "react";
import type { Scripture } from "./add-scripture";
import coustomFetch from "~/utils/api";
import toast from "react-hot-toast";
import type { notifications } from "~/routes/profile";
import { getUserID } from "~/utils/auth";

export default function DeleteScripture(props: Scripture) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => setShowConfirm(true);
  const handleConfirm = async () => {
    setShowConfirm(false);
    const response = await coustomFetch(
      `${process.env.VITE_API_URL}scriptures/${props._id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      toast.success(`Scripture Deleted!`, {
        duration: 4000,
        position: "top-right",
      });
      const notification: notifications = {
        id: 0,
        message: `${props?.book} ${props?.chapter}:${props?.verse} scripture deleted by admin`,
      };

      await coustomFetch(
        `${process.env.VITE_API_URL}users/notify/${getUserID()}`,
        {
          method: "PATCH",
          body: JSON.stringify({message: notification.message}),
        }
      );
      return;
    }

    toast.error(`Error deleting!`, {
      duration: 4000,
      position: "top-right",
    });
  };
  const handleCancel = () => setShowConfirm(false);
  return (
    <>
      <button
        onClick={handleDeleteClick}
        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
      >
        <Trash className="inline-block w-5 h-5" />
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-50 z-50 transition animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="mb-6 text-lg font-medium text-black">
              Are you sure you want to delete this scripture?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
