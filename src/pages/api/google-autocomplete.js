// pages/api/google-autocomplete.js

export default async function handler(req, res) {
    const { address } = req.query;
    const apiKey = 'AIzaSyDJKp5HjtKF7eL-zbWvIFLtBa51tua1fzw'; // Replace with your actual API key
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(address)}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        res.status(200).json(data.predictions);
      } else {
        res.status(400).json({ error: 'Failed to fetch autocomplete suggestions' });
      }
    } catch (error) {
      console.error('Error with API request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  