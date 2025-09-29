import { MessageCircleMore } from "lucide-react";
import { NavLink } from "react-router";
import type { Scripture } from "./add-scripture";
import DeleteScripture from "./delete-scripture";
import UpdateScripture from "./update-scripture";
import { isAdmin } from "~/utils/auth";

export default function ScriptureCard(props: Scripture) {
  return (
    <>
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden w-full">
        <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <img
            src={props.img}
            alt="Card Image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{props.book}</h2>
            <p className="text-gray-600 text-sm">
              Chapter {props.chapter} verse {props.verse}
            </p>
          </div>
          <div className="flex flex-row items-center space-x-2 justify-center w-full">
            <NavLink
              to={`/scriptures/${props._id}`}
              className={`m-2 text-center bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-4 rounded-2xl transition-colors duration-200 ${isAdmin() ? "" : "w-full"}`}
            >
              View Prayers
              <MessageCircleMore className="inline-block ml-2 w-6 h-6"/>
            </NavLink>
            {isAdmin() && (
              <>
                <DeleteScripture {...props} />
                <UpdateScripture {...props} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
