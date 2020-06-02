import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ME_QUERY, SIGN_UP_MUTATION, SIGN_IN_MUTATION } from "./graphql-client";

const Auth = ({ children }) => {
  const { data, refetch } = useQuery(ME_QUERY);
  const [signUp, { data: signUpData }] = useMutation(SIGN_UP_MUTATION);
  const [signIn, { data: signInData }] = useMutation(SIGN_IN_MUTATION);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formType, setFormType] = useState("Sign In");

  const token = signUpData?.signUp?.token || signInData?.signIn?.token;
  if (token) localStorage.setItem("token", token);

  useEffect(() => {
    refetch();
  }, [token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formType === "Sign In") {
      signIn({ variables: formData });
    }
    if (formType === "Sign Up") {
      signUp({ variables: formData });
    }
  };

  if (!data) return null;
  if (data?.me) return children;

  return (
    <main>
      <h1>{formType}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            minLength="8"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <div className="buttons">
          <button className="primary" type="submit">
            {formType}
          </button>
          <button
            type="button"
            onClick={() => {
              formType === "Sign Up"
                ? setFormType("Sign In")
                : setFormType("Sign Up");
            }}
          >
            {formType === "Sign Up" ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Auth;
