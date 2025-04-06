import { Fragment } from "react";
import "./styles/showmessage.css";

const ShowMessage = ({ message }) => {
  // Safely handle cases where message might be undefined or not an array
  const messages = Array.isArray(message) ? message : [];

  return (
    <div className="container">
      {messages.map((obj, index) => (
        <div className="food-card" key={index}>
          <h3>{obj}</h3>
        </div>
      ))}
    </div>
  );
};

export default ShowMessage;