import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";
import Hamburger from "../UI/Hamburger";
import CartIcon from "../UI/CartIcon";

//Define links to be used in the header, links to outside contents must use https format
const links = [
  { name: "Home", to: "/" },
  // { name: "About", to: "/about" },
  { name: "In Stock", to: "/products" },
  { name: "Cart", to: "/cart" },
  // { name: "Contact", to: "/contact" },
];

const Nav = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const toggleNav = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <header
        className={`${
          router.pathname === "/" ? "bg-transparent" : "bg-black"
        } flex justify-between items-center w-full max-w-screen-lg h-24 fixed top-0 p-4 z-50`}
      >
        <AnimatePresence>
          {modalOpen ? <Modal links={links} toggle={toggleNav} /> : null}
        </AnimatePresence>
        <span className="md:hidden">
          <Link href="/cart" passHref>
            <CartIcon to="/cart" />
          </Link>
        </span>
        <div className="h-full w-24">
          <Link href="/" passHref>
            {/* <h1 className="text-4xl">raecreatedit</h1> */}
            <Image
              alt=""
              src="https://cdn.shopify.com/s/files/1/0499/7568/9378/files/Logo_45506a33-d1bb-48c7-aef9-5fdb159c2315.png?v=1614321139"
              height={1}
              width={1.5}
              layout="responsive"
            />
          </Link>
        </div>
        <ul className="list-none hidden md:flex md:justify-between md:items-center md:w-2/3">
          {links.map(({ name, to }) => {
            //if the first character is a slash it is an internal link
            if (to[0] === "/") {
              return (
                <li>
                  <Link href={to} passHref>
                    <a className="hover:text-pink-500 transition duration-300 ease-in-out">
                      {name}
                    </a>
                  </Link>
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
          <span className="hidden md:block">
            <Link href="/cart" passHref>
              <CartIcon to="/cart" />
            </Link>
          </span>
        </ul>
        <Hamburger onClick={toggleNav} />
      </header>
    </>
  );
};

export default Nav;
