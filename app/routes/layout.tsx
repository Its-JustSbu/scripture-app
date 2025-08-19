import React from "react";
import { Outlet } from "react-router";
import Sidebar from "~/components/sidebar";

function layout() {
  return (
    <>
      <div className={`w-1/5 h-screen bg-gray-200 rounded-r-4xl shadow-2xl shadow-gray-600`}>
        <Sidebar />
      </div>
      <div className="w-full h-screen overflow-auto">
        <Outlet />
      </div>
    </>
  );
}

export default layout;
