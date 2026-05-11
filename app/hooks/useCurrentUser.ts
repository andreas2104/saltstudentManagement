import { useQuery } from "@tanstack/react-query";

interface User {
  userId: number;
  name: string;
  email: string;
  role?: string;
}

const fetchCurrentUser = async (): Promise<User> => {
  const response = await fetch("/api/user/me", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("failed to fetch current user", error);
    throw new Error("Failed to fetch current user");
  }
  const data = await response.json();
  return data;
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
