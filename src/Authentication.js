import React, { createContext, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ME_QUERY, SIGN_UP_MUTATION, SIGN_IN_MUTATION } from "./graphql-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data, loading, refetch, networkStatus } = useQuery(ME_QUERY, {
    notifyOnNetworkStatusChange: true,
  });
  const [signUp, { data: signUpData, loading: signUpLoading }] = useMutation(
    SIGN_UP_MUTATION
  );
  const [signIn, { data: signInData, loading: signInLoading }] = useMutation(
    SIGN_IN_MUTATION
  );
  const me = data?.me;

  const token = signUpData?.signUp?.token || signInData?.signIn?.token;
  if (token) localStorage.setItem("token", token);

  useEffect(() => {
    refetch();
  }, [token]);

  const signOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        me,
        authLoading:
          loading || signUpLoading || signInLoading || networkStatus === 4,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
