import { X } from "lucide-react";
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
        className={`lg:hidden fixed left-0 top-0 rounded-br-sm p-2 z-50 bg-blue-600 text-white focus:outline-none ${isOpen && 'bg-transparent'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open sidebar"
      >
        {isOpen ? (
          <X className="inline-block w-6 h-6 text-blue-600" />
        ) : (
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
        )}
      </button>
      <div className="flex flex-row space-x-1 w-full">
        <div
          className={`h-screen
        ${isOpen ? "fixed" : "max-lg:hidden"}
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
