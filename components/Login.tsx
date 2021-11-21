import React, { useState } from "react";
import { createAccessToken } from "../lib/shopify";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useAtom(userAtom);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    const data = await createAccessToken(email, password);
    const accessToken =
      data.customerAccessTokenCreate.customerAccessToken.accessToken;
    setUser({
      isLoggedIn: true,
      accessToken,
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="email">Email (required)</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleChangeEmail}
        />
        <label htmlFor="password">Password (required)</label>
        <input
          id="password"
          type="text"
          value={password}
          onChange={handleChangePassword}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Login;
