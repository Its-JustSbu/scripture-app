import { Book, FilterIcon, Section } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { Scripture } from "./add-scripture";
import toast from "react-hot-toast";
export interface filters {
  scripture?: string;
  chapters?: number;
  verse?: string;
  category?: string;
}

export const bibleBooks = [
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

export const categories = [
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

function Filter({ onFilter, scriptures, onCancel }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [formData, setFormData] = useState<filters>({
    scripture: '',
    verse: '',
    category: '',
  });
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
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    setIsSubmitting(true);
    e.preventDefault();

    const fetchFiltered = await fetch(
      `${process.env.VITE_API_URL}scriptures/filter/1/50`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!fetchFiltered.ok) {
      toast.error(`Error fetching scriptures!`, {
        duration: 4000,
        position: "top-right",
      });
      setIsSubmitting(false);
      setIsModalOpen(false);
      return;
    }

    const result = await fetchFiltered.json();
    localStorage.setItem("filters", JSON.stringify(formData));
    onFilter(result);

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
      <div className="bg-white rounded-l-xl shadow-2xl w-full h-full overflow-y-auto animate-slideInRight rounded-r-2xl p-5">
        <div className="p-4">
          <div className="space-y-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book
              </label>
              <div className="md:relative">
                <Book className="max-md:hidden absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className={`text-black w-full sm:pl-10 pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 border-gray-300`}
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter
              </label>
              <div className="relative">
                <Book className="max-md:hidden absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="chapters"
                  value={formData.chapters}
                  onChange={handleInputChange}
                  className={`text-black w-full sm:pl-10 pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 border-gray-300`}
                  placeholder="Enter Chapter"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verse
              </label>
              <div className="md:relative">
                <Book className="max-md:hidden absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="verse"
                  value={formData.verse}
                  onChange={handleInputChange}
                  className="text-black w-full sm:pl-10 pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="Enter verse"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <Section className="max-md:hidden absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className={`text-black w-full sm:pl-10 pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 border-gray-300`}
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
                          onBlur={() => setIsCategory(false)}
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
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-200"
            >
              Reset
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
    </>
  );
}

export default Filter;
