import React from "react";
import { useSelector, useDispatch } from "react-redux";

export const Properties = (props) => {
  const user = useSelector((state) => state.user.value);
  console.log(user);
  return <div>Properties</div>;
};

export default Properties;
