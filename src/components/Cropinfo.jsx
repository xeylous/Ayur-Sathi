// components/CropDetails.js

import { useState } from "react";
import { speciesList } from "../lib/cropdetails";
import { infoList } from "../lib/cropinfo";

const uniqueInfoList = Array.from(
  new Map(infoList.map((item) => [item.speciesId, item])).values()
);

export default function CropDetails() {
  const [selected, setSelected] = useState(null);

  const selectedData =
    uniqueInfoList.find((item) => item.speciesId === selected) || null;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 min-h-screen bg-[#f8fbe0]">

      {/* LEFT SIDE LIST */}
      <div className="w-full md:w-1/3 md:h-screen overflow-y-auto md:border-r pr-0 md:pr-4">
        <h2 className="text-2xl font-bold mb-4 text-[#4F772D]">
          Herbal Species
        </h2>

        <ul className="space-y-3">
          {speciesList.map((item) => (
            <li
              key={item.speciesId}
              onClick={() => setSelected(item.speciesId)}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-300 font-medium
                bg-[#90A955] text-white hover:bg-[#4F772D] shadow ${
                  selected === item.speciesId ? "ring-4 ring-[#4F772D]/40" : ""
                }`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE DETAILS */}
      <div className="w-full md:w-2/3 p-2 md:p-6">
        {selectedData ? (
          <div className="space-y-6 animate-fadeIn">

            {/* PLANT NAME */}
            <h1 className="text-2xl md:text-3xl font-bold px-4 md:px-6 py-3 rounded-2xl shadow-lg
              bg-[#90A955] text-white hover:bg-[#4F772D] transition-all duration-300 text-center md:text-left">
              {selectedData.name}
            </h1>

            {/* IMAGE */}
            {selectedData.image && (
              <img
                src={selectedData.image}
                alt={selectedData.name}
                className="w-full sm:w-80 md:w-64 lg:w-80 h-auto object-cover rounded-2xl shadow mx-auto md:mx-0"
              />
            )}

            {/* USES */}
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-lg md:text-xl font-semibold px-4 py-2 rounded-lg inline-block mb-3
                bg-[#90A955] text-white hover:bg-[#4F772D] transition-all duration-300">
                Uses
              </h2>
              <ul className="list-disc ml-5 md:ml-6 text-gray-700 space-y-1">
                {(selectedData.uses || []).map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>

            {/* BENEFITS */}
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-lg md:text-xl font-semibold px-4 py-2 rounded-lg inline-block mb-3
                bg-[#90A955] text-white hover:bg-[#4F772D] transition-all duration-300">
                Benefits
              </h2>
              <ul className="list-disc ml-5 md:ml-6 text-gray-700 space-y-1">
                {(selectedData.benefits || []).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            {/* DISADVANTAGES */}
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-lg md:text-xl font-semibold px-4 py-2 rounded-lg inline-block mb-3
                bg-[#90A955] text-white hover:bg-[#4F772D] transition-all duration-300">
                Disadvantages / Side Effects
              </h2>
              <ul className="list-disc ml-5 md:ml-6 text-gray-700 space-y-1">
                {(selectedData.disadvantages || []).map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <p className="text-gray-600 text-lg text-center md:text-left">
            Select a plant to view details.
          </p>
        )}
      </div>
    </div>
  );
}
