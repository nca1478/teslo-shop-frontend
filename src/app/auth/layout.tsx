import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const user = await getSession();

    if (user) {
        redirect("/");
    }

    return (
        <main className="flex justify-center">
            <div className="w-full sm:w-[350px] px-10">{children}</div>
        </main>
    );
}
