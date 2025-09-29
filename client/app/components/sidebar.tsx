import { NavLink } from "react-router";
import Auth from "./auth";
import { isAuthenticated } from "~/utils/auth";

function Sidebar() {
  return (
    <>
      {/* Sidebar */}
      <nav
        className={`text-black flex flex-col items-center h-full p-5 bg-white shadow-lg w-64 transition-transform duration-300 ease-in-out`}
      >
        <NavLink
          to=""
          className="font-bold text-shadow-2xl text-shadow-blue-700 bg-gradient-to-r from-blue-950 to-blue-500 text-transparent bg-clip-text text-3xl p-2 text-center max-sm:text-lg max-sm:text-right max-sm:p-1.5"
        >
          ScriptureApp
        </NavLink>

        <ul className="flex flex-col items-left gap-5 m-5 w-full">
          <NavLink to="">
            <li
              className={`p-2 text-left hover:bg-gray-300 duration-300 ease-in-out hover:rounded-full w-full`}
            >
              Scriptures
            </li>
          </NavLink>
          {isAuthenticated() && (
            <NavLink to="/profile">
              <li
                className={`p-2 text-left hover:bg-gray-300 duration-300 ease-in-out hover:rounded-full w-full`}
              >
                Profile
              </li>
            </NavLink>
          )}
          <Auth />
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;
