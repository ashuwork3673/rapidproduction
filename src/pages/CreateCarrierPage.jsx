"use client";
import Sidebar from '@/Component/Sidebar';
import { useState } from 'react';
import '../app/globals.css';
import withAuth from "@/Component/withAuth";

const statesList = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const CreateCarrierPage = () => {
  const [formData, setFormData] = useState({
    carrier_name: '',
    carrier_company_phone: [''], // Initialize with one empty field
    carrier_company_email: '',
    driver_name: '',
    driver_phone: [''], // Initialize with one empty field
    carrier_mc_num: '',
    carrier_routes: [{ route_name: '', states_covered: [] }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleArrayChange = (e, arrayName, index) => {
    const { value } = e.target;
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData(prevState => ({
      ...prevState,
      [arrayName]: newArray
    }));
  };

  const addArrayField = (arrayName) => {
    setFormData(prevState => ({
      ...prevState,
      [arrayName]: [...prevState[arrayName], '']
    }));
  };

  const removeArrayField = (arrayName, index) => {
    setFormData(prevState => {
      const newArray = [...prevState[arrayName]];
      newArray.splice(index, 1);
      return { ...prevState, [arrayName]: newArray };
    });
  };

  const handleRouteChange = (index, e) => {
    const { name, value } = e.target;
    const newRoutes = [...formData.carrier_routes];
  
    if (name === 'states_covered') {
      const selectedState = value;
  
      // Add the state if not already in the array
      if (!newRoutes[index][name].includes(selectedState)) {
        newRoutes[index][name] = [...newRoutes[index][name], selectedState];
      }
    } else {
      newRoutes[index][name] = value;
    }
  
    setFormData(prevState => ({
      ...prevState,
      carrier_routes: newRoutes
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/carriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create carrier');
      }

      const data = await response.json();
      console.log('Carrier created:', data);
      alert('Carrier created successfully!');
      window.location.reload()
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error creating the carrier.');
    }
  };
  return (

    <div className="flex h-screen">
    {/* sidebar  */}
    <Sidebar/>
    <div className="max-w-4xl container p-4 mt-10 m-auto">
      <h1 className="text-2xl font-bold text-center mb-6 ">Create Carrier</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Carrier Info Fields */}
        <div>
          <label htmlFor="carrier_name" className="block text-sm font-medium">Carrier Name:</label>
          <input
            type="text"
            name="carrier_name"
            value={formData.carrier_name}
            onChange={handleChange}
            id="carrier_name"
            className="w-full p-2 border rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="carrier_company_email" className="block text-sm font-medium">Carrier Email:</label>
          <input
            type="text"
            name="carrier_company_email"
            value={formData.carrier_company_email}
            onChange={handleChange}
            id="carrier_company_email"
            className="w-full p-2 border rounded-md shadow-sm"
            required
          />
        </div>

        {/* Carrier Company Phones */}
        <div>
          <label className="block text-sm font-medium">Carrier Company Phones:</label>
          {formData.carrier_company_phone.map((phone, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => handleArrayChange(e, 'carrier_company_phone', index)}
                className="w-full p-2 border rounded-md shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => removeArrayField('carrier_company_phone', index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('carrier_company_phone')}
            className="text-blue-500 mt-2"
          >
            Add Phone
          </button>
        </div>

        <div>
          <label htmlFor="driver_name" className="block text-sm font-medium">Driver Name:</label>
          <input
            type="text"
            name="driver_name"
            value={formData.driver_name}
            onChange={handleChange}
            id="driver_name"
            className="w-full p-2 border rounded-md shadow-sm"
            required
          />
        </div>

        {/* Driver Phones */}
        <div>
          <label className="block text-sm font-medium">Driver Phones:</label>
          {formData.driver_phone.map((phone, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => handleArrayChange(e, 'driver_phone', index)}
                className="w-full p-2 border rounded-md shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => removeArrayField('driver_phone', index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('driver_phone')}
            className="text-blue-500 mt-2"
          >
            Add Phone
          </button>
        </div>

        {/* Carrier MC Number */}
        <div>
          <label htmlFor="carrier_mc_num" className="block text-sm font-medium">Carrier MC Number:</label>
          <input
            type="text"
            name="carrier_mc_num"
            value={formData.carrier_mc_num}
            onChange={handleChange}
            id="carrier_mc_num"
            className="w-full p-2 border rounded-md shadow-sm"
            required
          />
        </div>

        {/* Routes Section */}
        <div className="my-8">
          <h2 className="text-2xl font-semibold mb-4">Routes</h2>
          {formData.carrier_routes.map((route, index) => (
            <div key={index} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Route Name:</label>
                <input
                  type="text"
                  name="route_name"
                  value={route.route_name}
                  onChange={(e) => handleRouteChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">States Covered:</label>
                <select
                  name="states_covered"
                  onChange={(e) => handleRouteChange(index, e)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  value=""
                >
                  <option value="">Select State</option>
                  {statesList.map((state, i) => (
                    <option key={i} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap space-x-2 mt-2">
                {route.states_covered.map((state, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full"
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({
              ...formData,
              carrier_routes: [...formData.carrier_routes, { route_name: '', states_covered: [] }]
            })}
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Route
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Create Carrier
        </button>
      </form>
    </div>
    </div>
  );
};

export default withAuth(CreateCarrierPage);
