import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Main/Home";

export default function Main() {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}
