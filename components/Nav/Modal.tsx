import React from "react";
import Link from "next/link";
import FadeInFadeOut from "../Animations/FadeInFadeOut";
import { useAtom } from "jotai";
import { userAtom } from "../../lib/atoms";
import X from "../UI/X";

interface Link {
  name: string;
  to: string;
}

interface ModalTypes {
  links: { name: string; to: string }[];
  toggle: () => void;
}

const Modal = ({ links, toggle }: ModalTypes) => {
  const [user, setUser] = useAtom(userAtom);

  return (
    <>
      <FadeInFadeOut>
        <div className="w-screen h-screen flex justify-center items-center">
          <ul className="overlayContent">
            <span className="absolute top-6 right-6">
              <X onClick={toggle} />
            </span>
            {links.map(({ name, to }) => {
              //if the first character is a slash it is an internal link
              if (to[0] === "/") {
                return (
                  <li onClick={toggle}>
                    <Link href={to} passHref>
                      <a className="text-2xl">{name}</a>
                    </Link>
                  </li>
                );
              } else {
                return (
                  <li onClick={toggle}>
                    <a href={to}>{name}</a>
                  </li>
                );
              }
            })}
            <li>
              {!user.accessToken && (
                <>
                  <button className="bg-pink-500 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded mt-4">
                    Log In/Register
                  </button>
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
