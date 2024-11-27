"use client";

import { useState, useEffect } from "react";
import "../app/globals.css";
import React from "react";
import Sidebar from "@/Component/Sidebar";
import Link from "next/link";
import withAuth from "@/Component/withAuth";
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

const CarriersPage = () => {
  const [selectedState1, setSelectedState1] = useState("");
  const [selectedState2, setSelectedState2] = useState("");
  const [carriers, setCarriers] = useState([]);
  const [filteredCarriers, setFilteredCarriers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentCarrier, setCurrentCarrier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCarrier, setUpdatedCarrier] = useState(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const addNewRoute = () => {
    const newRoute = { route_name: "", states_covered: [""] };
    updateField("carrier_routes", [...updatedCarrier.carrier_routes, newRoute]);
  };


  

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

  const toggleRowExpansion = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const openModal = (carrier) => {
    setCurrentCarrier(carrier);
    setUpdatedCarrier({ ...carrier });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/carriers/${currentCarrier._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCarrier),
        }
      );
      const data = await response.json();
      setCarriers((prev) =>
        prev.map((carrier) =>
          carrier._id === data._id ? { ...carrier, ...data } : carrier
        )
      );
      setFilteredCarriers((prev) =>
        prev.map((carrier) =>
          carrier._id === data._id ? { ...carrier, ...data } : carrier
        )
      );
      setShowModal(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating carrier:", error);
    }
  };

  const updateField = (field, value) => {
    setUpdatedCarrier((prev) => ({ ...prev, [field]: value }));
  };

  const updateRoute = (routeIndex, field, value) => {
    const updatedRoutes = [...updatedCarrier.carrier_routes];
    updatedRoutes[routeIndex][field] = value;
    setUpdatedCarrier((prev) => ({ ...prev, carrier_routes: updatedRoutes }));
  };

  const updateStateCovered = (routeIndex, stateIndex, value) => {
    const updatedRoutes = [...updatedCarrier.carrier_routes];
    updatedRoutes[routeIndex].states_covered[stateIndex] = value;
    setUpdatedCarrier((prev) => ({ ...prev, carrier_routes: updatedRoutes }));
  };

  const updateArrayField = (field, index, value) => {
    const updatedArray = [...updatedCarrier[field]];
    updatedArray[index] = value;
    setUpdatedCarrier({ ...updatedCarrier, [field]: updatedArray });
  };

  const removeArrayField = (field, index) => {
    const updatedArray = updatedCarrier[field].filter((_, i) => i !== index);
    setUpdatedCarrier({ ...updatedCarrier, [field]: updatedArray });
  };

  const addArrayField = (field, value) => {
    setUpdatedCarrier({
      ...updatedCarrier,
      [field]: [...updatedCarrier[field], value],
    });
  };

  const addState = (routeIndex, value) => {
    const updatedRoutes = [...updatedCarrier.carrier_routes];
    updatedRoutes[routeIndex].states_covered.push(value);
    setUpdatedCarrier({ ...updatedCarrier, carrier_routes: updatedRoutes });
  };

  const removeState = (routeIndex, stateIndex) => {
    const updatedRoutes = [...updatedCarrier.carrier_routes];
    updatedRoutes[routeIndex].states_covered.splice(stateIndex, 1);
    setUpdatedCarrier({ ...updatedCarrier, carrier_routes: updatedRoutes });
  };

  return (
    <div className="flex h-screen">
    {/* sidebar  */}
    <Sidebar/>
    <div className="max-w-7xl container mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Carriers List
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="w-full md:w-1/3">
          <label
            htmlFor="state1"
            className="block text-gray-700 font-medium mb-2"
          >
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
          <label
            htmlFor="state2"
            className="block text-gray-700 font-medium mb-2"
          >
            To
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

        <div className="w-full md:w-1/5">
        <Link href="/CreateCarrierPage" className="ml-10">
          <button
            className=" bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-9"
          >
            Create New Carrier
          </button>
          </Link>
        
        </div>
      </div>
    

      {/* Carriers Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Carrier Name</th>
              <th className="p-4">States Coverd</th>
              <th className="p-4">Actions</th>
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
                        {/* Display Route Name */}
                        <div className="font-bold text-lg text-gray-800 mb-2">
                          {route.route_name}
                        </div>

                        {/* States Covered with Red Arrows */}
                        <div className="flex items-center gap-2">
                          {route.states_covered.map((state, stateIdx) => (
                            <React.Fragment key={stateIdx}>
                              <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full shadow-md transition-transform transform hover:scale-110 hover:bg-blue-200">
                                {state}
                              </span>
                              {/* Add red arrow between states */}
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
                      onClick={() => openModal(carrier)}
                      className="px-3 py-2 text-xs bg-green-500 text-white rounded-md shadow-sm"
                    >
                      View Details
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "Edit Carrier" : "Carrier Details"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Carrier Name:</label>
                <input
                  type="text"
                  value={updatedCarrier.carrier_name}
                  onChange={(e) => updateField("carrier_name", e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Carrier Company Phone:
                </label>
                <input
                  type="text"
                  value={updatedCarrier.carrier_company_phone.join(", ")}
                  onChange={(e) =>
                    updateField(
                      "carrier_company_phone",
                      e.target.value.split(",").map((phone) => phone.trim())
                    )
                  }
                  className="w-full p-2 border rounded"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  carrier_company_email :
                </label>
                <input
                  type="text"
                  value={updatedCarrier.carrier_company_email}
                  onChange={(e) =>
                    updateField("carrier_company_email", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700">carrier_mc_num:</label>
                <input
                  type="text"
                  value={updatedCarrier.carrier_mc_num}
                  onChange={(e) =>
                    updateField("carrier_mc_num", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700">driver_name:</label>
                <input
                  type="text"
                  value={updatedCarrier.driver_name}
                  onChange={(e) => updateField("driver_name", e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700">Driver Phone:</label>
                <input
                  type="text"
                  value={updatedCarrier.driver_phone.join(", ")}
                  onChange={(e) =>
                    updateField(
                      "driver_phone",
                      e.target.value.split(",").map((phone) => phone.trim())
                    )
                  }
                  className="w-full p-2 border rounded"
                  disabled={!isEditing}
                />
              </div>
{/* Existing fields */}
{updatedCarrier.carrier_routes.map((route, routeIndex) => (
      <div key={routeIndex} className="space-y-2 border-t pt-4">
        <h3 className="text-lg font-semibold">
          Route {routeIndex + 1}
        </h3>
        <div>
          <label className="block text-gray-700">Route Name:</label>
          <input
            type="text"
            value={route.route_name}
            onChange={(e) =>
              updateRoute(routeIndex, "route_name", e.target.value)
            }
            className="w-full p-2 border rounded"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-700">States Covered:</label>
          {route.states_covered.map((state, stateIndex) => (
            <div key={stateIndex} className="flex items-center gap-2">
              <input
                type="text"
                value={state}
                onChange={(e) =>
                  updateStateCovered(
                    routeIndex,
                    stateIndex,
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded"
                disabled={!isEditing}
              />
              {isEditing && (
                <button
                  onClick={() => {
                    const updatedStates = [
                      ...route.states_covered.slice(0, stateIndex),
                      ...route.states_covered.slice(stateIndex + 1),
                    ];
                    updateRoute(
                      routeIndex,
                      "states_covered",
                      updatedStates
                    );
                  }}
                  className="p-1 text-red-500 bg-gray-200 rounded-full"
                >
                  X
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => {
                const updatedStates = [...route.states_covered, ""];
                updateRoute(
                  routeIndex,
                  "states_covered",
                  updatedStates
                );
              }}
              className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              Add State
            </button>
          )}
        </div>
      </div>
    ))}
    {isEditing && (
      <button
        onClick={() => {
          const newRoute = {
            route_name: "",
            states_covered: [""],
          };
          const updatedRoutes = [...updatedCarrier.carrier_routes, newRoute];
          updateField("carrier_routes", updatedRoutes);
        }}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Route
      </button>
    )}
  </div>
  <div className="mt-4 flex justify-end gap-2">
    {isEditing ? (
      <>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={() => {
            setIsEditing(false);
            setUpdatedCarrier({ ...currentCarrier });
          }}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Cancel
        </button>
      </>
    ) : (
      <button
        onClick={() => setIsEditing(true)}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Edit
      </button>
    )}
    <button
      onClick={() => setShowModal(false)}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Close
    </button>     
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default withAuth(CarriersPage);
