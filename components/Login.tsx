import React, { useEffect, useState } from "react";
import {
  createAccessTokenMutation,
  createCustomerMutation,
  cartBuyerIdentityUpdateMutation,
} from "../lib/shopify";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
import { useMutation } from "@apollo/client";
import { validateEmail, validatePassword } from "../lib/email";

const Login = () => {
  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const [user, setUser] = useAtom(userAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //used for validation
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  //state for registration
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState();
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);

  const [login, loginData] = useMutation(createAccessTokenMutation, {
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  const [createCustomer, createCustomerData] = useMutation(
    createCustomerMutation,
    {
      variables: {
        input: {
          firstName,
          lastName,
          phone,
          email,
          password,
          acceptsMarketing,
        },
      },
    }
  );

  const [cartUpdateBuyerIdentity, cartUpdateBuyerIdentityData] = useMutation(
    cartBuyerIdentityUpdateMutation,
    {
      variables: {
        cartId: user.cartId,
        buyerIdentity: {
          customerAccessToken: user.accessToken,
        },
      },
    }
  );

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    let emailVal = validateEmail(email);
    let passwordVal = validatePassword(password);

    if (!emailVal || !passwordVal) {
      setEmailIsValid(emailVal);
      setPasswordIsValid(passwordVal);
      return;
    }

    if (isRegisterPage) {
      try {
        const { data } = await createCustomer();
        console.log(data);

        if (typeof data.customerCreate?.customer?.id === "undefined") {
          console.log(
            "error, either your input is invalid or the customer id does not exist"
          );

          return;
        }
      } catch (e) {
        console.log("An unexpected error has occured.", e);
      }
      // try {
      //   const id: string = data.customerCreate.customer.id;
      //   setUser(Object.assign(user, { userId: id }));
      // } catch (e) {
      //   console.log("error", e);
      // }
      return;
    }

    if (!isRegisterPage) {
      try {
        const { data } = await login();
        const accessToken =
          data.customerAccessTokenCreate.customerAccessToken.accessToken;
        setUser({ ...user, accessToken });

        //if there is a cart in local storage, associate that with the account
        if (user.cartId) {
          const data2 = await cartUpdateBuyerIdentity();
          console.log("success", data2);
          console.log(user);
        }
      } catch {
        console.log("ppoooop");
      }
      return;
    }
  };

  return (
    <>
      <div className="card-container">
        {isRegisterPage ? (
          <div className="form-container">
            <label htmlFor="email">Email (required)</label>
            <input
              className={`email-input ${emailIsValid && "invalid"}`}
              id="email"
              type="text"
              value={email}
              onChange={handleChangeEmail}
            />
            <label htmlFor="password">Password (required)</label>
            <input
              className={`password-input ${passwordIsValid && "invalid"}`}
              id="password"
              type="password"
              value={password}
              onChange={handleChangePassword}
            />
            <p>Min 6 characters, 1 letter one number.</p>
            <button
              aria-disabled={!(emailIsValid && passwordIsValid)}
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <p className="text-link" onClick={() => setIsRegisterPage(false)}>
              Login
            </p>
          </div>
        ) : (
          <div className="">
            <div className="form-container">
              <label htmlFor="email">Email (required)</label>
              <input
                className={`email-input ${emailIsValid && "invalid"}`}
                id="email"
                type="text"
                value={email}
                onChange={handleChangeEmail}
              />
              <label htmlFor="password">Password (required)</label>
              <input
                className={`password-input ${passwordIsValid && "invalid"}`}
                id="password"
                type="password"
                value={password}
                onChange={handleChangePassword}
              />
              <button onClick={handleSubmit}>Login</button>
              <p className="text-link" onClick={() => setIsRegisterPage(true)}>
                Register
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>
        {`
          .card-container {
            width: 100%;
          }

          .form-container {
            display: flex;
            flex-direction: column;
          }

          .email-input {
          }

          .email-input,
          .password-input {
            border: 4px solid red;
          }

          .invalid {
            border: none;
          }

          .text-link {
            text-decoration: underline;
          }

          .text-link:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
};

export default Login;
