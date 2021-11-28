import React from "react";

interface X {
  onClick: () => void;
}

const X = ({ onClick }: X) => {
  return (
    <>
      <svg
        className="fill-current stroke-current w-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={onClick}
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </>
  );
};

export default X;
