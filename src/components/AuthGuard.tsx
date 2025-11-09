import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function AuthGuard({ children, roles }:{ children: React.ReactNode, roles?: string[] }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");
  if (roles && !roles.includes((session as any).user.role)) redirect("/");
  return <>{children}</>;
}
