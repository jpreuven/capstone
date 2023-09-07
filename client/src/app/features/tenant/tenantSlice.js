import { createSlice } from "@reduxjs/toolkit";

const tenantSlice = createSlice({
  name: "tenant",
  initialState: { value: null },

  reducers: {
    setTenant(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
