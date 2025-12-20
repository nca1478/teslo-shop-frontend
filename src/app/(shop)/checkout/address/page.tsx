import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";
import { getCountries, getUserAddress } from "@/actions";
import { Country } from "@/interfaces";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AddressPage() {
    const countries: Country[] = await getCountries();
    const user = await getSession();

    if (!user) {
        redirect("/auth/login");
    }

    const userAddress = await getUserAddress();

    return (
        <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-1">
            <div className="mb-8">
                <Title
                    title="Dirección de entrega"
                    subtitle="Completa la información de envío para tu pedido"
                    size="md"
                    className="text-center sm:text-left"
                />
            </div>

            <AddressForm countries={countries} userStoredAddress={userAddress ?? undefined} />
        </div>
    );
}
