import { getSession } from "@/lib/session";
import { Title, ProfileForm } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getSession();

    if (!user) {
        redirect("/auth/login");
    }

    const title = "Mi Perfil";
    const subtitle = "Actualiza tu información personal y configuración de cuenta";

    return (
        <div className="space-y-6">
            <Title
                title={title}
                subtitle={subtitle}
                size="md"
                className="text-center sm:text-left"
            />

            <ProfileForm />
        </div>
    );
}
