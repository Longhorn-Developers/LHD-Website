"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Member } from '../_data/workerFunctions';
import axios from 'axios';
import { useRouter, useSearchParams } from "next/navigation";

interface AuthContextType {
  user: Member | null;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<Member | null>>;
  handleLogin: (e: React.FormEvent<HTMLFormElement>, email: string, password: string) => void;
  handleForgotPassword: (e: React.FormEvent<HTMLFormElement>, email: string) => void;
  handleLogout: () => void;
  error: string;
  loading: boolean;
  success: string;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleResetPassword: (e: React.FormEvent, password: string, confirmPassword: string) => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Member | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get(
          `${apiKey}/api/auth/me`,
          { withCredentials: true }
        );

        console.log(res.data.user);

        setUser(res.data.user);
        setIsAuthenticated(true);

      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, email: string, password: string) => {
      e.preventDefault();

      // Login backend
      try {
          setLoading(true);
          if (!email || !password) {
              return;
          }

          axios.post(`${apiKey}/api/auth/login`, {email, password})
          .then((res) => {
              setUser(res.data?.user);
              setError('');
              router.replace(`${apiKey}/admin-portal`);
              router.refresh();
          })
          .catch(error => {
              console.log(error.response?.data);

              setError(
                  error.response?.data?.error || "Something went wrong"
              );
                  })

      } catch (error) {
          console.log(error);
      } finally {
        setLoading(false);
      }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiKey}/api/auth/logout`);
      console.log("LOGGING OUT");
      setUser(null);
      router.replace(`${apiKey}/admin-login`);
      router.refresh();

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent, email: string) => {
    e.preventDefault()

    if (!email) return

    setLoading(true)

    try {
      // TODO: Call your forgot-password API
      axios.post(`${apiKey}/api/auth/send-forgot-password`, { email })
      .then((res) => {
        console.log(res.data);
        setSuccess(res.data.message);
      }).catch(err => {
        setError(err.data.message);
        console.log("ERROR");
        console.log(err);
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>, password: string, confirmPassword: string) => {
        e.preventDefault();

        const token = searchParams.get("token");

        setError("");
        setSuccess("");

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
          setLoading(true);
          setError("");
          setSuccess("");

          const res = await axios.post(`${apiKey}/api/auth/reset-password`, {
              token,
              password,
          });

          console.log(res.data.message);
          setSuccess(res.data.message);

      } catch (err: unknown) {
          console.error("Reset password error:", err);

          if (axios.isAxiosError(err)) {
              setError(
                  err.response?.data?.message ||
                  "Unable to reset password. Please try again."
              );
          } else {
              setError("An unexpected error occurred.");
          }

      } finally {
          setLoading(false);
      }
    };

  // const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUser, handleLogin, error, handleLogout, loading, handleForgotPassword, success, setSuccess, setError, handleResetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
