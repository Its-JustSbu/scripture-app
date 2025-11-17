import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";
import type { Scripture } from "./add-scripture";
import DeleteScripture from "./delete-scripture";
import UpdateScripture from "./update-scripture";
import { isAdmin } from "~/utils/auth";
import { category_color } from "~/routes/scripture-chat";

export default function ScriptureCard(props: Scripture) {
  return (
    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 h-full my-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full p-4 h-full">
        <p className="font-medium text-lg">Scripture</p>

        <div className="px-6 pt-4 pb-2">
          {props.prayer_category?.map((category, i) => (
            <span key={i}
              className={`inline-block ${category_color[category.toLowerCase() as keyof typeof category_color]} rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2`}
            >
              {category}
            </span>
          ))}
        </div>

        <NavLink to={`/scriptures/${props._id}`} className="p-6 flex flex-col">
          <p className="text-gray-700 text-base mb-4 italic">
            {props.book} {props.chapter}:{props.verse} - "{props.scripture}"
          </p>
        </NavLink>

        {isAdmin() && (
          <div className="flex flex-row space-x-2">
            <DeleteScripture {...props} />
            <UpdateScripture {...props} />
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full p-4 h-full">
        <p className="font-medium text-lg">Prayer Points</p>
        <div className="flex flex-col">
          {props.prayer_point?.map((point, i) => (
            <p
              key={i}
              className="text-sm font-light border-t-2 border-t-gray-600 border-b-2 border-b-gray-600"
            >
              {point.category}{" "}
              <ArrowRight className="inline-block mx-2 w-3 h-3" /> {point.point}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
