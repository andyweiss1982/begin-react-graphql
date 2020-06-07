import React, { createContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  ME_QUERY,
  SIGN_UP_MUTATION,
  SIGN_IN_MUTATION,
} from "./graphql-queries";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data, loading, refetch } = useQuery(ME_QUERY, {
    notifyOnNetworkStatusChange: true,
  });
  const me = data?.me;

  const [signUp, { loading: signUpLoading }] = useMutation(SIGN_UP_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.signUp.token);
      refetch();
    },
    onError: (error) => {
      alert(error.graphQLErrors[0].message);
    },
  });

  const [signIn, { loading: signInLoading }] = useMutation(SIGN_IN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.signIn.token);
      refetch();
    },
    onError: (error) => {
      alert(error.graphQLErrors[0].message);
    },
  });

  const signOut = () => {
    localStorage.removeItem("token");
    refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        me,
        authLoading: loading || signUpLoading || signInLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
