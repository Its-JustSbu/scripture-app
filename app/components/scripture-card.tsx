import { MessageCircleMore } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

export default function ScriptureCard() {
  return (
    <>
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden w-full">
        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <img
            src="https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg"
            alt="Card Image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Card Title</h2>
            <p className="text-gray-600 text-sm">This is the subtitle text</p>
          </div>
          <NavLink to={`/main/scriptures/1`} className="m-4 mb-1 text-center bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-2xl transition-colors duration-200">
              View Prayers
              <MessageCircleMore className="inline-block ml-2" />
          </NavLink>
        </div>
      </div>
    </>
  );
}
