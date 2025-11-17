import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Scripture } from "~/components/add-scripture";
import coustomFetch from "~/utils/api";
import { getUserRole, getUserID } from "~/utils/auth";
import type { notifications } from "./profile";
import { Book, Send } from "lucide-react";
import { bibleBooks } from "~/components/filter";

function AddPrayerpoint() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prayerPoint, setPrayerPoint] = useState("");
  const [formData, setFormData] = useState<Scripture>({});
  const [errors, setErrors] = useState<Scripture>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<any[]>(bibleBooks);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

    if (!formData.chapter) {
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
    //TODO: add category selection
    formData.prayer_category = [];
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
            body: JSON.stringify({ message: notification.message }),
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

  const handleBookClick = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      book: option,
    }));
    setIsOpen(false);
  };

  const searchBook = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="p-8 max-md:pt-12">
        <h2 className="font-bold text-2xl max-sm:text-center max-sm:w-full">
          Submit a Prayer Point
        </h2>

        <div className="p-4 space-y-4">
          <div className="flex flex-row justify-between space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book *
              </label>
              <div className="md:relative">
                <Book className="max-md:hidden absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className={`text-black w-full sm:pl-10 pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 border-gray-300`}
                  placeholder="Search..."
                  name="scripture"
                  value={formData.book}
                  onChange={searchBook}
                  onFocus={() => setIsOpen(true)}
                />
                {isOpen && (
                  <div className="absolute z-10 bg-white border mt-1 w-full max-h-48 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option, idx) => (
                        <div
                          key={idx}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleBookClick(option);
                          }}
                          onBlur={() => setIsOpen(false)}
                        >
                          {option}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No options found</div>
                    )}
                  </div>
                )}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verse
              </label>
              <div className="relative">
                <Book className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="verse"
                  value={formData.verse}
                  onChange={handleInputChange}
                  className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="Enter verse"
                />
              </div>
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
                  submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Prayer Point
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPrayerpoint;
