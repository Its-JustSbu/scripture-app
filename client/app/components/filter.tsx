import { X, Book, Save, FilterIcon, Section } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { Scripture } from "./add-scripture";
interface filters {
  scripture?: string;
  chapters?: number;
  verse?: number;
  category?: string;
}

const bibleBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

const categories = [
  "Main Prayer Point",
  "warfare",
  "protection",
  "favour",
  "wealth",
  "encouragement",
  "others",
  "family",
  "concentration",
  "provision",
  "direction",
  "nation/land",
  "worship",
];

function Filter({ onFilter, scriptures }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<filters>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTerm, setCategoryTerm] = useState("");

  // Close modal on Escape key
  useEffect(() => {
    const handleClose = (e: { key: string }) => {
      setIsCategory(false);
      setIsOpen(false);
    };

    if (isModalOpen) {
      document.addEventListener("click", () => handleClose);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("click", () => handleClose);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useEffect(() => {
    setFilteredOptions(
      bibleBooks.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  useEffect(() => {
    setCategoryOptions(
      categories.filter((option) =>
        option.toLowerCase().includes(categoryTerm.toLowerCase())
      )
    );
  }, [categoryTerm]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const searchCategory = (e: any) => {
    setCategoryTerm(e.target.value);
  };

  const searchBook = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (formData.scripture) {
      onFilter(
        scriptures.filter(
          (x: Scripture) =>
            x.book?.toLowerCase() == formData.scripture?.toLowerCase()
        )
      );
    }

    if (formData.chapters) {
      onFilter(
        scriptures.filter((x: Scripture) => x.chapter == formData.chapters)
      );
    }

    if (formData.verse) {
      onFilter(scriptures.filter((x: Scripture) => x.verse == formData.verse));
    }

    if (formData.category) {
      onFilter(
        scriptures.filter(
          (x: Scripture) =>
            x.prayer_point?.filter((y) => y.category == formData.category).length !== 0
        )
      );
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleCategoryClick = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      category: option,
    }));
    setIsCategory(false);
  };

  const handleBookClick = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      scripture: option,
    }));
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => openModal()}
        className="underline hover:text-yellow-600 text-gray-700 text-sm transition-colors duration-200"
      >
        filter search
      </button>
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed right-0 inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-start z-50 animate-fadeIn">
          {/* Modal Content */}
          <div className="bg-white rounded-l-xl shadow-2xl w-full max-w-md h-full overflow-y-auto animate-slideInRight flex flex-col rounded-r-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Filter Search</h2>
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
                    Book
                  </label>
                  <div className="relative">
                    <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 border-gray-300`}
                      placeholder="Search..."
                      name="scripture"
                      value={formData.scripture}
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
                            >
                              {option}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-gray-500">
                            No options found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter
                  </label>
                  <div className="relative">
                    <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="chapters"
                      value={formData.chapters}
                      onChange={handleInputChange}
                      className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 border-gray-300`}
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
                  Category
                </label>
                <div className="relative">
                  <Section className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className={`text-black w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 border-gray-300`}
                    placeholder="Search..."
                    name="category"
                    value={formData.category}
                    onChange={searchCategory}
                    onFocus={() => setIsCategory(true)}
                  />
                  {isCategory && (
                    <div className="absolute z-10 bg-white border mt-1 w-full max-h-48 overflow-y-auto">
                      {categoryOptions.length > 0 ? (
                        categoryOptions.map((option, idx) => (
                          <div
                            key={idx}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleCategoryClick(option)}
                          >
                            {option}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">
                          No options found
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                      Filtering...
                    </>
                  ) : (
                    <>
                      <FilterIcon className="w-4 h-4 mr-2" />
                      filter
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

export default Filter;
