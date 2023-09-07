import { createSlice } from "@reduxjs/toolkit";

const propertySlice = createSlice({
  name: "property",
  initialState: { value: null },

  reducers: {
    setProperty(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setProperty } = propertySlice.actions;
export default propertySlice.reducer;
