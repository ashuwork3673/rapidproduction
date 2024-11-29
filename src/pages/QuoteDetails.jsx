import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import "../app/globals.css";
import Sidebar from "@/Component/Sidebar";
import SelectCarriers from "@/Component/SelectCarrier";
import CreateCarrierPage from "./CreateCarrierPage";
import withAuth from "@/Component/withAuth";

const QuoteDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [username, setUsername] = useState("");
  const [femail, setFEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ship_from, setShipFrom] = useState("");
  const [ship_to, setShipTo] = useState("");
  const [car, setCar] = useState({
    make: "",
    transport_method: "",
    model: "",
    vehicle_type: "",
    year: "",
  }); // To hold new car data

  const [transport_method, setTransportMethod] = useState("");
  const [year, setYear] = useState("");
  const [newCard, setNewCard] = useState({
    quote_id: "",
    card_name: "",
    card_number: "",
    card_expiry: "",
    card_cvv: "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",
  });
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [vechile_type, setVechileType] = useState("");
  const [pickup_date, setPickupDate] = useState("");
  const [pickupId, setPickupId] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDModalOpen, setIsDModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Add New Carrier");
  const [editableForm, setEditableForm] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const makeModelOptions = {
    Toyota: ["Camry", "Corolla", "RAV4"],
    Honda: ["Civic", "Accord", "CR-V"],
    Ford: ["F-150", "Mustang", "Explorer"],
    Chevrolet: ["Malibu", "Silverado", "Equinox"],
    BMW: ["X5", "3 Series", "X7"],
  };

  const [email, setEmail] = useState({
    to: "",
    subject: "Your Quote Details",
    message: "",
  });
  const [Demail, setDEmail] = useState({
    to: "",
    subject: "Driver Confirm ",
    message: "",
  });
  const [cardDetails, setCardDetails] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [CarrierDetails, setCarrierDetails] = useState(null);
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);
  const [nusername, setNUsername] = useState(""); // State to store username

  // Handle input changes for car fields
  const handleCarChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, [name]: value });
  };

  // Add a new car
  const handleAddCar = async () => {
    if (
      !car.make.trim() ||
      !car.transport_method.trim() ||
      !car.model.trim() ||
      !car.vehicle_type.trim() ||
      !car.year.trim()
    ) {
      alert("Please fill all car fields.");
      return;
    }

    try {
      const updatedData = {
        ...form,
        cars: [...(form.cars || []), car], // Append the new car to the cars array
      };

      // Update the form in the database
      await axios.put(`http://localhost:5000/api/form/${id}`, updatedData);

      // Update the local state to reflect the change
      setForm(updatedData);
      setCar({
        make: "",
        transport_method: "",
        model: "",
        vehicle_type: "",
        year: "",
      }); // Clear input fields
      alert("Car added successfully");
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Failed to add the car. Please try again.");
    }
  };

  const deleteCar = async (carIndex) => {
    try {
      // Create a new array of cars without the deleted car
      const updatedCars = form.cars.filter((_, index) => index !== carIndex);

      // Make the API call to update the cars array on the server
      const response = await axios.patch(
        `http://localhost:5000/api/form/update-cars/${form.quote_id}`,
        { cars: updatedCars }
      );

      if (response.status === 200) {
        alert("Car deleted successfully!");
        // Update the form state with the new cars array
        setForm((prevForm) => ({ ...prevForm, cars: updatedCars }));
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car. Please try again.");
    }
  };

  const openModal = () => {
    setIsCardModalOpen(true);
    const fetchCardDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/card");
        const matchedCard = response.data.find(
          (card) => card.quote_id === form.quote_id
        );
        if (matchedCard) {
          setCardDetails(matchedCard);
          setIsCardModalOpen(true);
        } else {
          alert("No matching card found for this quote.");
        }
      } catch (error) {
        console.error("Error fetching card details:", error);
      }
    };
    fetchCardDetails();
  };

  const closeModal = () => {
    setIsCardModalOpen(false);
  };

  const handleCardChange = (e) => {
    setNewCard({ ...newCard, [e.target.name]: e.target.value });
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting card:", newCard);
    try {
      const response = await fetch("http://localhost:5000/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });
      console.log("Response Status:", response.status);
      if (response.ok) {
        const savedCard = await response.json();
        console.log("Saved Card:", savedCard);
        setCardDetails(savedCard);
      } else {
        const errorDetails = await response.json();
        console.error("Error saving card details:", errorDetails);
      }
    } catch (error) {
      console.error("Error submitting card details:", error);
    }
  };

  const getModelsForMake = (make) => {
    return makeModelOptions[make] || [];
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setNUsername(parsedUser.username || "Unknown");
    }
  }, []);

  const handleAddNote = async () => {
    if (!note.trim()) {
      alert("Please enter a valid note.");
      return;
    }

    const newNote = {
      username: nusername, // Replace with the dynamic user if applicable
      note_content: note,
      note_time: new Date().toISOString(),
    };

    try {
      const updatedData = {
        ...form,
        notes: [...(form.notes || []), newNote], // Append new note to the existing notes
      };

      // Update the form in the database
      await axios.put(`http://localhost:5000/api/form/${id}`, updatedData);

      // Update the local state to reflect the change
      setForm(updatedData);
      setNote(""); // Clear the input
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add the note. Please try again.");
    }
  };

  useEffect(() => {
    if (id) {
      const fetchFormDetails = async () => {
        try {
          const formResponse = await axios.get(
            `http://localhost:5000/api/form/${id}`
          );
          setForm(formResponse.data);
          setNewCard((prevFormData) => ({
            ...prevFormData,
            quote_id: formResponse.data.quote_id,
          }));
          setEmail((prevEmail) => ({
            ...prevEmail,
            to: formResponse.data.email,
            message: `
            <div style="width:100%; margin: 0 auto;  border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9 ; ">
        <div style="background-color:#ff5722; display: flex; justify-content: center; align-items: center;" >
        <div style="width:40%;margin:auto"><img  style=" display: flex; justify-content: center; align-items: center;width:100%"   src="https://rapidautoshipping.com/assets/images/Untitled-1-Recovered.png"/></div>
        </div>
        <DIV style="padding:20px;">
        <p style="color: #333;font-size: 28px;">Hello <strong>Mr. ${
          formResponse.data.username
        },</strong></p>
        <p  style="color: #333;font-size: 20px;">Quote Id: <strong> ${
          formResponse.data.quote_id
        }</strong></p>

        <p style="font-size: 20px; line-height: 1.5;">We are pleased to notify you that on <strong> ${new Date(
          formResponse.data.pickup_date
        ).toLocaleDateString()}</strong>, a trailer will be available close to your pick-up location in ${
              formResponse.data.ship_form
            }. Since this is one of our popular routes and we transport vehicles almost daily, you can be confident that it will be handled by an experienced driver. To confirm your bookings, please call our toll-free number, <strong>(833) 233-4447</strong>. Alternatively, click the link below to reserve your space in advance of pricing changes.</p>
        
        <p style="text-align: center; display: flex; justify-content: flex-start; align-items: start;">
            <a href="http://localhost:3000/CardForm" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click for Reservations</a>
        </p>

        <p style="font-size: 20px; line-height: 1.5;">We understand that the 1st available date to pick up your 2024 AM General Hummer is <strong>  ${new Date(
          formResponse.data.pickup_date
        ).toLocaleDateString()}</strong>. Below you will find the details of your shipment, please review the information carefully. If there is anything we need to correct, please reach out to one of our agents.</p>

        <h3 style="font-size: 23PX;">1. Shipper Information</h3>
        <p  style="font-size: 20PX;"><strong>Name:</strong> ${
          formResponse.data.username
        }</p>
         <p  style="font-size: 20PX;"><strong>Phone 1:</strong> ${
           formResponse.data.phone
         }</p>
         <p  style="font-size: 20PX;"><strong>Phone 2:</strong> N/A</p>
         <p  style="font-size: 20PX;"><strong>Address:</strong> ${
           formResponse.data.ship_form
         }</p>
         <p  style="font-size: 20PX;"><strong>Country:</strong> USA</p>
         <p  style="font-size: 20PX;"><strong>Email:</strong> ${
           formResponse.data.email
         }</p>
        <P style="color: black; font-size: 25PX; font-weight: 900;" >============================</P>
        <h3>2. Pricing and Shipping</h3>
         <p  style="font-size: 20PX;"><strong>Order Number:</strong> RAS ${
           formResponse.data.quote_id
         }</p>
         <p  style="font-size: 20PX;"><strong>Total Price:</strong> ${
           formResponse.data.price
         } (incl. 100% Insurance)</p>
         <p  style="font-size: 20PX;"><strong>1st Available Date:</strong> 2024-11-15</p>
         <p  style="font-size: 20PX;"><strong>Ship Via:</strong> ${
           formResponse.data.transport_method
         }</p>
         <p  style="font-size: 20PX;"><strong>Vehicle(s) Status: ${
           formResponse.data.status
         }</strong> ${formResponse.vehicle_type}</p>

        <h3>3. Location Details Origin</h3>
         <p  style="font-size: 20PX;"><strong>Name:</strong> ${
           formResponse.data.username
         }</p>
         <p  style="font-size: 20PX;"><strong>Phone 1:</strong> ${
           formResponse.data.phone
         }</p>
         <p  style="font-size: 20PX;"><strong>Phone 2:</strong> N/A</p>
         <p  style="font-size: 20PX;"><strong>Address:</strong> ${
           formResponse.data.ship_form
         }</p>
         <p  style="font-size: 20PX;"><strong>Country:</strong> USA</p>
         <p  style="font-size: 20PX;"><strong>Email:</strong> ${
           formResponse.data.email
         }</p>

        <h3>4. Destination</h3>
         <p  style="font-size: 20PX;"><strong>Name:</strong> ${
           formResponse.data.username
         }</p>
         <p  style="font-size: 20PX;"><strong>Company:</strong> N/A</p>
         <p  style="font-size: 20PX;"><strong>Phone:</strong> ${
           formResponse.data.phone
         }</p>
         <p  style="font-size: 20PX;"><strong>Address:</strong> ${
           formResponse.data.ship_to
         }</p>
         <p  style="font-size: 20PX;"><strong>Country:</strong> USA</p>
         <p  style="font-size: 20PX;"><strong>Email:</strong> ${
           formResponse.data.email
         }</p>

        <p style="text-align: center; display: flex; justify-content: flex-start; align-items: start;">
            <a href="http://localhost:3000/CardForm" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click for Reservations</a>
        </p>

         <p  style="font-size: 20PX;">If you have any questions, feel free to reach out to us at <strong>info@rapidautoshipping.com</strong>. We are here to answer your questions from 7 AM to 5 PM Central Time.</p>

         <p  style="font-size: 20PX;">Sincerely,<br>
        <strong>Rapid Auto Shipping</strong><br>
        Toll-Free Number: <strong>+1 833-233-4447</strong></p>
        </DIV>


     <div style=display:flex;align-items:center;justify-content:center;margin:auto;><div style=display:flex;align-items:center;justify-content:center;margin:auto;gap:3%;><a href=https://www.facebook.com/Rapidautoshipping target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/facebook-icon.webp></a><a href=https://www.instagram.com/rapidautoshipping target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/instagram-icon.png></a><a href=https://www.linkedin.com/in/rapidautoshipping/ target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/linkedin-icon.webp></a><a href=https://www.youtube.com/@rapidautoshipping9439 target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/yt.png></a></div></div>
    </div>
            `,
          }));
          setDEmail((prevEmail) => ({
            ...prevEmail,
            to: formResponse.data.email,
            message: `
             <table style=width:100%;color:#000;font-size:20px><tr><th><div style=width:100%;height:150px;background-color:#ff4500;display:grid;justify-content:center;align-items:center><a href=https://rapidautoshipping.com><img src=https://rapidautoshipping.com/assets/images/Untitled-1-Recovered.png style=margin:auto width=350px></a></div><tr><td><tr><td style=padding:2%><h2 style=color:grey>Hello Mr ' ${
               formResponse.data.username
             }'</h2><p style=font-size:18px>We are happy to inform that a carrier has been assigned to pickup your <b>'${
              formResponse.data.year
            }' '${formResponse.data.make}' '${
              formResponse.data.model
            }'</b>Dispatcher will be in contact to arrange time for pickup/delivery.<div style=border-bottom:#000 1px solid><p style=font-size:18px;color:black><b>A Few Things to Keep in Mind</b><ul><li>The driver will be able to go as close to your address as safely/legally possible. Please inform dispatcher if you have a preferred location to meet.<li>Personal items are not allowed inside the vehicle during transit unless informed upon booking.<li>Any automatic toll booth device should be removed from the car so that you won\'t get charged extra.<li>Pickup/Delivery dates are estimated and not guaranteed as truckers can run into delays due to traffic, detours, weather, mandatory rest stops, weight station check-ups/police inspections, truck breakdowns, etc.</ul></div><div style=border-bottom:#000 1px solid><p style=font-size:18px>Estimated Pickup Date:<b>' ${new Date(
              formResponse.data.pickup_date
            ).toLocaleDateString()}'</b><p style=font-size:18px>Estimated Delivery Date:<b>'${new Date(
              formResponse.data.pickup_date
            ).toLocaleDateString()}'</b></div><div style=border-bottom:#000 1px solid><p style=font-size:18px>Driver Name:<p style=font-size:18px>Driver Phone:#<p style=font-size:18px></div><div style=border-bottom:#000 1px solid><p style=font-size:18px><br><b>Total Amount: '${
              formResponse.data.price
            }'</b><li style=margin-top:1%><b>Booking Amount Received: $0</b><li style=margin-top:1%><b>Amount to be Paid : '${
              formResponse.data.price
            }'</b> ( Click <b>Pay Now</b> and make the payment.)<ul><li style=margin-top:1%><a href='${
              formResponse.data.payement_url
            }'><button style=border:0;width:100px;height:40px;border-radius:5px;background:green;color:white;cursor:pointer>Pay Now</button></a></li><li style=margin-top:1%><b>Balance to be Paid to Driver: '${
              formResponse.data.price
            }'</b>  (Note: Driver Amount has to be paid in Cash, Cashier Check, Money Order)</ul><br></div><div style=border-bottom:#000 1px solid><div style=display:flex><ul style=list-style-type:none;font-size:18px><li style=margin-top:1%><li style=margin-top:1%> Phone:<b>+1 (833) 233-4447</b></li><li style=margin-top:1%> Email:<b>info@rapidautoshipping.com</b></li></ul><div><p style=font-size:18px;margin-left:45%>WE ARE HERE TO ANSWER YOUR QUESTIONS FROM 7 AM TO 5 PM CENTRAL TIME. WE LOOK FORWARD TO HEARING FROM YOU.</div></div></div><div style=border-bottom:#000 1px solid><p style=font-size:18px>Sincerely,<p style=font-size:18px>Rapid Auto Shipping</p><a href=https://rapidautoshipping.com/ >rapidautoshipping.com</a><p>+1 (833) 233-4447</div><div style=display:flex;align-items:center;justify-content:center;margin:auto;><div style=display:flex;align-items:center;justify-content:center;margin:auto;gap:3%;><a href=https://www.facebook.com/Rapidautoshipping target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/facebook-icon.webp></a><a href=https://www.instagram.com/rapidautoshipping target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/instagram-icon.png></a><a href=https://www.linkedin.com/in/rapidautoshipping/ target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/linkedin-icon.webp></a><a href=https://www.youtube.com/@rapidautoshipping9439 target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/yt.png></a></div></div></div></table>
            `,
          }));
        } catch (error) {
          console.error("Error fetching form details:", error);
        }
      };
      fetchFormDetails();
    }
  }, [id]);

  const handleButtonClick = () => {
    if (!isDivVisible) {
      setIsDivVisible(true); // Show the new div
      setButtonText("Close"); // Change button text to "Cut"
    } else {
      setIsDivVisible(false); // Hide the div
      setButtonText("Add New Carrier"); // Change button text back to "Add New Carrier"
    }
  };

  const fetchCarrierDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/selected_carrier"
      );
      const matchedCarrier = response.data.find(
        (Carrier) => Carrier.quote_id === form.quote_id
      );
      if (matchedCarrier) {
        setCarrierDetails(matchedCarrier);
        setIsCarrierModalOpen(true);
      } else {
        alert("No matching Carrier found for this quote.");
      }
    } catch (error) {
      console.error("Error fetching Carrier details:", error);
    }
  };

  useEffect(() => {});

  const fetchCardDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/card");
      const matchedCard = response.data.find(
        (card) => card.quote_id === form.quote_id
      );
      if (matchedCard) {
        setCardDetails(matchedCard);
        setIsCardModalOpen(true);
      } else {
        alert("No matching card found for this quote.");
      }
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableForm({ ...editableForm, [name]: value });
  };

  const handleUpdateForm = async () => {
    try {
      // Prepare the updated data, fallback to the existing `form` values if not changed
      const updatedData = {
        username: username || form.username,
        email: femail || form.email,
        phone: phone || form.phone,
        pickup_date: pickup_date || form.pickup_date,
        ship_form: ship_from || form.ship_form,
        ship_to: ship_to || form.ship_to,
        transport_method: transport_method || form.transport_method,
        year: year || form.year,
        make: make || form.make,
        model: model || form.model,
        vehicle_type: vechile_type || form.vehicle_type,
        pickup_id: pickupId || form.pickup_id,
        payment_url: paymentUrl || form.payment_url,
        price: price || form.price,
        status: status || form.status,
        // Update the notes array: append the new note if provided
      };

      // Axios PUT request to update the form
      await axios.put(`http://localhost:5000/api/form/${id}`, updatedData);

      alert("Form updated successfully");
      setNote(""); // Clear the note input after updating
      window.location.reload(); // Refresh to reflect changes (if necessary)
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  const handleSendEmail = async () => {
    const emailPayload = {
      to: email.to,
      subject: email.subject,
      message: email.message,
    };

    try {
      await axios.post("http://localhost:5000/api/send-email", emailPayload);
      alert("Email sent successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  const handleSendDEmail = async () => {
    const emailPayload = {
      to: Demail.to,
      subject: Demail.subject,
      message: Demail.message,
    };

    try {
      await axios.post("http://localhost:5000/api/send-email", emailPayload);
      alert("Email sent successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  if (!form)
    return <div className="text-center text-gray-600 py-10">Loading...</div>;

  return (
    <div className="flex  overflow-auto">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div class="sm:flex w-full mt-20">
        <div className="p-6 w-full sm:w-3/5 h-auto ">
          <div className="border-2 border-black  ">
            {/* Left Column */}
            <div className="left-column">
              <div className="sm:flex w-full justify-between border-b  border-gray-800 gap-5 ">
                <div className=" w-full p-3 sm:w-6/12 flex justify-between border-b  border-gray-800 sm:border-none">
                  <span className="font-semibold text-base text-gray-600">
                    Quote ID:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.quote_id}
                  </span>
                </div>
                <div className=" flex p-3  w-full sm:w-6/12 justify-between">
                  {" "}
                  <span className="font-semibold text-base text-gray-600">
                    Name:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.username}
                  </span>
                </div>
              </div>

              <div className="sm:flex w-full justify-between border-b  border-gray-800 gap-5  ">
                <div className="  w-full p-3 sm:w-6/12 flex justify-between border-b  border-gray-800 sm:border-none">
                  <span className="font-semibold text-base text-gray-600">
                    Email:
                  </span>
                  <span
                    className="text-black-800 font-semibold  truncate max-w-[60%] text-base"
                    title={form.email} // Full email shown on hover
                  >
                    {form.email}
                  </span>
                </div>
                <div className=" flex p-3  w-full sm:w-6/12 justify-between">
                  {" "}
                  <span className="font-semibold text-base text-gray-600">
                    Phone:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.phone}
                  </span>
                </div>
              </div>

              <div className="sm:flex w-full justify-between border-b  border-gray-800 gap-5  ">
                <div className="  w-full p-3 sm:w-6/12 flex justify-between border-b  border-gray-800 sm:border-none">
                  <span className="font-semibold text-base text-gray-600">
                    Shipping From:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.ship_form}
                  </span>
                </div>
                <div className=" flex p-3 w-full sm:w-6/12 justify-between">
                  {" "}
                  <span className="font-semibold text-base text-gray-600">
                    Shipping To:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.ship_to}
                  </span>
                </div>
              </div>

              <div className="sm:flex w-full justify-between border-b  border-gray-800 gap-5">
                <div className="  w-full p-3 sm:w-6/12 flex justify-between border-b  border-gray-800 sm:border-none">
                  <span className="font-semibold text-base text-gray-600">
                    Transport Method:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.transport_method}
                  </span>
                </div>

                <div className=" flex p-3  w-full sm:w-6/12 justify-between">
                  <span className="font-semibold text-base text-gray-600">
                    IP Address:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.ip}
                  </span>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="right-colum">
              <div className="sm:flex w-full justify-between border-b  border-gray-800 gap-5  ">
                <div className="  w-full p-3 sm:w-6/12 flex justify-between border-b  border-gray-800 sm:border-none ">
                  <span className="font-semibold text-base  text-gray-600">
                    Year:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.year}
                  </span>
                </div>
                <div className=" flex  w-full p-3 sm:w-6/12 justify-between ">
                  <span className="font-semibold text-base text-gray-600">
                    Make:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.make}
                  </span>
                </div>
              </div>
              <div className="sm:flex w-full justify-between border-b  border-gray-800 gap-5 ">
                <div className=" w-full p-3 sm:w-6/12 flex justify-between border-b  border-gray-800 sm:border-none">
                  <span className="font-semibold text-base text-gray-600">
                    Model:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.model}
                  </span>
                </div>
                <div className=" flex p-3 w-ful sm:w-6/12 justify-between">
                  <span className="font-semibold text-base text-gray-600">
                    Vehicle Type:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.vehicle_type}
                  </span>
                </div>
              </div>

              <div className="sm:flex w-full justify-between border-b  border-gray-800 gap-5  ">
                <div className=" w-full p-3 sm:w-6/12 flex justify-between border-b  border-gray-800 sm:border-none">
                  <span className="font-semibold text-base text-gray-600">
                    Pickup Date:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {new Date(form.pickup_date).toLocaleDateString()}
                  </span>
                </div>
                <div className=" flex p-3 w-ful sm:w-6/12 justify-between">
                  <span className="font-semibold text-base text-gray-600">
                    Distance:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    {form.distance}
                  </span>
                </div>
              </div>
              <div className="sm:flex w-full justify-between border-b  border-gray-800 gap-5 ">
                <div className="  w-full p-3 sm:w-6/12 flex justify-between border-b  border-gray-800 sm:border-none">
                  <span className="font-semibold text-base text-gray-600">
                    Price:
                  </span>
                  <span className="text-black-800 font-semibold  text-base">
                    $ {form.price}
                  </span>
                </div>
                <div className=" p-3   flex w-ful sm:w-6/12 justify-between">
                  <span className="font-semibold text-base text-gray-600">
                    Source Url:
                  </span>
                  <span
                    className="text-black-800 font-semibold  truncate max-w-[60%]  text-base"
                    title={form.sourceUrl} // Full email shown on hover
                  >
                    {form.sourceUrl}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 space-y-4">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-600">Pickup ID</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={pickupId || form.pickup_id}
                  onChange={(e) => setPickupId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter Pickup ID"
                />
                <button
                  onClick={handleUpdateForm}
                  className="bg-green-500 text-white p-2 rounded ml-2"
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-600">Payment URL</label>
              <div className="flex items-center">
                <input
                  type="url"
                  value={paymentUrl || form.payment_url}
                  onChange={(e) => setPaymentUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter Payment URL"
                />
                <button
                  onClick={handleUpdateForm}
                  className="bg-green-500 text-white p-2 rounded ml-2"
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-600">Price</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={price || form.price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter Price"
                />
                <button
                  onClick={handleUpdateForm}
                  className="bg-green-500 text-white p-2 rounded ml-2"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Status Radio Buttons */}
            <div className="mt-8 space-y-4">
              <label className="font-semibold text-gray-600">Status</label>
              <div className="flex flex-wrap items-center gap-4">
                <label>
                  <input
                    type="radio"
                    value="waiting"
                    checked={status === "waiting"}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mr-2"
                  />
                  Waiting
                </label>
                <label>
                  <input
                    type="radio"
                    value="in-progress"
                    checked={status === "in-progress"}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mr-2"
                  />
                  In-Progress
                </label>
                <label>
                  <input
                    type="radio"
                    value="Done"
                    checked={status === "Done"}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mr-2"
                  />
                  Done
                </label>
                <button
                  onClick={handleUpdateForm}
                  className="bg-green-500 text-white p-2 rounded ml-auto"
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              {/* Input Box for Adding Cars */}
              <h2 className="font-semibold text-gray-600 mb-2">Add a Car</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <select
                  name="make"
                  value={car.make}
                  onChange={handleCarChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Tesla">Tesla</option>
                  {/* Add more options as needed */}
                </select>

                {/* Transport Method dropdown */}
                <select
                  name="transport_method"
                  value={car.transport_method}
                  onChange={handleCarChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Transport Method</option>
                  <option value="Open">Open</option>
                  <option value="Enclosed">Enclosed</option>
                  <option value="Driveaway">Driveaway</option>
                  {/* Add more options as needed */}
                </select>

                {/* Model dropdown */}
                <select
                  name="model"
                  value={car.model}
                  onChange={handleCarChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Model</option>
                  <option value="Corolla">Corolla</option>
                  <option value="Civic">Civic</option>
                  <option value="Mustang">Mustang</option>
                  <option value="Model S">Model S</option>
                  {/* Add more options as needed */}
                </select>

                {/* Vehicle Type dropdown */}
                <select
                  name="vehicle_type"
                  value={car.vehicle_type}
                  onChange={handleCarChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  {/* Add more options as needed */}
                </select>

                {/* Year input */}
                <input
                  type="text"
                  name="year"
                  value={car.year}
                  onChange={handleCarChange}
                  className="p-2 border border-gray-300 rounded"
                  placeholder="Year"
                />
              </div>
              <button
                onClick={handleAddCar}
                className="bg-green-500 text-white p-2 rounded"
              >
                Add Car
              </button>

              {/* Display Cars */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-600 mb-2">Cars</h3>
                {form.cars && form.cars.length > 0 ? (
                  <ul className="space-y-2">
                    {form.cars.map((car, index) => (
                      <li
                        key={index}
                        className="p-2 border border-gray-300 rounded flex justify-between items-center"
                      >
                        <div className="grid grid-cols-5 gap-4">
                          <span>{car.make}</span>
                          <span>{car.transport_method}</span>
                          <span>{car.model}</span>
                          <span>{car.vehicle_type}</span>
                          <span>{car.year}</span>
                        </div>
                        <button
                          onClick={() => deleteCar(index)}
                          className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No cars added yet.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              {/* Input Box for Adding Notes */}
              <label className="font-semibold text-gray-600">Add a Note</label>
              <div className="flex items-center mb-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter Note"
                ></textarea>
                <button
                  onClick={handleAddNote}
                  className="bg-green-500 text-white p-2 rounded ml-2"
                >
                  Add Note
                </button>
              </div>

              {/* Display Notes */}
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">Notes</h3>
                {form.notes && form.notes.length > 0 ? (
                  <ul className="space-y-2">
                    {form.notes.map((note, index) => (
                      <li
                        key={index}
                        className="p-2 border border-gray-300 rounded"
                      >
                        <div className="flex justify-between items-center">
                          <span>{note.note_content}</span>
                          <span className="text-sm text-gray-500">
                            <b>{note.username} </b>
                            {new Date(note.note_time).toLocaleString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No notes added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center sm:justify-start">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white p-2 "
            >
              View Quote
            </button>
            <button
              onClick={() => setIsDModalOpen(true)}
              className="bg-blue-500 text-white p-2"
            >
              Driver Confirm
            </button>

            <button onClick={openModal} className="bg-blue-500 text-white p-2 ">
              View Card Details
            </button>
            <button
              onClick={fetchCarrierDetails}
              className="bg-blue-500 text-white p-2"
            >
              Carriers Details
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-500 text-white p-2"
            >
              Update
            </button>
          </div>
        </div>

        {/* New Container */}
        <div className="w-full sm:w-2/5 p-6 h-auto">
          <button
            className="bg-blue-500 text-white p-2 rounded w-40 mb-4"
            onClick={handleButtonClick}
          >
            {buttonText}
          </button>
          <div>
            {isDivVisible && (
              <div className="border border-gray-300 p-4 rounded shadow mt-2 overflow-auto">
                {/* New div content */}
                <CreateCarrierPage />
              </div>
            )}
          </div>
          <SelectCarriers quote_id={form.quote_id} />
        </div>
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[800px] max-h-[80vh] overflow-y-auto">
            <h2>Edit Quote Details</h2>

            {/* Editable Form */}
            <div>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={username || form.username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="text"
                  value={femail || form.email}
                  onChange={(e) => setFEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={phone || form.phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Ship From</label>
                <input
                  type="text"
                  value={ship_from || form.ship_form}
                  onChange={(e) => setShipFrom(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Ship To</label>
                <input
                  type="text"
                  value={ship_to || form.ship_to}
                  onChange={(e) => setShipTo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Transport Method</label>
                <input
                  type="text"
                  value={transport_method || form.transport_method}
                  onChange={(e) => setTransportMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Year</label>
                <input
                  type="text"
                  value={year || form.year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Make</label>
                <input
                  type="text"
                  value={make || form.make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Model</label>
                <input
                  type="text"
                  value={model || form.model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Vechile Type</label>
                <input
                  type="text"
                  value={vechile_type || form.vehicle_type}
                  onChange={(e) => setVechileType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>Pickup Date</label>
                <input
                  type="text"
                  value={pickup_date || form.pickup_date}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Add more editable fields here... */}

              {/* Update Button */}
              <button
                onClick={handleUpdateForm}
                className="bg-green-500 text-white p-2 rounded"
              >
                Update Form
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="ml-2 bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Card Details */}
      {isCardModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[800px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {cardDetails ? "Card Details" : "Add Card Details"}
            </h2>

            {/* If card details exist, display them; otherwise show the form */}
            {cardDetails ? (
              <div className="space-y-4">
                <div>
                  <strong>Quote ID:</strong> {cardDetails.quote_id}
                </div>
                <div>
                  <strong>Card Holder Name:</strong> {cardDetails.card_name}
                </div>
                <div>
                  <strong>Card Number:</strong> {cardDetails.card_number}
                </div>
                <div>
                  <strong>Expiration Date:</strong> {cardDetails.card_expiry}
                </div>
                <div>
                  <strong>CVV:</strong> {cardDetails.card_cvv}
                </div>
                <div>
                  <strong>Billing Address:</strong>{" "}
                  {cardDetails.billing_address}
                </div>
                <div>
                  <strong>Billing City:</strong> {cardDetails.billing_city}
                </div>
                <div>
                  <strong>Billing State:</strong> {cardDetails.billing_state}
                </div>
                <div>
                  <strong>Billing Zip:</strong> {cardDetails.billing_zip}
                </div>
              </div>
            ) : (
              <form onSubmit={handleCardSubmit} className="space-y-4">
                {/* Form fields */}
                <div>
                  <label className="block">Quote ID:</label>
                  <input
                    type="text"
                    name="quote_id"
                    value={newCard.quote_id}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Card Holder Name:</label>
                  <input
                    type="text"
                    name="card_name"
                    value={newCard.card_name}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Card Number:</label>
                  <input
                    type="text"
                    name="card_number"
                    value={newCard.card_number}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Expiration Date:</label>
                  <input
                    type="text"
                    name="card_expiry"
                    value={newCard.card_expiry}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">CVV:</label>
                  <input
                    type="text"
                    name="card_cvv"
                    value={newCard.card_cvv}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Billing Address:</label>
                  <input
                    type="text"
                    name="billing_address"
                    value={newCard.billing_address}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Billing City:</label>
                  <input
                    type="text"
                    name="billing_city"
                    value={newCard.billing_city}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Billing State:</label>
                  <input
                    type="text"
                    name="billing_state"
                    value={newCard.billing_state}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Billing Zip:</label>
                  <input
                    type="text"
                    name="billing_zip"
                    value={newCard.billing_zip}
                    onChange={handleCardChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 bg-green-600 text-white rounded"
                >
                  Save Card
                </button>
              </form>
            )}

            <div className="mt-4">
              <button
                onClick={closeModal}
                className="ml-4 text-gray-600 py-2 px-6 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isCarrierModalOpen && CarrierDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[800px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selected Carrier Details
            </h2>

            {/* Display Selected Carrier Details */}
            <div className="space-y-4">
              <div>
                <strong>Carrier Name:</strong> {CarrierDetails.carrier_name}
              </div>
              <div>
                <strong>Carrier Phone:</strong>{" "}
                {CarrierDetails.carrier_company_phone}
              </div>
              <div>
                <strong>Carrier Email:</strong>{" "}
                {CarrierDetails.carrier_company_email}
              </div>
              <div>
                <strong>States Covered:</strong>
                {CarrierDetails.carrier_routes.map((route, idx) => (
                  <div key={idx}>
                    <strong>{route.route_name}:</strong>{" "}
                    {route.states_covered.join(" > ")}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setIsCarrierModalOpen(false)}
                className="ml-4 text-gray-600 py-2 px-6 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Email */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[800px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Send Quote Email
            </h2>
            <div className="mt-8 space-y-4">
              <label className="font-semibold text-gray-600">Message</label>
              <div
                contentEditable
                dangerouslySetInnerHTML={{ __html: email.message }}
                onInput={(e) =>
                  setEmail({ ...email, message: e.target.innerHTML })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Your message"
                style={{ minHeight: "150px" }}
              />
            </div>
            <button
              onClick={handleSendEmail}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Send Email
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-2 text-center w-full text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Modal for Email */}
      {isDModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[800px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Send Driver confirm mail
            </h2>
            <div className="mt-8 space-y-4">
              <label className="font-semibold text-gray-600">Message</label>
              <div
                contentEditable
                dangerouslySetInnerHTML={{ __html: Demail.message }}
                onInput={(e) =>
                  setEmail({ ...email, message: e.target.innerHTML })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Your message"
                style={{ minHeight: "150px" }}
              />
            </div>
            <button
              onClick={handleSendDEmail}
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Send Email
            </button>
            <button
              onClick={() => setIsDModalOpen(false)}
              className="mt-2 text-center w-full text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(QuoteDetails);
