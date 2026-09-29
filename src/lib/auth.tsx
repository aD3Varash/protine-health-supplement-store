"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getDemoProfile, removeDemoProfile, saveDemoProfile, type DemoProfile } from "./demo-store";

type AuthContextValue = {
  profile: DemoProfile | null;
  hydrated: boolean;
  signIn: (profile: DemoProfile) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(getDemoProfile());
    setHydrated(true);
  }, []);

  const signIn = useCallback((nextProfile: DemoProfile) => {
    saveDemoProfile(nextProfile);
    setProfile(nextProfile);
  }, []);

  const signOut = useCallback(() => {
    removeDemoProfile();
    setProfile(null);
  }, []);

  const value = useMemo(() => ({ profile, hydrated, signIn, signOut }), [profile, hydrated, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
