import { createSlice } from "@reduxjs/toolkit";

const chargeFormSlice = createSlice({
  name: "chargeForm",
  initialState: { value: null },

  reducers: {
    setChargeForm(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setChargeForm } = chargeFormSlice.actions;
export default chargeFormSlice.reducer;
