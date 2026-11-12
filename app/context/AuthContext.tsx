"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Member } from '../_data/workerFunctions';
import axios from 'axios';
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: Member | null;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<Member | null>>;
  handleLogin: (e: React.FormEvent<HTMLFormElement>, email: string, password: string) => void;
  handleLogout: () => void;
  error: string;
  loading: boolean;
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
  const router = useRouter();

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

  const handleLogin = (e: React.FormEvent<HTMLFormElement>, email: string, password: string) => {
      e.preventDefault();

      // Login backend
      try {
          if (!email || !password) {
              return;
          }

          axios.post(`${apiKey}/api/auth/login`, {email, password})
          .then((res) => {
              setUser(res.data?.user);
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
      }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiKey}/api/auth/logout`);
      setUser(null);
      router.replace(`${apiKey}/admin-login`);
      router.refresh();

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUser, handleLogin, error, handleLogout, loading }}
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
