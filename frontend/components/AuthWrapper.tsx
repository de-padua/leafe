"use client";
import { useUserStore } from "@/lib/stores/currentUserStore";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { set, setLoading, setLoadingError,setNotFound, setNull } =
    useUserStore();

  const { data, error } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData({ setLoading }),
  });

  useEffect(() => {
    if (data?.id) {
      setLoading(false);
      set(data);
    }
      }, [data]);

  return <>{children}</>;
}

const getUserData = async ({
  setLoading,
}: {
  setLoading: (loading: boolean) => void;
}): Promise<User | null> => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:5000/auth", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Too many requests");
      } else if (response.status === 401) {
        throw new Error("Unauthorized");
      } else {
        throw new Error("Failed to fetch user data");
      }
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};
