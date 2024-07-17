import React from "react";
import NavbarComponent from "../components/NavbarComponent";

const Layouts = ({ children }) => {
  return (
    <React.Fragment>
      <NavbarComponent />
      <div className="">
        <main>{children}</main>
      </div>
    </React.Fragment>
  );
};

export default Layouts;
