import { auth } from "@/config";
import { redirect } from "next/navigation";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user) {
        // redirect('/auth/login?returnTo=/perfil');
        // redirect("/auth/login?redirectTo=/checkout/address");
        redirect("/auth/login");
    }

    return <>{children}</>;
}
