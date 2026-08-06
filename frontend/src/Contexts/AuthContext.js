// Import React and the Hooks we need here
import React, { useState, useEffect, useContext } from "react";
// Import the Util function we created to handle the reading from the local storage
import getAuth, { getStoredEmployee } from "../util/auth";
// Create a context object
const AuthContext = React.createContext();
// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
// Create a provider component
export const AuthProvider = ({ children }) => {
  const storedEmployee = getStoredEmployee();
  const [isLogged, setIsLogged] = useState(Boolean(storedEmployee));
  const [isAdmin, setIsAdmin] = useState(storedEmployee?.employee_role === 3);
  const [employee, setEmployee] = useState(storedEmployee);

  const value = { isLogged, isAdmin, setIsAdmin, setIsLogged, employee };

  useEffect(() => {
    if (storedEmployee) {
      return;
    }

    const loggedInEmployee = getAuth();
    loggedInEmployee.then((response) => {
      if (response.employee_token) {
        setIsLogged(true);
        if (response.employee_role === 3) {
          setIsAdmin(true);
        }
        setEmployee(response);
      }
    });
  }, [storedEmployee]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
