import { getSession } from "@/lib/session";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getSession();

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <div>
            <Title title="Perfil" />

            <pre className="mb-4 p-4">{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
}
