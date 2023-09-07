// import { configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users/userSlice";
import tenantReducer from "./features/tenant/tenantSlice";
import paymentReducer from "./features/payments/paymentSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tenant: tenantReducer,
    payment: paymentReducer,
  },
});
