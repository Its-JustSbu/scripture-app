import React, { useEffect, useState } from "react";
import "./update-scripture.css";
import { X, Save, Upload, Book } from "lucide-react";
import type { Scripture } from "./add-scripture";
import coustomFetch from "~/utils/api";
import toast from "react-hot-toast";

export default function UpdateScripture(props: Scripture) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Scripture>({});
  const [errors, setErrors] = useState<Scripture>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    const response = await fetch(
      `${process.env.VITE_API_URL}scriptures/${props._id}`
    );
    if (!response.ok) {
      console.log(`An error has occured: ${response.statusText}`);
      return;
    }
    const result = await response.json();
    if (!response.ok) {
      console.log(`${props._id} does not exist.`);
      return;
    }
    setFormData(result);
  };
  useEffect(() => {
    fetchData();
    return;
  }, []);

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
    setFormData({
      book: "",
      chapter: 0,
      verse: 0,
      scripture: "",
      prayer_point: [],
    });
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof Scripture]) {
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

    if (!formData.scripture) {
      newErrors.scripture = "Verse is required";
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

    try {
      const response = await coustomFetch(
        `${process.env.VITE_API_URL}scriptures/${props._id}`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        toast.success("Scripture updated!", {
          duration: 4000,
          position: "top-right",
        });
        closeModal();
      }
    } catch (error) {
      toast.error("Submission error!", {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => openModal()}
        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-full transition-colors duration-200"
      >
        <Upload className="inline-block w-5 h-5" />
      </button>
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed right-0 inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-start z-50 animate-fadeIn">
          {/* Modal Content */}
          <div className="bg-white rounded-l-xl shadow-2xl w-full max-w-md h-full overflow-y-auto animate-slideInRight flex flex-col rounded-r-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Update a New Scripture
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

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-6 py-3 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-yellow-600 hover:bg-yellow-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Scripture
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
