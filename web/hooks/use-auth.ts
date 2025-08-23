import { useQuery } from "@tanstack/react-query";

import { Axios } from "@/app/config/axios";

interface User {
  id: string;
  name: string;
  avatar: string;
  displayName: string;
  hasOnboarded: boolean;
  specialities: string[];
  userType: "freelancer" | "creator";
}

interface UserResponse {
  data: User;
  code: number;
  status: string;
  message: string;
  success: boolean;
}

const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await Axios.get<UserResponse>("/user/me");
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const useAuth = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: fetchUser,
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnReconnect: "always",
    refetchInterval: 2 * 60 * 1000,
    retry: 2,
  });

  return {
    user,
    error,
    isLoading,
    isAuthenticated: !!user,
    hasOnboarded: user?.hasOnboarded,
  };
};
