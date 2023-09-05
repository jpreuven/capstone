import React, { useEffect, useState } from "react";
// import { Switch, Route } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Signup from "./Authentication/Signup";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  useEffect(() => {
    fetch("/users")
      .then((r) => r.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <ChakraProvider>
      <Router>
        <Route path="/signup">
          <Signup />
        </Route>
      </Router>
      <h1>Phase 4 Project Client</h1>;
    </ChakraProvider>
  );
}

export default App;
