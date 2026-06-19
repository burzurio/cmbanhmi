import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

type AdminOrdersLayoutProps = {
  children: ReactNode;
};

export default async function AdminOrdersLayout({ children }: AdminOrdersLayoutProps) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session")?.value;

  if (adminSession !== "authenticated") {
    redirect("/admin/login");
  }

  return children;
}
