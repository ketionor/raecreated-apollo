import React from "react";
import { useState } from "react";
import { createCustomer } from "../lib/shopify";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    createCustomer(
      email,
      password,
      acceptsMarketing,
      firstName,
      lastName,
      phone
    );
  };

  return (
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
  );
};

export default Register;
