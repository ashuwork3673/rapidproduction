// Your existing imports and hooks
"use client"; // Mark as a client-side component
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLoadScript } from "@react-google-maps/api"; // Import the hook here
import "@/styles/Form.css";

function DashboardForm() {
  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState("");
  
  const date = new Date();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    ship_form: "",
    ship_to: "",
    transport_method: "",
    year: "",
    make: "",
    model: "",
    sourceUrl: "from Form Quote",
    vehicle_type: "", // Updated to store vehicle type
    distance: distance,
    added_on: date.toLocaleString(),
    status: "Done",
    note: "",
    note_time: "",
    price: "",
    pickup_id: "",
    pickup_date: toString(""),
  });

  const [errors, setErrors] = useState({});
  const shipFromRef = useRef(null);
  const shipToRef = useRef(null);

  // Loading script from Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDJKp5HjtKF7eL-zbWvIFLtBa51tua1fzw", // Replace with your actual API Key
    libraries: ["places"],
  });

  const makeModelOptions = {
    Toyota: ["Camry", "Corolla", "RAV4"],
    Honda: ["Civic", "Accord", "CR-V"],
    Ford: ["F-150", "Mustang", "Explorer"],
    Chevrolet: ["Malibu", "Silverado", "Equinox"],
    BMW: ["X5", "3 Series", "X7"],
  };

  const handleMakeChange = (e) => {
    handleChange(e);
    // Reset model when make changes
    setFormData((prevData) => ({
      ...prevData,
      model: "",
    }));
  };

  const getModelsForMake = (make) => {
    return makeModelOptions[make] || [];
  };

  useEffect(() => {
    if (!isLoaded) return; // Wait until the Google Maps API is loaded

    const shipFromAutocomplete = new window.google.maps.places.Autocomplete(
      shipFromRef.current,
      { types: ["geocode"] }
    );
    shipFromAutocomplete.addListener("place_changed", () => {
      const place = shipFromAutocomplete.getPlace();
      setFormData((prevData) => ({
        ...prevData,
        ship_form: place.formatted_address,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, ship_form: "" }));
    });

    const shipToAutocomplete = new window.google.maps.places.Autocomplete(
      shipToRef.current,
      { types: ["geocode"] }
    );
    shipToAutocomplete.addListener("place_changed", () => {
      const place = shipToAutocomplete.getPlace();
      setFormData((prevData) => ({
        ...prevData,
        ship_to: place.formatted_address,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, ship_to: "" }));
    });
  }, [isLoaded]);

  useEffect(() => {
    if (formData.ship_form && formData.ship_to) {
      calculateDistance();
    }
  }, [formData.ship_form, formData.ship_to]);

  const calculateDistance = () => {
    if (formData.ship_form && formData.ship_to) {
      const distanceMatrixService =
        new window.google.maps.DistanceMatrixService();

      distanceMatrixService.getDistanceMatrix(
        {
          origins: [formData.ship_form],
          destinations: [formData.ship_to],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK) {
            // Check if the response has valid rows and elements
            if (
              response.rows[0] &&
              response.rows[0].elements[0] &&
              response.rows[0].elements[0].distance
            ) {
              const distanceInMeters =
                response.rows[0].elements[0].distance.value;
              const distanceInMiles = (distanceInMeters / 1609.34).toFixed(2);
              setDistance(`${distanceInMiles} miles`);
              setFormData((prevData) => ({
                ...prevData,
                distance: `${distanceInMiles} miles`,
              }));
            } else {
              setDistance("");
              setFormData((prevData) => ({ ...prevData, distance: "" }));
            }
          } else if (
            status === window.google.maps.DistanceMatrixStatus.ZERO_RESULTS
          ) {
            alert("No route found between the origin and destination.");
            setDistance("");
            setFormData((prevData) => ({ ...prevData, distance: "" }));
          } else {
            console.error(`Error fetching distance: ${status}`, response);
            alert(`Could not fetch distance: ${status}`);
            setDistance("");
            setFormData((prevData) => ({ ...prevData, distance: "" }));
          }
        }
      );
    } else {
      alert("Please enter both origin and destination.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = formatPhoneNumber(numericValue);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const formatPhoneNumber = (number) => {
    if (number.length <= 3) {
      return `(${number}`;
    } else if (number.length <= 6) {
      return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    } else {
      return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(
        6,
        10
      )}`;
    }
  };

  const validateStep = () => {
    const newErrors = {};
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

    if (step === 1) {
      if (!formData.ship_form) newErrors.ship_form = "Ship From is required";
      if (!formData.ship_to) newErrors.ship_to = "Ship To is required";
      if (!formData.transport_method)
        newErrors.transport_method = "Transport method is required";
    }
    if (step === 2) {
      if (!formData.year) newErrors.year = "Year is required";
      else if (!/^\d{4}$/.test(formData.year))
        newErrors.year = "Year must be a 4-digit number";
      if (!formData.make) newErrors.make = "Make is required";
      if (!formData.model) newErrors.model = "Model is required";
      if (!formData.vehicle_type)
        newErrors.vehicle_type = "Vehicle type is required";
    }
    if (step === 3) {
      if (!formData.username) newErrors.username = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!phoneRegex.test(formData.phone))
        newErrors.phone = "Invalid phone format (use: (123) 456-7890)";
      if (!formData.pickup_date)
        newErrors.pickup_date = "Pickup date is required";
    }
    return newErrors;
  };

  const nextStep = () => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if the distance is not calculated

    // Ensure the form data has the latest distance value
    const finalFormData = { ...formData, distance };

    const sourceUrl = document.referrer || window.location.href;
    const dataToSubmit = { ...finalFormData, sourceUrl };

    console.log("Form data before submit:", dataToSubmit); // Log form data before submission

    try {
      const response = await axios.post(
        "http://localhost:5000/api/form",
        dataToSubmit
      );
      console.log("Form submitted successfully:", response);
      window.location.href = "/Thanku";
      // Increment quote_id after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again later.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      {step === 1 && (
        <div className="sm:max-w-lg mx-auto p-4 sm:p-6 bg-gray-900 rounded-lg shadow-lg">
          {/* Shipping Information */}
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="ship_form"
              >
                Ship From:
              </label>
              <input
                ref={shipFromRef}
                type="text"
                name="ship_form"
                id="ship_form"
                value={formData.ship_form}
                onChange={handleChange}
                placeholder="Enter Ship From"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              />
              {errors.ship_form && (
                <span className="text-red-500">{errors.ship_form}</span>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="ship_to"
              >
                Ship To:
              </label>
              <input
                ref={shipToRef}
                type="text"
                name="ship_to"
                id="ship_to"
                value={formData.ship_to}
                onChange={handleChange}
                placeholder="Enter Ship To"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              />
              {errors.ship_to && (
                <span className="text-red-500">{errors.ship_to}</span>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="transport_method"
              >
                Transport Method:
              </label>
              <select
                name="transport_method"
                id="transport_method"
                value={formData.transport_method}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              >
                <option value="">Select Method</option>
                <option value="Open Transport">Open Transport</option>
                <option value="Enclosed Transport">Enclosed Transport</option>
              </select>
              {errors.transport_method && (
                <span className="text-red-500">{errors.transport_method}</span>
              )}
            </div>

            <button
              onClick={nextStep}
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-full sm:max-w-lg mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
          {/* Vehicle Information */}
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="year"
              >
                Year:
              </label>
              <input
                type="text"
                name="year"
                id="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Enter Year"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              />
              {errors.year && (
                <span className="text-red-500">{errors.year}</span>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="make"
              >
                Make:
              </label>
              <select
                name="make"
                id="make"
                value={formData.make}
                onChange={handleMakeChange}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              >
                <option value="">Select Make</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="BMW">BMW</option>
              </select>
              {errors.make && (
                <span className="text-red-500">{errors.make}</span>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="model"
              >
                Model:
              </label>
              <select
                name="model"
                id="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
                disabled={!formData.make} // Disable model dropdown if no make is selected
              >
                <option value="">Select Model</option>
                {getModelsForMake(formData.make).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              {errors.model && (
                <span className="text-red-500">{errors.model}</span>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="vehicle_type"
              >
                Vehicle Type:
              </label>
              <select
                name="vehicle_type"
                id="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="Running">Running</option>
                <option value="Not Running">Not Running</option>
              </select>
              {errors.vehicle_type && (
                <span className="text-red-500">{errors.vehicle_type}</span>
              )}
            </div>

            <button
              onClick={nextStep}
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-full sm:max-w-lg mx-auto p-4 sm:p-6 bg-gray-900 text-white rounded-lg shadow-lg">
          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="username"
              >
                Name:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Name"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              />
              {errors.username && (
                <span className="text-red-500">{errors.username}</span>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              />
              {errors.email && (
                <span className="text-red-500">{errors.email}</span>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="phone"
              >
                Phone Number:
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              />
              {errors.phone && (
                <span className="text-red-500">{errors.phone}</span>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="pickup_date"
              >
                Pickup Date:
              </label>
              <input
                type="date"
                name="pickup_date"
                id="pickup_date"
                value={formData.pickup_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-black placeholder:text-black focus:text-black focus:outline-none"
              />
              {errors.pickup_date && (
                <span className="text-red-500">{errors.pickup_date}</span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardForm;
