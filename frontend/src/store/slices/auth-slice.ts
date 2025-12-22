import { User } from "@/types/auth-user.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
    },
  },
});


export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;