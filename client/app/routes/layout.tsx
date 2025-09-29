import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import Sidebar from "~/components/sidebar";

function layout() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="lg:hidden fixed top-5 left-4 z-50 p-2 rounded-full bg-blue-600 text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="flex flex-row space-x-1 w-full">
        <div
          className={`h-screen
        ${isOpen ? "" : "max-lg:hidden"}
        `}
        >
          <Sidebar />
        </div>
        <div className="h-screen overflow-auto w-full">
          <Outlet />
          <Toaster />
        </div>
      </div>
    </>
  );
}

export default layout;
