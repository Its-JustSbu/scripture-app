import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddScripture, { type Scripture } from "~/components/add-scripture";
import ScriptureCard from "~/components/scripture-card";

function scriptures() {
  let [scriptures, setScriptures] = useState<Scripture[]>([]);
  let [reset, setReset] = useState(false);

  const fetchScriptures = async () => {
    const response = await fetch(`${process.env.VITE_API_URL}scriptures/`);
    if (!response.ok) {
      toast.error(`Error fetching scriptures!`, {
        duration: 4000,
        position: "top-right",
      });
      return;
    }
    const result = await response.json();
    setScriptures(result);
  };

  useEffect(() => {
    fetchScriptures();
    return;
  }, []);

  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (search) {
      setScriptures(
        scriptures.filter(
          (item) =>
            item.book?.toLowerCase().includes(search.toLowerCase()) ||
            item.scripture?.toLowerCase().includes(search.toLowerCase())
        )
      );
      setReset(true);
    }
  };

  const handleReset = () => {
    setReset(false);
    fetchScriptures();
    setSearch("");
  };

  return (
    <>
      <div className="p-8 max-md:pt-12">
        <h2 className="font-bold text-4xl max-sm:text-center max-sm:w-full">
          Welcome to the{" "}
          <span className="bg-gradient-to-tr from-black to-blue-700 bg-clip-text text-transparent">
            ScriptureApp
          </span>
        </h2>
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="space-x-2 m-4 ml-0 flex flex-row"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Scripture..."
            className="px-3 py-2 border text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
          />
          {!reset ? (
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          ) : (
            <button
              type="button"
              className={`px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition`}
              onClick={handleReset}
            >
              reset
            </button>
          )}
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {scriptures.length === 0 && (
            <p className="text-gray-500">No scriptures found.</p>
          )}
          {scriptures.map((scripture) => (
            <ScriptureCard key={scripture._id} {...scripture} />
          ))}
        </div>
      </div>
      <AddScripture />
    </>
  );
}

export default scriptures;
