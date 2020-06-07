import React, { useState, useContext } from "react";
import { AuthContext } from "./Authentication";

const Authorization = ({ children }) => {
  const { signUp, signIn, user, authLoading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formType, setFormType] = useState("Sign In");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formType === "Sign In") signIn({ variables: formData });
    if (formType === "Sign Up") signUp({ variables: formData });
    setFormData({ email: "", password: "" });
    setFormType("Sign In");
  };

  if (authLoading) return <h2>Loading...</h2>;
  if (user) return children;
  return (
    <main>
      <h2>{formType}</h2>
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

export default Authorization;
