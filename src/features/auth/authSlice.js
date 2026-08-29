import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "codeforge_users";
const SESSION_KEY = "codeforge_session";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

const initialState = {
  user: readSession(),
  status: "idle", // idle | loading | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.status = "loading";
      state.error = null;
    },
    authSuccess(state, action) {
      state.status = "idle";
      state.user = action.payload;
      state.error = null;
      localStorage.setItem(SESSION_KEY, JSON.stringify(action.payload));
    },
    authFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem(SESSION_KEY);
    },
    updateProfile(state, action) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(SESSION_KEY, JSON.stringify(state.user));
      const users = readUsers().map((u) =>
        u.email === state.user.email ? { ...u, ...action.payload } : u
      );
      writeUsers(users);
    },
  },
});

export const { authStart, authSuccess, authFailed, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;

// --- Mock "backend" thunks (simple simulated latency, no real server) ---

export function registerUser({ name, email, password }) {
  return (dispatch) => {
    dispatch(authStart());
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = readUsers();
        if (users.some((u) => u.email === email)) {
          dispatch(authFailed("An account with this email already exists."));
          resolve({ ok: false });
          return;
        }
        const newUser = { id: crypto.randomUUID(), name, email, password, joined: new Date().toISOString(), plan: "Starter" };
        writeUsers([...users, newUser]);
        const { password: _pw, ...safeUser } = newUser;
        dispatch(authSuccess(safeUser));
        resolve({ ok: true });
      }, 500);
    });
  };
}

export function loginUser({ email, password }) {
  return (dispatch) => {
    dispatch(authStart());
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = readUsers();
        const found = users.find((u) => u.email === email && u.password === password);
        if (!found) {
          dispatch(authFailed("Invalid email or password."));
          resolve({ ok: false });
          return;
        }
        const { password: _pw, ...safeUser } = found;
        dispatch(authSuccess(safeUser));
        resolve({ ok: true });
      }, 500);
    });
  };
}
