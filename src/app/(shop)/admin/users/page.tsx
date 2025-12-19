export const revalidate = 0;

import { redirect } from "next/navigation";
import { getPaginatedUsers } from "@/actions";
import { getSession } from "@/lib/session";
import { Pagination, Title } from "@/components";
import { UsersTable } from "./ui/UsersTable";

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function UsersPage({ searchParams }: Props) {
    const { page } = await searchParams;
    const pageParam = page ? parseInt(page) : 1;

    // Get current user session
    const currentUser = await getSession();

    if (!currentUser) {
        redirect("/auth/login");
    }

    const {
        users = [],
        totalPages = 0,
        ok,
    } = await getPaginatedUsers({
        page: pageParam,
    });

    if (users.length === 0 || !ok) {
        redirect("/");
    }

    return (
        <>
            <Title title="Usuarios" />

            <div className="mb-10">
                <UsersTable users={users} currentUser={currentUser} />
            </div>

            <Pagination totalPages={totalPages} />
        </>
    );
}
