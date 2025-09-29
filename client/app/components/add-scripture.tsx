import React, { useEffect, useState } from "react";
import "./add-scripture.css";
import { X, Save, PlusCircle, Book } from "lucide-react";
import { getUserID, getUserRole, isAdmin } from "~/utils/auth";
import toast from "react-hot-toast";
import type { notifications } from "~/routes/profile";
import coustomFetch from "~/utils/api";

export interface prayerpoint {
  id?: any;
  point?: string;
  category?: string;
  user_role?: string;
  last_updated?: Date;
  isApporved?: boolean;
  userID?: any;
}

export interface Scripture {
  _id?: string;
  img?: string;
  book?: string;
  chapter?: number;
  verse?: number;
  scripture?: string;
  prayer_point?: prayerpoint[];
}

const randomImage = [
  "https://images.pexels.com/photos/139975/pexels-photo-139975.jpeg",
  "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
  "https://images.pexels.com/photos/36478/amazing-beautiful-beauty-blue.jpg",
  "https://images.pexels.com/photos/772429/pexels-photo-772429.jpeg",
  "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg",
  "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg",
  "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg",
  "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg",
  "https://images.pexels.com/photos/33041/antelope-canyon-lower-canyon-arizona.jpg",
  "https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg",
  "https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg",
  "https://images.pexels.com/photos/37728/pexels-photo-37728.jpeg",
  "https://images.pexels.com/photos/1687575/pexels-photo-1687575.jpeg",
  "https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg",
  "https://images.pexels.com/photos/2253573/pexels-photo-2253573.jpeg",
  "https://images.pexels.com/photos/1324803/pexels-photo-1324803.jpeg",
  "https://images.pexels.com/photos/21323/pexels-photo.jpg,",
  "https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg",
];

export default function AddScripture() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prayerPoint, setPrayerPoint] = useState("");
  const [formData, setFormData] = useState<Scripture>({});
  const [errors, setErrors] = useState<Scripture>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscapeKey = (e: { key: string }) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setErrors({});
    setPrayerPoint("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name == "prayer_point") {
      setPrayerPoint(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Scripture = {};

    if (!formData.book) {
      newErrors.book = "Book is required";
    }

    if (formData.chapter == 0) {
      newErrors.scripture = "Chapter is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    formData.img =
      randomImage[Math.floor(Math.random() * (randomImage.length - 1))];

    formData.prayer_point = [
      {
        id: formData.prayer_point ? formData.prayer_point.length + 1 : 1,
        point: prayerPoint,
        user_role: getUserRole(),
        isApporved: true,
        category: "main prayer point",
        last_updated: new Date(),
        userID: getUserID(),
      },
    ];

    try {
      const response = await fetch(`${process.env.VITE_API_URL}scriptures/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast("Scripture created!", {
          duration: 4000,
          position: "top-right",
        });

        const notification: notifications = {
          id: 0,
          message: `New scripture ${formData?.book} ${formData?.chapter}:${formData?.verse} posted by admin`,
        };

        await coustomFetch(
          `${process.env.VITE_API_URL}users/notify/${getUserID()}`,
          {
            method: "PATCH",
            body: JSON.stringify({message: notification.message}),
          }
        );
        closeModal();
      }
    } catch (error) {
      toast("Submission error!", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isAdmin() && (
        <button
          onClick={() => openModal()}
          className="fixed bottom-4 right-0 m-4 mb-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-2xl transition-colors duration-200"
        >
          Add Scripture
          <PlusCircle className="inline-block ml-2" />
        </button>
      )}
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-end z-50 animate-fadeIn">
          {/* Modal Content */}
          <div className="bg-white rounded-l-xl shadow-2xl w-full max-w-md h-full overflow-y-auto animate-slideInRight flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Create a New Scripture
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book *
                  </label>
                  <div className="relative">
                    <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="book"
                      value={formData.book}
                      onChange={handleInputChange}
                      className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        errors.book
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Book"
                    />
                  </div>
                  {errors.book && (
                    <p className="mt-1 text-sm text-red-600">{errors.book}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter *
                  </label>
                  <div className="relative">
                    <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="chapter"
                      value={formData.chapter}
                      onChange={handleInputChange}
                      className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        errors.chapter
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Chapter"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verse
                </label>
                <div className="relative">
                  <Book className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="verse"
                    value={formData.verse}
                    onChange={handleInputChange}
                    className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="Enter verse"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scripture *
                </label>
                <textarea
                  name="scripture"
                  value={formData.scripture}
                  onChange={handleInputChange}
                  rows={3}
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none"
                  placeholder="Add a scripture description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prayer Point *
                </label>
                <textarea
                  name="prayer_point"
                  value={prayerPoint}
                  onChange={handleInputChange}
                  rows={3}
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none"
                  placeholder="Add a prayer point or notes"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-6 py-3 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Scripture
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
