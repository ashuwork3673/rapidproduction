import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import "../app/globals.css";
import Sidebar from "@/Component/Sidebar";
import SelectCarriers from "@/Component/SelectCarrier";
import CreateCarrierPage from "./CreateCarrierPage";

const QuoteDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [username, setUsername] = useState("");
  const [femail, setFEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ship_from, setShipFrom] = useState("");
  const [ship_to, setShipTo] = useState("");
  const [transport_method, setTransportMethod] = useState("");
  const [year, setYear] = useState("");
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
  const [email, setEmail] = useState({
    to: "",
    subject: "Your Quote Details",
    message: "",
  });
  const [Demail, setDEmail] = useState({
    to: "",
    subject: "Your Quote Details",
    message: "",
  });
  const [cardDetails, setCardDetails] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [CarrierDetails, setCarrierDetails] = useState(null);
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchFormDetails = async () => {
        try {
          const formResponse = await axios.get(
            `http://localhost:5000/api/form/${id}`
          );
          setForm(formResponse.data);
          setEmail((prevEmail) => ({
            ...prevEmail,
            to: formResponse.data.email,
            message: `
            <div style="width:100%; margin: 0 auto;  border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9 ; ">
        <div style="background-color:#ff5722; display: flex; justify-content: center; align-items: center;" >
        <div style="width:40%;margin:auto"><img  style=" display: flex; justify-content: center; align-items: center;width:100%"   src="https://rapidautoshipping.com/assets/images/Untitled-1-Recovered.png"/></div>
        </div>
        <DIV style="padding:20px;">
        <p style="color: #333;font-size: 28px;">Hello <strong>Mr. ${formResponse.data.username},</strong></p>
        <p  style="color: #333;font-size: 20px;">Quote Id: <strong> ${formResponse.data.quote_id}</strong></p>

        <p style="font-size: 20px; line-height: 1.5;">We are pleased to notify you that on <strong> ${formResponse.data.pickup_date}</strong>, a trailer will be available close to your pick-up location in ${formResponse.data.ship_form}. Since this is one of our popular routes and we transport vehicles almost daily, you can be confident that it will be handled by an experienced driver. To confirm your bookings, please call our toll-free number, <strong>(833) 233-4447</strong>. Alternatively, click the link below to reserve your space in advance of pricing changes.</p>
        
        <p style="text-align: center; display: flex; justify-content: flex-start; align-items: start;">
            <a href="http://localhost:3000/CardForm" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click for Reservations</a>
        </p>

        <p style="font-size: 20px; line-height: 1.5;">We understand that the 1st available date to pick up your 2024 AM General Hummer is <strong> ${formResponse.data.pickup_date}</strong>. Below you will find the details of your shipment, please review the information carefully. If there is anything we need to correct, please reach out to one of our agents.</p>

        <h3 style="font-size: 23PX;">1. Shipper Information</h3>
        <p  style="font-size: 20PX;"><strong>Name:</strong> ${formResponse.data.username}</p>
         <p  style="font-size: 20PX;"><strong>Phone 1:</strong> ${formResponse.data.phone}</p>
         <p  style="font-size: 20PX;"><strong>Phone 2:</strong> N/A</p>
         <p  style="font-size: 20PX;"><strong>Address:</strong> ${formResponse.data.ship_form}</p>
         <p  style="font-size: 20PX;"><strong>Country:</strong> USA</p>
         <p  style="font-size: 20PX;"><strong>Email:</strong> ${formResponse.data.email}</p>
        <P style="color: black; font-size: 25PX; font-weight: 900;" >============================</P>
        <h3>2. Pricing and Shipping</h3>
         <p  style="font-size: 20PX;"><strong>Order Number:</strong> RAS ${formResponse.data.quote_id}</p>
         <p  style="font-size: 20PX;"><strong>Total Price:</strong> ${formResponse.data.price} (incl. 100% Insurance)</p>
         <p  style="font-size: 20PX;"><strong>1st Available Date:</strong> 2024-11-15</p>
         <p  style="font-size: 20PX;"><strong>Ship Via:</strong> ${formResponse.data.transport_method}</p>
         <p  style="font-size: 20PX;"><strong>Vehicle(s) Status: ${formResponse.data.status}</strong> ${formResponse.vehicle_type}</p>

        <h3>3. Location Details Origin</h3>
         <p  style="font-size: 20PX;"><strong>Name:</strong> ${formResponse.data.username}</p>
         <p  style="font-size: 20PX;"><strong>Phone 1:</strong> ${formResponse.data.phone}</p>
         <p  style="font-size: 20PX;"><strong>Phone 2:</strong> N/A</p>
         <p  style="font-size: 20PX;"><strong>Address:</strong> ${formResponse.data.ship_form}</p>
         <p  style="font-size: 20PX;"><strong>Country:</strong> USA</p>
         <p  style="font-size: 20PX;"><strong>Email:</strong> ${formResponse.data.email}</p>

        <h3>4. Destination</h3>
         <p  style="font-size: 20PX;"><strong>Name:</strong> ${formResponse.data.username}</p>
         <p  style="font-size: 20PX;"><strong>Company:</strong> N/A</p>
         <p  style="font-size: 20PX;"><strong>Phone:</strong> ${formResponse.data.phone}</p>
         <p  style="font-size: 20PX;"><strong>Address:</strong> ${formResponse.data.ship_to}</p>
         <p  style="font-size: 20PX;"><strong>Country:</strong> USA</p>
         <p  style="font-size: 20PX;"><strong>Email:</strong> ${formResponse.data.email}</p>

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
             <table style=width:100%;color:#000;font-size:20px><tr><th><div style=width:100%;height:150px;background-color:#ff4500;display:grid;justify-content:center;align-items:center><a href=https://rapidautoshipping.com><img src=https://rapidautoshipping.com/assets/images/Untitled-1-Recovered.png style=margin:auto width=350px></a></div><tr><td><tr><td style=padding:2%><h2 style=color:grey>Hello Mr ' ${formResponse.data.username}'</h2><p style=font-size:18px>We are happy to inform that a carrier has been assigned to pickup your <b>'${formResponse.data.year}' '${formResponse.data.make}' '${formResponse.data.model}'</b>Dispatcher will be in contact to arrange time for pickup/delivery.<div style=border-bottom:#000 1px solid><p style=font-size:18px;color:black><b>A Few Things to Keep in Mind</b><ul><li>The driver will be able to go as close to your address as safely/legally possible. Please inform dispatcher if you have a preferred location to meet.<li>Personal items are not allowed inside the vehicle during transit unless informed upon booking.<li>Any automatic toll booth device should be removed from the car so that you won\'t get charged extra.<li>Pickup/Delivery dates are estimated and not guaranteed as truckers can run into delays due to traffic, detours, weather, mandatory rest stops, weight station check-ups/police inspections, truck breakdowns, etc.</ul></div><div style=border-bottom:#000 1px solid><p style=font-size:18px>Estimated Pickup Date:<b>'${formResponse.data.pickup_date}'</b><p style=font-size:18px>Estimated Delivery Date:<b>'${formResponse.data.pickup_date}'</b></div><div style=border-bottom:#000 1px solid><p style=font-size:18px>Driver Name:<p style=font-size:18px>Driver Phone:#<p style=font-size:18px></div><div style=border-bottom:#000 1px solid><p style=font-size:18px><br><b>Total Amount: '${formResponse.data.price}'</b><li style=margin-top:1%><b>Booking Amount Received: $0</b><li style=margin-top:1%><b>Amount to be Paid : '${formResponse.data.price}'</b> ( Click <b>Pay Now</b> and make the payment.)<ul><li style=margin-top:1%><a href='${formResponse.data.payement_url}'><button style=border:0;width:100px;height:40px;border-radius:5px;background:green;color:white;cursor:pointer>Pay Now</button></a></li><li style=margin-top:1%><b>Balance to be Paid to Driver: '${formResponse.data.price}'</b>  (Note: Driver Amount has to be paid in Cash, Cashier Check, Money Order)</ul><br></div><div style=border-bottom:#000 1px solid><div style=display:flex><ul style=list-style-type:none;font-size:18px><li style=margin-top:1%><li style=margin-top:1%> Phone:<b>+1 (833) 233-4447</b></li><li style=margin-top:1%> Email:<b>info@rapidautoshipping.com</b></li></ul><div><p style=font-size:18px;margin-left:45%>WE ARE HERE TO ANSWER YOUR QUESTIONS FROM 7 AM TO 5 PM CENTRAL TIME. WE LOOK FORWARD TO HEARING FROM YOU.</div></div></div><div style=border-bottom:#000 1px solid><p style=font-size:18px>Sincerely,<p style=font-size:18px>Rapid Auto Shipping</p><a href=https://rapidautoshipping.com/ >rapidautoshipping.com</a><p>+1 (833) 233-4447</div><div style=display:flex;align-items:center;justify-content:center;margin:auto;><div style=display:flex;align-items:center;justify-content:center;margin:auto;gap:3%;><a href=https://www.facebook.com/Rapidautoshipping target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/facebook-icon.webp></a><a href=https://www.instagram.com/rapidautoshipping target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/instagram-icon.png></a><a href=https://www.linkedin.com/in/rapidautoshipping/ target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/linkedin-icon.webp></a><a href=https://www.youtube.com/@rapidautoshipping9439 target=_blank style=margin:3%;><img style=height:50px;width:50px; src=https://rapidautoshipping.com/assets/images/yt.png></a></div></div></div></table>
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
        pickup_date: pickup_date | form.pickup_date,
        pickup_id: pickupId || form.pickup_id,
        payment_url: paymentUrl || form.payment_url,
        price: price || form.price,
        note: note || form.note,
        note_time: note ? new Date().toISOString() : form.note_time,
        status: status || form.status,
      };

      // Axios PUT request to update the form
      await axios.put(`http://localhost:5000/api/form/${id}`, updatedData);

      alert("Form updated successfully");
      window.location.reload()
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
    <div className="flex h-screen overflow-auto">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-20">
        <div className="max-w-3xl p-6 h-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-white shadow-md hover:bg-gray-100 transition duration-200 ease-in-out">
              <div className="flex justify-between border-b border-gray-300 py-2 bg-gray-50">
                <span className="font-semibold text-gray-600">Quote ID:</span>
                <span className="text-gray-800">{form.quote_id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2">
                <span className="font-semibold text-gray-600">Name:</span>
                <span className="text-gray-800">{form.username}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2 bg-gray-50">
                <span className="font-semibold text-gray-600">Email:</span>
                <span className="text-gray-800">{form.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2">
                <span className="font-semibold text-gray-600">Phone:</span>
                <span className="text-gray-800">{form.phone}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2 bg-gray-50">
                <span className="font-semibold text-gray-600">
                  Shipping From:
                </span>
                <span className="text-gray-800">{form.ship_form}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2">
                <span className="font-semibold text-gray-600">
                  Shipping To:
                </span>
                <span className="text-gray-800">{form.ship_to}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2 bg-gray-50">
                <span className="font-semibold text-gray-600">
                  Transport Method:
                </span>
                <span className="text-gray-800">{form.transport_method}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold text-gray-600">IP Address:</span>
                <span className="text-gray-800">{form.ip}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-white shadow-md hover:bg-gray-100 transition duration-200 ease-in-out">
              <div className="flex justify-between border-b border-gray-300 py-2 bg-gray-50">
                <span className="font-semibold text-gray-600">Year:</span>
                <span className="text-gray-800">{form.year}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2">
                <span className="font-semibold text-gray-600">Make:</span>
                <span className="text-gray-800">{form.make}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2 bg-gray-50">
                <span className="font-semibold text-gray-600">Model:</span>
                <span className="text-gray-800">{form.model}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2">
                <span className="font-semibold text-gray-600">
                  Vehicle Type:
                </span>
                <span className="text-gray-800">{form.vehicle_type}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2 bg-gray-50">
                <span className="font-semibold text-gray-600">
                  Pickup Date:
                </span>
                <span className="text-gray-800 truncate">
                  {new Date(form.pickup_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2">
                <span className="font-semibold text-gray-600">Distance:</span>
                <span className="text-gray-800">{form.distance}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 py-2 bg-gray-50">
                <span className="font-semibold text-gray-600">Price:</span>
                <span className="text-gray-800">$ {form.price}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold text-gray-600">Source URL:</span>
                <span className="text-gray-800 truncate">{form.sourceUrl}</span>
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
              <label className="font-semibold text-gray-600">Note</label>
              <div className="flex items-center">
                <textarea
                  value={note || form.note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter Note"
                ></textarea>
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

            <button
              onClick={fetchCardDetails}
              className="bg-blue-500 text-white p-2 "
            >
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
          {isCardModalOpen && cardDetails && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[800px] max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Card Details
                </h2>

                {/* Display Card Details */}
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

                <div className="mt-4">
                  <button
                    onClick={() => setIsCardModalOpen(false)}
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

        {/* New Container */}
        <div className="max-w-3xl p-6 h-auto">
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
                <CreateCarrierPage/>
              </div>
            )}
          </div>
          <SelectCarriers quote_id={form.quote_id} />
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;
