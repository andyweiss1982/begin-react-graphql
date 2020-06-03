import React, { createContext, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  ME_QUERY,
  SIGN_UP_MUTATION,
  SIGN_IN_MUTATION,
} from "./graphql-queries";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data, loading, refetch, networkStatus } = useQuery(ME_QUERY, {
    notifyOnNetworkStatusChange: true,
  });
  const refetching = networkStatus === 4;
  const me = data?.me;

  const [
    signUp,
    { data: signUpData, loading: signUpLoading, error: signUpError },
  ] = useMutation(SIGN_UP_MUTATION);
  if (signUpError) alert(signUpError.graphQLErrors[0].message);

  const [
    signIn,
    { data: signInData, loading: signInLoading, error: signInError },
  ] = useMutation(SIGN_IN_MUTATION);
  if (signInError) alert(signInError.graphQLErrors[0].message);

  const token = signUpData?.signUp?.token || signInData?.signIn?.token;
  if (token) localStorage.setItem("token", token);
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    refetch();
  }, [storedToken]);

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
        authLoading: loading || refetching || signUpLoading || signInLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
