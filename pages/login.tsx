import React from "react";
import Login from "../components/Login";

const login = () => {
  return (
    <>
      <div className="page-container">
        <Login />
      </div>
      <style jsx>
        {`
          .page-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </>
  );
};

export default login;
