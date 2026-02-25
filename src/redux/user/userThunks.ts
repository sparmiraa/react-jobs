import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi/authApi";

export const getMeThunk = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getMe();
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
