import React, { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";

//Define links to be used in the header, links to outside contents must use https format
const links = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "In Stock", to: "/products" },
  { name: "Cart", to: "/cart" },
  { name: "Contact", to: "/contact" },
];

const Nav = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleNav = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <header className="container">
        <div className="inner-container">
          <AnimatePresence>
            {modalOpen ? <Modal toggle={toggleNav} links={links} /> : null}
          </AnimatePresence>
          <Link href="/cart" passHref>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </Link>
          <div className="logoContainer">
            <h1>raecreatedit</h1>
          </div>
          <ul className="navMenu">
            {links.map(({ name, to }) => {
              if (to[0] === "/") {
                return (
                  <li>
                    <Link href={to}>{name}</Link>
                  </li>
                );
              } else {
                return (
                  <li>
                    <a href={to}>{name}</a>
                  </li>
                );
              }
            })}
          </ul>
          <svg
            className="hamburger"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={toggleNav}
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
      </header>
      <style jsx>
        {`
          .container {
            --hamburger-size: 30px;
            --hamburger-color: white;
            display: flex;
            justify-content: center;
            width: 100%;
          }
          .inner-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1024px;
            width: 100%;
            padding: 1rem;
          }
          .logoContainer {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
          }
          .logoContainer h1 {
            margin: 0;
            padding: 0;
          }
          .logo {
            max-height: 50px;
            object-fit: contain;
            margin: 0;
          }
          .logo:hover {
            cursor: pointer;
          }
          .navMenu {
            display: none;
          }
          .navMenu a {
            text-decoration: none;
            color: var(--font-color);
            transition: color 0.25s;
          }
          .navMenu a:hover {
            color: var(--accent-color);
          }
          .activeLink {
            border-bottom: 3px solid var(--accent-color);
          }
          .hamburger {
            width: var(--hamburger-size);
            height: var(--hamburger-size);
            stroke: var(--hamburger-color);
          }
          @media only screen and (min-width: 768px) {
            .container {
              display: flex;
            }
            .logo {
              max-height: 100px;
            }
            .navMenu {
              text-decoration: none;
              list-style-type: none;
              margin: 0;
              width: 60%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }
            .navMenu a {
              margin-left: 1em;
            }
            .navMenu li {
              margin: 0;
            }
            .hamburger {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
};

export default Nav;
