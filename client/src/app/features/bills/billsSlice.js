import { createSlice } from "@reduxjs/toolkit";

const billsSlice = createSlice({
  name: "bills",
  initialState: { value: [] },

  reducers: {
    setBills(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setBills } = billsSlice.actions;
export default billsSlice.reducer;
