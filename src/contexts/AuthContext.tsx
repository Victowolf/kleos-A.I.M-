/**
 * 📦 Authentication Context for VaultKYC
 *
 * Manages user authentication state across the application.
 *
 * TODO for blockchain developer:
 * - Replace with Web3/MetaMask provider
 * - Add wallet connection management
 * - Implement blockchain-based session handling
 * - Add multi-wallet support (MetaMask, WalletConnect, etc.)
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  AuthState,
  User,
  authenticateUser,
  saveAuthState,
  loadAuthState,
  clearAuthState,
} from "../utils/auth";

// 🔄 Auth Action Types
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "RESTORE_SESSION"; payload: AuthState };

// 📊 Extended Auth State
interface ExtendedAuthState extends AuthState {
  loading: boolean;
  error: string | null;
}

// 🎯 Auth Context Type
interface AuthContextType {
  state: ExtendedAuthState;
  login: (
    username: string,
    password: string,
    role: "admin" | "staff"
  ) => Promise<boolean>;
  logout: () => void;
}

// 🏭 Initial State
const initialState: ExtendedAuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  loading: false,
  error: null,
};

// 🔄 Auth Reducer
const authReducer = (
  state: ExtendedAuthState,
  action: AuthAction
): ExtendedAuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        role: action.payload.role,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        role: null,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...initialState,
      };

    case "RESTORE_SESSION":
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

// 🎯 Create Context
const AuthContext = createContext<AuthContextType | null>(null);

// 🏗️ Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔄 Restore session on app load
  useEffect(() => {
    const storedAuth = loadAuthState();
    if (storedAuth && storedAuth.isAuthenticated) {
      dispatch({ type: "RESTORE_SESSION", payload: storedAuth });
    }
  }, []);

  // 💾 Save auth state to localStorage when it changes
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      saveAuthState({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        role: state.role,
      });
    }
  }, [state.isAuthenticated, state.user, state.role]);

  // 🔐 Login function
  const login = async (
    username: string,
    password: string,
    role: "admin" | "staff"
  ): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const user = await authenticateUser(username, password, role);

      if (user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      } else {
        dispatch({
          type: "LOGIN_ERROR",
          payload: "Invalid credentials or wallet address",
        });
        return false;
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: "Login failed. Please try again.",
      });
      return false;
    }
  };

  // 🚪 Logout function
  const logout = (): void => {
    clearAuthState();
    dispatch({ type: "LOGOUT" });
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🪝 Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
