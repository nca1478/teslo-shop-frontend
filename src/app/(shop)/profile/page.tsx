import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    return (
        <div>
            <Title title="Perfil" />

            <pre className="mb-4 p-4">{JSON.stringify(session?.user, null, 2)}</pre>
        </div>
    );
}
