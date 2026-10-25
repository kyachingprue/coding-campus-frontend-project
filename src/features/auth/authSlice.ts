import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { apiRequest, normalizeUser } from "../../lib/api";
import type { RootState } from "../../app/store";
import type { User } from "../../lib/types";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
  initialized: boolean;
}

interface Credentials {
  email: string;
  password: string;
}

interface ProfileUpdate {
  name?: string;
  bio?: string;
  headline?: string;
  location?: string;
  education?: string;
  currentFocus?: string;
  learningGoal?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  website?: string;
  projectName?: string;
  projectDescription?: string;
  availability?: string;
}

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.status = "loading";
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<User>) {
      state.status = "idle";
      state.user = normalizeUser(action.payload);
      state.error = null;
      state.initialized = true;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
      state.initialized = true;
    },
    authCleared(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.initialized = true;
    },
    profileUpdated(state, action: PayloadAction<User>) {
      if (state.user) state.user = { ...state.user, ...normalizeUser(action.payload) };
    },
  },
});

const { authStart, authSuccess, authFailed, authCleared, profileUpdated } = authSlice.actions;
export { authSuccess };

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected request error occurred.";
}

export function initializeAuth(): AppThunk<Promise<void>> {
  return async (dispatch) => {
    try {
      const { user } = await apiRequest<{ user: User }>("/auth/me");
      dispatch(authSuccess(user));
    } catch {
      dispatch(authCleared());
    }
  };
}

export function registerUser(credentials: Credentials): AppThunk<Promise<{ ok: boolean }>> {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      await apiRequest<{ verificationRequired: true; email: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      dispatch(authCleared());
      return { ok: true };
    } catch (error: unknown) {
      dispatch(authFailed(getErrorMessage(error)));
      return { ok: false };
    }
  };
}

export function verifyRegistrationCode(credentials: { email: string; code: string }): AppThunk<Promise<{ ok: boolean }>> {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      const { user } = await apiRequest<{ user: User }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      dispatch(authSuccess(user));
      return { ok: true };
    } catch (error: unknown) {
      dispatch(authFailed(getErrorMessage(error)));
      return { ok: false };
    }
  };
}

export function loginUser(credentials: Credentials): AppThunk<Promise<{ ok: boolean; user?: User }>> {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      const { user } = await apiRequest<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      dispatch(authSuccess(user));
      return { ok: true, user: normalizeUser(user) };
    } catch (error: unknown) {
      dispatch(authFailed(getErrorMessage(error)));
      return { ok: false };
    }
  };
}

export function logout(): AppThunk<Promise<{ ok: boolean; error?: string }>> {
  return async (dispatch) => {
    let result: { ok: boolean; error?: string } = { ok: true };
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch (error: unknown) {
      result = { ok: false, error: getErrorMessage(error) };
    }
    dispatch(authCleared());
    return result;
  };
}

export function updateProfile(profile: ProfileUpdate): AppThunk<Promise<{ ok: boolean; error?: string }>> {
  return async (dispatch) => {
    try {
      const { user } = await apiRequest<{ user: User }>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(profile),
      });
      dispatch(profileUpdated(user));
      return { ok: true };
    } catch (error: unknown) {
      return { ok: false, error: getErrorMessage(error) };
    }
  };
}

export function updateProfileImage(file: File, type: "avatar" | "cover"): AppThunk<Promise<User>> {
  return async (dispatch) => {
    const form = new FormData();
    form.append("image", file);
    form.append("type", type);
    const { user } = await apiRequest<{ user: User }>("/uploads/profile-image", {
      method: "POST",
      body: form,
    });
    dispatch(profileUpdated(user));
    return normalizeUser(user);
  };
}

export default authSlice.reducer;
