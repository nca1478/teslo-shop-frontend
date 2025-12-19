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
        <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
            <div className="w-full xl:w-[1000px] flex flex-col justify-center text-left">
                <Title title="Dirección" subtitle="Dirección de entrega" />

                <AddressForm countries={countries} userStoredAddress={userAddress ?? undefined} />
            </div>
        </div>
    );
}
