import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: { value: 0 },

  reducers: {
    setPayment(state, action) {
      //   state.value = action.payload;
      state.value += action.payload;
    },
  },
});

export const { setPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
