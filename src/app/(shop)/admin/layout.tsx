import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getSession();

    if (!user || !user.roles.includes("admin")) {
        redirect("/auth/login");
    }

    return <>{children}</>;
}
