"use client";

import { changeUserRole } from "@/actions";
import { User } from "@/interfaces";
import { User as SessionUser } from "@/lib/session";
import {
    ResponsiveTable,
    MobileCardContainer,
    MobileCardItem,
    MobileCardField,
} from "@/components/ui/table/ResponsiveTable";

interface Props {
    users: User[];
    currentUser: SessionUser;
}

export const UsersTable = ({ users, currentUser }: Props) => {
    const handleRoleChange = async (userId: string, newRole: string) => {
        // Prevent user from changing their own role
        if (userId === currentUser.id) {
            alert("No puedes cambiar tu propio rol");
            return;
        }

        try {
            const result = await changeUserRole(userId, newRole);

            if (!result.ok) {
                alert(result.message || "Error al cambiar el rol");
            }
        } catch (error) {
            console.error("Error changing role:", error);
            alert("Error inesperado al cambiar el rol");
        }
    };

    return (
        <>
            {/* Desktop Table */}
            <ResponsiveTable>
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th
                            scope="col"
                            className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                        >
                            Nombre
                        </th>
                        <th
                            scope="col"
                            className="text-sm font-semibold text-gray-900 px-4 py-4 text-left"
                        >
                            Email
                        </th>
                        <th
                            scope="col"
                            className="text-sm font-semibold text-gray-900 px-6 py-4 text-left"
                        >
                            Rol
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => {
                        const isCurrentUser = user.id === currentUser.id;

                        return (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="font-medium">{user.name}</span>
                                        {isCurrentUser && (
                                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                Tú
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        disabled={isCurrentUser}
                                        className={`text-sm w-full p-2 rounded-md border border-gray-300 ${
                                            isCurrentUser
                                                ? "bg-gray-100 cursor-not-allowed opacity-60"
                                                : "cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        }`}
                                        title={
                                            isCurrentUser ? "No puedes cambiar tu propio rol" : ""
                                        }
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </ResponsiveTable>

            {/* Mobile Cards */}
            <MobileCardContainer>
                {users.map((user) => {
                    const isCurrentUser = user.id === currentUser.id;

                    return (
                        <MobileCardItem key={user.id}>
                            <MobileCardField
                                label="Nombre"
                                value={
                                    <div className="flex items-center justify-end">
                                        <span className="font-medium">{user.name}</span>
                                        {isCurrentUser && (
                                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                Tú
                                            </span>
                                        )}
                                    </div>
                                }
                            />
                            <MobileCardField
                                label="Email"
                                value={<span className="break-all">{user.email}</span>}
                            />
                            <MobileCardField
                                label="Rol"
                                value={
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        disabled={isCurrentUser}
                                        className={`text-sm w-full max-w-[120px] p-2 rounded-md border border-gray-300 ${
                                            isCurrentUser
                                                ? "bg-gray-100 cursor-not-allowed opacity-60"
                                                : "cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        }`}
                                        title={
                                            isCurrentUser ? "No puedes cambiar tu propio rol" : ""
                                        }
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                }
                            />
                        </MobileCardItem>
                    );
                })}
            </MobileCardContainer>
        </>
    );
};
