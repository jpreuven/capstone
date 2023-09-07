// import { configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users/userSlice";
import tenantReducer from "./features/tenant/tenantSlice";
import paymentReducer from "./features/payments/paymentSlice";
import propertyReducer from "./features/properties/propertySlice";
import billsReducer from "./features/bills/billsSlice";
import chargeFormReducer from "./features/chargeForm/chargeFormSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    tenant: tenantReducer,
    payment: paymentReducer,
    property: propertyReducer,
    bills: billsReducer,
    chargeForm: chargeFormReducer,
  },
});
