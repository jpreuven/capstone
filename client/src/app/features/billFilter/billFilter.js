import { createSlice } from "@reduxjs/toolkit";

const billFilterSlice = createSlice({
  name: "billFilter",
  initialState: { value: null },

  reducers: {
    setBillFilter(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setBillFilter } = billFilterSlice.actions;
export default billFilterSlice.reducer;
