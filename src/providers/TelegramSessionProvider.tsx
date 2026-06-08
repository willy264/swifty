"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  attachUserWallet,
  authenticateTelegram,
  getUser,
} from "@/lib/api";
import { DEMO_USER_ID, SESSION_STORAGE_KEY } from "@/data/constants";
import type { UserWithStats } from "@/lib/types";

type TelegramSessionContextValue = {
  user: UserWithStats | null;
  userId: string;
  loading: boolean;
  error: string | null;
  authenticatedViaTelegram: boolean;
  connectWallet: (address: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const TelegramSessionContext = createContext<TelegramSessionContextValue | null>(
  null
);

function readTelegramInitData() {
  if (typeof window === "undefined") return null;

  const telegram = (window as Window & {
    Telegram?: {
      WebApp?: {
        initData?: string;
        ready?: () => void;
        expand?: () => void;
      };
    };
  }).Telegram;

  return telegram?.WebApp?.initData ?? null;
}

type StoredSession = {
  userId: string;
  source: "telegram" | "demo";
};

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function TelegramSessionProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserWithStats | null;
}) {
  const [user, setUser] = useState<UserWithStats | null>(initialUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialUser);
  const [authenticatedViaTelegram, setAuthenticatedViaTelegram] =
    useState(false);
  const currentUserId = user?.id;

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setLoading(true);
      const telegramInitData = readTelegramInitData();
      const stored = readStoredSession();

      if (telegramInitData) {
        try {
          const auth = await authenticateTelegram(telegramInitData);
          if (cancelled) return;

          writeStoredSession({ userId: auth.user.id, source: "telegram" });
          const fresh = await getUser(auth.user.id);
          if (cancelled) return;

          setUser(fresh);
          setAuthenticatedViaTelegram(true);
          setError(null);
          setLoading(false);
          // Tell Telegram we are ready and expand the view
          if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
            (window as any).Telegram.WebApp.ready();
            (window as any).Telegram.WebApp.expand();
          }
          return;
        } catch (authError) {
          if (cancelled) return;

          const errMsg = authError instanceof Error ? authError.message : "Telegram authentication failed.";
          setError(`Auth Error: ${errMsg}`);
          setLoading(false);
          return; // STOP here, do not fallback to demo user if we have initData but it failed
        }
      }

      if (stored?.userId && stored.userId !== currentUserId) {
        try {
          const fresh = await getUser(stored.userId);
          if (cancelled) return;
          setUser(fresh);
          setAuthenticatedViaTelegram(stored.source === "telegram");
          setLoading(false);
          return;
        } catch {
          if (cancelled) return;
        }
      }

      if (!currentUserId) {
        try {
          const fallback = await getUser(DEMO_USER_ID);
          if (cancelled) return;
          setUser(fallback);
          writeStoredSession({ userId: fallback.id, source: "demo" });
          setLoading(false);
        } catch (fallbackError) {
          if (cancelled) return;
          setError(
            fallbackError instanceof Error
              ? fallbackError.message
              : "Unable to load fallback session."
          );
        }
      }

      if (!cancelled) {
        setLoading(false);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const refreshUser = async () => {
    if (!user?.id) return;
    const fresh = await getUser(user.id);
    setUser(fresh);
  };

  const connectWallet = async (address: string) => {
    if (!user?.id) return;
    await attachUserWallet(user.id, address);
    await refreshUser();
  };

  const value: TelegramSessionContextValue = {
    user,
    userId: user?.id ?? DEMO_USER_ID,
    loading,
    error,
    authenticatedViaTelegram,
    connectWallet,
    refreshUser,
  };

  return (
    <TelegramSessionContext.Provider value={value}>
      {children}
    </TelegramSessionContext.Provider>
  );
}

export function useTelegramSession() {
  const context = useContext(TelegramSessionContext);
  if (!context) {
    throw new Error("useTelegramSession must be used within TelegramSessionProvider");
  }
  return context;
}
