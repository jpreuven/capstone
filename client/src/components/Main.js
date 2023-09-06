import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Main/Home";
import Properties from "./Main/Properties";
import TenantDetail from "./Main/TenantDetail";
import Tenants from "./Main/Tenants";

export default function Main() {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/tenants/:id">
          <TenantDetail />
        </Route>
        <Route path="/tenants">
          <Tenants />
        </Route>
        <Route path="/properties">
          <Properties />
        </Route>
      </Switch>
    </div>
  );
}
