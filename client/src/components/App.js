import React, { useEffect, useState, useContext, createContext } from "react";
// import { Switch, Route } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Signup from "./Authentication/Signup";
import Login from "./Authentication/Login";
import Main from "./Main";

import { ChakraProvider, Button } from "@chakra-ui/react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Sidebar from "./Main/Sidebar";
import { Provider } from "react-redux";
// import {store} './app/store'
// import { Store } from "redux";
import { store } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../app/features/users/userSlice";

function App() {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  useEffect(() => {
    fetchUser();
  }, []);

  const dispatch = useDispatch();

  const fetchUser = () =>
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          dispatch(setUser(user));
          setLoading(false);
          // console.log(user);
        });
      } else {
        setLoading(false);
      }
    });

  const user = useSelector((state) => state.user.value);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!user) {
    return (
      <ChakraProvider>
        <Router>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Router>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Router>
        <Sidebar />
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route>
          <Main path="/" />
        </Route>
      </Router>
    </ChakraProvider>
  );
}

export default App;
