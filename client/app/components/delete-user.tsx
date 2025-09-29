import { Trash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import type { notifications } from "~/routes/profile";
import coustomFetch from "~/utils/api";
import { getUserID } from "~/utils/auth";

export default function Deleteuser({ id }: any) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => setShowConfirm(true);
  const handleConfirm = async () => {
    setShowConfirm(false);
    const response = await fetch(`${process.env.VITE_API_URL}users/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) {
      toast.error(`Error deleting user!`, {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    const notification: notifications = {
      id: 0,
      message: `A user removed by admin`,
    };

    await coustomFetch(
      `${process.env.VITE_API_URL}users/batch/}`,
      {
        method: "PATCH",
        body: JSON.stringify({ message: notification.message }),
      }
    );

    toast.success(`User deleted successfully.`, {
      duration: 4000,
      position: "top-right",
    });
  };
  const handleCancel = () => setShowConfirm(false);
  return (
    <>
      <button
        onClick={handleDeleteClick}
        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition max-sm:w-full max-sm:rounded"
      >
        <Trash className="inline-block" />
      </button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-50 z-50 transition animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <p className="mb-6 text-lg font-medium text-black">
              Are you sure you want to delete this user?
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
