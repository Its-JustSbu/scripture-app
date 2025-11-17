import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddScripture, { type Scripture } from "~/components/add-scripture";
import Filter, { type filters } from "~/components/filter";
import ScriptureCard from "~/components/scripture-card";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function scriptures() {
  let [scriptures, setScriptures] = useState<Scripture[]>([]);
  let [filtered, setFiltered] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const year = new Date().getFullYear();
  const fetchScriptures = async (pages = 1, limit = 50) => {
    let response;
    if (filtered) {
      response = await fetch(
        `${process.env.VITE_API_URL}scriptures/filter/${pages}/${limit}`,
        {
          method: "POST",
          body: localStorage.getItem("filters"),
        }
      );
    } else {
      response = await fetch(
        `${process.env.VITE_API_URL}scriptures/${pages}/${limit}`,
        {
          method: "GET",
        }
      );
    }
    
    if (!response.ok) {
      toast.error(`Error fetching scriptures!`, {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    const result = await response.json();

    setTotalPages(result.pagination.totalPages);
    setScriptures(result.data);
    setPage(result.pagination.page);
    setLimit(result.pagination.limit);
  };

  useEffect(() => {
    fetchScriptures(page, limit);
  }, [page]);

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
    }
  };

  const filterData = (s: any) => {
    setScriptures(s.data);
    setFiltered(true);
    setPage(s.pagination.page);
    setLimit(s.pagination.limit);
    setTotalPages(s.pagination.totalPages);
  };

  const handleReset = async () => {
    setFiltered(false);
    await fetchScriptures(1, 50);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
        <p className="mt-2 text-gray-600 max-sm:text-center max-sm:w-full text-justify">
          Prayer points have been extracted from Genesis to Revelation to help
          Christians with their prayer & spiritual warfare efforts. The prayer
          points can be accessed/download using your computer or mobile devices.
          Filters have been placed in the database to help users select the
          prayer points best suited for the issue/type of prayer they are
          engaged in. The prayer repository is intended to run as a wiki project
          (somewhat like Wikipedia); it will be opened for continuous addition,
          through submissions from users around the world. We do believe that
          this will help enhance the prayer life of Christians around the world.
          Thanks and God bless
        </p>
        <Filter
          onFilter={filterData}
          scriptures={scriptures}
          onCancel={handleReset}
        />
        <div className="w-full">
          {scriptures.length === 0 && (
            <p className="text-gray-500">No scriptures found.</p>
          )}
          {scriptures.map((scripture) => (
            <ScriptureCard key={scripture._id} {...scripture} />
          ))}
        </div>
        <div className="w-full mx-auto">
          <Stack spacing={2}>
            <Typography>Page: {page}</Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
            />
          </Stack>
        </div>
      </div>
      <p className="m-5">&copy; Scripture App {year}</p>
      <AddScripture />
    </>
  );
}

export default scriptures;
