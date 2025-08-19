import { PlusCircle } from "lucide-react";
import React from "react";
import AddScripture from "~/components/add-scripture";
import ScriptureCard from "~/components/scripture-card";
import scripturecard from "~/components/scripture-card";

function scriptures() {
  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Scriptures</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ScriptureCard />
        </div>
      </div>
      <AddScripture />
    </>
  );
}

export default scriptures;
