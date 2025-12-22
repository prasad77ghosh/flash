/* eslint-disable @typescript-eslint/no-explicit-any */
import { logout, setCredentials } from "@/store/slices/auth-slice";
import { api } from "./axios";
import type { RootState } from "@/store/store";

export const bootstrapAuth = async (
  dispatch: any,
  getState: () => RootState
) => {
  const { auth } = getState();

  // ✅ already authenticated → skip API call
  if (auth.isAuthenticated && auth.user) {
    return;
  }

  try {
    const res = await api.get("/auth/profile");

    dispatch(
      setCredentials({
        user: res.data.data,
      })
    );
  } catch {
    dispatch(logout());
  }
};
