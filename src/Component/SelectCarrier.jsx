"use client";

import { useState, useEffect } from "react";
import "../app/globals.css";
import React from "react";

const statesList = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const SelectCarriers = ({ quote_id }) => {
  const [selectedState1, setSelectedState1] = useState("");
  const [selectedState2, setSelectedState2] = useState("");
  const [carriers, setCarriers] = useState([]);
  const [filteredCarriers, setFilteredCarriers] = useState([]);

  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/carriers");
        const data = await response.json();
        setCarriers(data);
        setFilteredCarriers(data);
        
      } catch (error) {
        console.error("Error fetching carrier data:", error);
      }
    };

    fetchCarriers();
  }, []);

  useEffect(() => {
    let filtered = carriers;

    if (!selectedState1 && !selectedState2) {
      filtered = carriers;
    } else {
      filtered = carriers.filter((carrier) =>
        carrier.carrier_routes.some(
          (route) =>
            selectedState1 &&
            route.states_covered.includes(selectedState1) &&
            selectedState2 &&
            route.states_covered.includes(selectedState2)
        )
      );
    }

    setFilteredCarriers(filtered);
  }, [selectedState1, selectedState2, carriers]);

  const handleSelectCarrier = async (carrier) => {
    try {
      // Include the quote_id in the payload
      const payload = {
        ...carrier,
        quote_id, // Add the quote_id from the props
      };

      const response = await fetch("http://localhost:5000/api/selected_carrier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Parse error response if not JSON
        const errorText = await response.text();
        console.error("Server error:", errorText);
        window.location.reload()
      }

      const data = await response.json();
      alert("Carrier added successfully!");
      window.location.reload()
    } catch (error) {
      console.error("Error adding carrier:", error);
      alert("Error adding carrier. Please check your input or try again later.");
    }
  };

  return (
    <div className="flex h-screen overflow-auto">
      <div className="max-w-7xl container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Select Carrier for Shipping
        </h1>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="w-full md:w-1/3">
            <label htmlFor="state1" className="block text-gray-700 font-medium mb-2">
              From:
            </label>
            <select
              id="state1"
              value={selectedState1}
              onChange={(e) => setSelectedState1(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="">All States</option>
              {statesList.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label htmlFor="state2" className="block text-gray-700 font-medium mb-2">
              To:
            </label>
            <select
              id="state2"
              value={selectedState2}
              onChange={(e) => setSelectedState2(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="">All States</option>
              {statesList.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
               
                <th className="p-4">Carrier Name</th>
                <th className="p-4">States Covered</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredCarriers.length > 0 ? (
                filteredCarriers.map((carrier, index) => (
                  <tr
                    key={index}
                    className="odd:bg-gray-50 even:bg-white hover:bg-gray-100"
                  >
                  
                    <td className="p-4 font-medium">
                      <b>{carrier.carrier_name}</b>
                    </td>
                    <td className="p-4">
                      {carrier.carrier_routes.map((route, idx) => (
                        <div key={idx} className="mb-2">
                          <div className="font-bold text-lg text-gray-800 mb-2">
                            {route.route_name}
                          </div>
                          <div className="flex items-center gap-2">
                            {route.states_covered.map((state, stateIdx) => (
                              <React.Fragment key={stateIdx}>
                                <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-blue-200">
                                  {state}
                                </span>
                                {stateIdx < route.states_covered.length - 1 && (
                                  <span className="text-red-600 font-bold text-lg">
                                    →
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="p-4">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                        onClick={() => handleSelectCarrier(carrier)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No carriers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SelectCarriers;
