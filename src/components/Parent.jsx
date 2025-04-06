// Import the tools we need from React and Google's AI
import { useState, Fragment, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
// Import our styling file
import "./styles/parent.css";

// This is our main component that handles the food image generation
function Parent() {
  // === State Variables (like memory boxes to store information) ===
  // Store the current text in the input box
  const [message, setMessage] = useState("");
  // Store the list of ingredients we've added
  const [submittedMessage, setSubmittedMessage] = useState([]);
  // Remember if we should show the generate button
  const [cookButton, setCookButton] = useState(false);
  // Keep track if we're currently generating an image
  const [loading, setLoading] = useState(false);
  // Store any error messages
  const [error, setError] = useState(null);
  // Store the generated food image
  const [generatedImage, setGeneratedImage] = useState(null);

  // Set up our connection to Google's AI with our special key
  const genAI = new GoogleGenerativeAI("AIzaSyD2MHGd6MwrRVXRUiaF1mDEUJQessnyybM");

  // This special effect runs when we have 5 ingredients
  // It waits 3 seconds and then shows the generate button
  useEffect(() => {
    if (submittedMessage.length === 5) {
      // Start a 3-second timer
      const timer = setTimeout(() => {
        // After 3 seconds, show the button
        setCookButton(true);
      }, 3000);
      // Clean up the timer if the component disappears
      return () => clearTimeout(timer);
    }
  }, [submittedMessage.length]); // Only run this when the number of ingredients changes

  // Function to add a new ingredient to our list
  const pushMessage = (message) => {
    setSubmittedMessage((prevMessages) => [...prevMessages, message]);
  };

  // Function that runs when someone types in the input box
  const handleChangeValue = (e) => {
    setMessage(e.target.value);
  };

  // Function that runs when the form is submitted
  const handleSubmit = (e) => {
    // Prevent the page from reloading
    e.preventDefault();
    // Only add the ingredient if it's not empty
    if (message.trim()) {
      pushMessage(message.trim());
      resetHandle();
    }
  };

  // Function to clear the input box
  const resetHandle = () => {
    setMessage("");
  };

  // The main function that generates our food image
  const generateImage = async () => {
    try {
      // Show that we're loading and clear any old data
      setLoading(true);
      setError(null);
      setGeneratedImage(null);

      // Set up the AI model with the settings we want
      const model = genAI.getGenerativeModel({ 
        // Use Google's special image generation model
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          // Make it a bit creative (0.9 out of 1.0)
          temperature: 0.9,
          // Help it pick good words
          topK: 32,
          topP: 1,
          // Maximum length of the response
          maxOutputTokens: 2048,
        }
      });

      // Write a detailed description for our food image
      const prompt = `Create a photorealistic image of a delicious dish made with these ingredients: ${submittedMessage.join(", ")}. 
                     The image should be:
                     - High resolution and detailed
                     - Professional food photography style
                     - Well-lit with studio lighting
                     - Beautifully plated and garnished
                     - Appetizing and mouth-watering
                     - Shot from a top-down or 45-degree angle`;

      // Ask the AI to generate our image
      const result = await model.generateContent({
        // Send our description to the AI
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          // Tell it we want both text and image back
          responseModalities: ["Text", "Image"]
        }
      });

      // Get the AI's response
      const response = await result.response;
      
      // Look through the response to find the image part
      const parts = response.candidates[0].content.parts;
      const imagePart = parts.find(part => part.inlineData?.mimeType?.startsWith('image/'));
      
      // Make sure we actually got an image
      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data received');
      }

      // Convert the image data into a format we can display
      setGeneratedImage(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);

    } catch (error) {
      // If anything goes wrong, show an error message
      console.error("Error generating image:", error);
      setError(`Failed to generate image: ${error.message}`);
    } finally {
      // Whether it worked or failed, we're not loading anymore
      setLoading(false);
    }
  };

  // This is what shows up on the screen
  return (
    <Fragment>
      {/* Main container for our app */}
      <div className="parentContainer">
        {/* Form for adding ingredients */}
        <form onSubmit={handleSubmit}>
          {/* Title of our app */}
          <label style={{ fontFamily: "Lobster", fontSize: 30, color: "white", textAlign: 'center' }}>
            FastFood Maker
          </label>
          {/* Container for input and button */}
          <div className="input-container">
            {/* Text input for ingredients */}
            <input
              type="text"
              value={message}
              onChange={handleChangeValue}
              placeholder="message here"
              required
            />
            {/* Button to add ingredients */}
            <button 
              className="add-btn" 
              type="submit" 
              // Disable the button if we already have 5 ingredients
              disabled={submittedMessage.length >= 5}
            >
              Add
            </button>
          </div>
        </form>
      </div>
      
      {/* Display area for our added ingredients */}
      <div className="ingredients-cards">
        {/* Map through each ingredient and create a card for it */}
        {submittedMessage.map((item, index) => (
          <div key={index} className="ingredient-card">
            <h3>{item}</h3>
            {/* Pretty underline beneath each ingredient */}
            <div className="card-underline"></div>
          </div>
        ))}
      </div>
      
      {/* Section that appears when we have 5 ingredients */}
      {submittedMessage.length === 5 && (
        <div className="cook-section">
          <p>That's enough ingredients for today..Proceed to cooking</p>
          {/* Generate button that appears after 3 seconds */}
          {cookButton && (
            <button 
              className="main-btn cook-btn"
              onClick={generateImage}
              disabled={loading}
            >
              {/* Show loading spinner when generating */}
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : "Generate Image"}
            </button>
          )}
        </div>
      )}
      
      {/* Show error message if something goes wrong */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Display area for our generated image */}
      {generatedImage && (
        <div className="generated-image">
          <div className="image-container">
            {/* The actual generated image */}
            <img 
              src={generatedImage} 
              alt="Generated food" 
              onError={() => setError('Failed to load image')}
            />
          </div>
          {/* Buttons for viewing and downloading the image */}
          <div className="actions">
            <button className="main-btn" onClick={() => window.open(generatedImage, '_blank')}>
              View Full Size
            </button>
            <button className="main-btn" onClick={() => {
              // Create a download link for the image
              const link = document.createElement('a');
              link.href = generatedImage;
              link.download = `fastfood-${Date.now()}.png`;
              link.click();
            }}>
              Download
            </button>
          </div>
        </div>
      )}

      {/* Button to start over with new ingredients */}
      {generatedImage && (
        <button 
          className="main-btn reset-btn"
          onClick={() => {
            // Clear everything and start fresh
            setSubmittedMessage([]);
            setGeneratedImage(null);
            setCookButton(false);
          }}
        >
          Start Over
        </button>
      )}
    </Fragment>
  );
}

// Make our component available to other parts of the app
export default Parent;