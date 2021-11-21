import React from "react";
import Nav from "./Nav/Nav";

import { atom, useAtom, Provider } from "jotai";

export const countAtom = atom(0);
const Layout = ({ children }) => {
  const [count, setCount] = useAtom(countAtom);
  return (
    <Provider>
      <Nav />
      {children}
    </Provider>
  );
};

export default Layout;
