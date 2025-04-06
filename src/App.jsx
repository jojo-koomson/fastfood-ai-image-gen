import { Fragment } from "react";
import "./App.css";
import Parent from "./components/Parent";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Parent />
    </Fragment>
  );
}

export default App;
