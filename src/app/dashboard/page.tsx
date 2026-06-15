import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// Role-aware entry: auto-redirect to the right dashboard.
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.role === "operator") redirect("/dashboard/operator");
  redirect("/dashboard/member");
}
