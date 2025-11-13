import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@clerk/nextjs/server";

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoaded: false,
  isSignedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload as any;
      state.isSignedIn = action.payload !== null;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isSignedIn = false;
    },
  },
});

export const { setUser, setIsLoaded, logout } = authSlice.actions;
export default authSlice.reducer;
