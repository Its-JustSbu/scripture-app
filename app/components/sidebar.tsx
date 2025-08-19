import React, { useState } from "react";
import { NavLink } from "react-router";

function sidebar() {
  return (
    <nav className={`text-black flex flex-col items-center h-full p-5`}>
      <h2 className="font-bold text-shadow-2xl text-shadow-blue-700 bg-gradient-to-r from-blue-950 to-blue-500 text-transparent bg-clip-text text-3xl p-2 text-center">ScriptureApp</h2>
      <ul className="flex flex-col items-left gap-5 m-5 w-full">
        <NavLink to="/main/scriptures"><li className={`p-5 text-center hover:bg-gray-300 duration-300 ease-in-out hover:rounded-full w-full`}>Scriptures</li></NavLink>
        <NavLink to="/main/profile"><li className={`p-5 text-center hover:bg-gray-300 duration-300 ease-in-out hover:rounded-full w-full`}>Profile</li></NavLink>
      </ul>
    </nav>
  );
}

export default sidebar;
