import React from "react";
import Nav from "./Nav/Nav";

const Layout = ({ children }) => {
  return (
    <>
      <div className="global-container">
        <Nav />
        <main className="content-container">{children}</main>
      </div>

      <style jsx>
        {`
          .global-container {
            width: 100vw;
            height: 100vh;
          }

          .content-container {
            width: 100%;
            margin: 1rem;
            max-width: 1024px;
          }
        `}
      </style>
    </>
  );
};

export default Layout;
