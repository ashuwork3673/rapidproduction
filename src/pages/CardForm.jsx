// components/CardForm.js
"use client";
import { useState, useEffect } from 'react';
import '../app/globals.css';

const CardForm = () => {
    const [formData, setFormData] = useState({
        quote_id: '',
        username: '',
        email: '',
        billing_address: '',
        billing_city: '',
        billing_state: '',
        billing_zip: '',
        card_name: '',
        card_number: '',
        card_expiry: '',
        card_cvv: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        // Fetch form data on component load
        const fetchFormData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/form');
                const data = await res.json();
                if (data && data.length > 0) {
                    const latestForm = data[data.length - 1];
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        quote_id: latestForm.quote_id,
                        username: latestForm.username,
                        email: latestForm.email
                    }));
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
                setError("Error loading form data");
            }
        };
        
        fetchFormData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Submit card details
            const res = await fetch('http://localhost:5000/api/card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (res.ok) {
                const newCard = await res.json();
                setSuccess('Card details submitted successfully!');
                setError('');
    
                // Automatically send an email
                const emailRes = await fetch('http://localhost:5000/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: formData.email,
                        subject: 'Card Submission Successful',
                        message: `
                            <h1>${formData.username}'s</h1>
                            <p>card details have been successfully submitted. Below are the billing details:</p>
                            <ul>
                                <li><strong>Quote ID:</strong> ${formData.quote_id}</li>
                                <li><strong>Quote ID:</strong> ${formData.card_name}</li>
                                <li><strong>Billing Address:</strong> ${formData.billing_address}, ${formData.billing_city}, ${formData.billing_state}, ${formData.billing_zip}</li>
                            </ul>
                            <p>Feel free to contact us if you have any questions.</p>
                        `,
                    }),
                });
    
                if (!emailRes.ok) {
                    const emailError = await emailRes.json();
                    console.error('Email error:', emailError);
                    setError('Card submitted but email failed to send.');
                }
    
                // Reset form data
                setFormData({
                    quote_id: '',
                    username: '',
                    email: '',
                    billing_address: '',
                    billing_city: '',
                    billing_state: '',
                    billing_zip: '',
                    card_name: '',
                    card_number: '',
                    card_expiry: '',
                    card_cvv: '',
                });
                setCurrentStep(1); // Reset to step 1 after successful submission
            } else {
                const errorData = await res.json();
                setError(errorData.message);
            }
        } catch (err) {
            setError('Error submitting form');
        }
    };
    

    const nextStep = () => {
        if (currentStep === 1) {
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Card Details</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                    <div>
                        <div className="mb-4">
                            <label htmlFor="quote_id" className="block text-sm font-semibold">Quote ID</label>
                            <input
                                type="text"
                                id="quote_id"
                                name="quote_id"
                                value={formData.quote_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-semibold">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="billing_address" className="block text-sm font-semibold">Billing Address</label>
                            <input
                                type="text"
                                id="billing_address"
                                name="billing_address"
                                value={formData.billing_address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="billing_city" className="block text-sm font-semibold">City</label>
                            <input
                                type="text"
                                id="billing_city"
                                name="billing_city"
                                value={formData.billing_city}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="billing_state" className="block text-sm font-semibold">State</label>
                            <input
                                type="text"
                                id="billing_state"
                                name="billing_state"
                                value={formData.billing_state}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="billing_zip" className="block text-sm font-semibold">Zip Code</label>
                            <input
                                type="text"
                                id="billing_zip"
                                name="billing_zip"
                                value={formData.billing_zip}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <button
                            type="button"
                            onClick={nextStep}
                            className="w-full p-2 bg-blue-600 text-white rounded mt-4 hover:bg-blue-700"
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <div className="mb-4">
                            <label htmlFor="card_name" className="block text-sm font-semibold">Cardholder Name</label>
                            <input
                                type="text"
                                id="card_name"
                                name="card_name"
                                value={formData.card_name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="card_number" className="block text-sm font-semibold">Card Number</label>
                            <input
                                type="text"
                                id="card_number"
                                name="card_number"
                                value={formData.card_number}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="card_expiry" className="block text-sm font-semibold">Expiry Date (MM/YY)</label>
                            <input
                                type="text"
                                id="card_expiry"
                                name="card_expiry"
                                value={formData.card_expiry}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="card_cvv" className="block text-sm font-semibold">CVV</label>
                            <input
                                type="text"
                                id="card_cvv"
                                name="card_cvv"
                                value={formData.card_cvv}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                            >
                                Previous Step
                            </button>
                            <button
                                type="submit"
                                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Submit Card Details
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CardForm;
