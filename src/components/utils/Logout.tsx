"use client";
import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";

export const Logout = () => {
  const router = useRouter();
  return (
    <div
      onClick={async () => {
        await authClient.signOut();
        router.refresh();
        router.refresh();
        router.push("/login");
      }}
    >
      Logout
    </div>
  );
};
