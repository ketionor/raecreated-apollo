import React from "react";
import Link from "next/link";
import FadeInFadeOut from "../Animations/FadeInFadeOut";
import { useAtom } from "jotai";
import { userAtom } from "../../lib/atoms";

interface Link {
  name: string;
  to: string;
}

interface ModalTypes {
  links: Link[];
  toggle: () => void;
}

const Modal = ({ links, toggle }: ModalTypes) => {
  const [user, setUser] = useAtom(userAtom);

  const closeNav = () => {
    toggle();
  };

  return (
    <>
      <FadeInFadeOut>
        <div className="container" id="nav-menu">
          <ul className="overlayContent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={closeNav}
              className="xButton"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            {links.map(({ name, to }) => {
              //if the first character is a slash it is an internal link
              if (to[0] === "/") {
                return (
                  <li onClick={toggle}>
                    <Link href={to} activeClassName="activeLink" passHref>
                      <a>{name}</a>
                    </Link>
                  </li>
                );
              } else {
                return (
                  <li onClick={closeNav}>
                    <a href={to}>{name}</a>
                  </li>
                );
              }
            })}
            <li>
              {!user.isLoggedIn && (
                <>
                  <button>Log In</button> <button>Register</button>
                </>
              )}
            </li>
          </ul>
        </div>
      </FadeInFadeOut>
      <style jsx>
        {`
          .overlayContent {
            margin: 0;
            padding: 0;
            text-align: center; /* Centered text/links */
            font-size: var(--font-level-four);
          }
          .overlayContent li {
            list-style-type: none;
          }
          .overlayContent svg {
            stroke: var(--x-button-color);
            width: var(--x-button-size);
            height: var(--x-button-size);
            position: absolute;
            top: 25px;
            right: 25px;
          }
          .overlayContent a {
            text-decoration: none;
            color: var(--font-color);
          }
        `}
      </style>
    </>
  );
};

export default Modal;
