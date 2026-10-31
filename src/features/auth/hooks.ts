"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient, ApiError, redirectToLogin } from "@/lib/apiClient";
import { safeNext } from "@/lib/safe-next";

import type { LoginInput } from "./schema";
import type { AuthUser } from "./types";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => (await apiClient<AuthUser>("/auth/me")).data,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (input: LoginInput) =>
      apiClient<AuthUser>("/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });

  const submit = (input: LoginInput, next: string | null) => {
    mutation.mutate(input, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: authKeys.me });
        router.replace(safeNext(next) ?? "/");
        router.refresh();
      },
    });
  };

  return { ...mutation, submit };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => apiClient<unknown>("/auth/logout", { method: "POST" }),
  });

  const logout = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        redirectToLogin();
      },
    });
  };

  return { ...mutation, logout };
}

export function authErrorMessage(error: unknown) {
  if (error instanceof ApiError || error instanceof Error) return error.message;
  return "Something went wrong. Try again.";
}
