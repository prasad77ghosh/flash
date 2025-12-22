/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { api } from "@/lib/axios";
import { useState } from "react";

interface PostOptions {
  toast?: boolean; // auto-toast
  message?: string
}

export function usePost<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (
    url: string,
    body: any,
    options: PostOptions = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post<T>(url, body);

      if (options.toast) {
        const { toast } = await import("sonner");
        const msg = (res.data as any).msg
        toast.success(msg || options?.message || "Request successful");
      }

      return { success: true, data: res.data };
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      setError(message);

      if (options.toast) {
        const { toast } = await import("sonner");
        toast.error(message);
      }

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    postData,
    loading,
    error,
  };
}
