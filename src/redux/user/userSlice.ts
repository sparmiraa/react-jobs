import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getMeThunk} from "./userThunks";
import {MeResponseDto} from "../../api/authApi/authTypes";

interface AuthState {
  user: MeResponseDto | null;
  status:
    | "unknown"
    | "loading"
    | "authenticated"
    | "unauthenticated"
    | "failed";
}

const initialState: AuthState = {
  user: null,
  status: "unknown",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeName: (state, action: PayloadAction<string>) => {
      if (!state.user) return;
      state.user.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMeThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export const {changeName} = userSlice.actions;

export default userSlice.reducer;
