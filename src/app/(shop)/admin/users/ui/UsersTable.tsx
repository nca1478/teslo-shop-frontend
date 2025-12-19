"use client";

import { changeUserRole } from "@/actions";
import { User } from "@/interfaces";
import { User as SessionUser } from "@/lib/session";

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
        <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
                <tr>
                    <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                        Nombre
                    </th>
                    <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                    >
                        Email
                    </th>
                    <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                        Rol
                    </th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => {
                    const isCurrentUser = user.id === currentUser.id;

                    return (
                        <tr
                            key={user.id}
                            className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                        >
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {user.name}
                                {isCurrentUser && (
                                    <span className="ml-2 text-xs text-blue-600 font-medium">
                                        (Tú)
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.email}
                            </td>
                            <td className="flex items-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    disabled={isCurrentUser}
                                    className={`text-sm text-gray-900 w-full p-2 ${
                                        isCurrentUser
                                            ? "bg-gray-100 cursor-not-allowed opacity-60"
                                            : "cursor-pointer"
                                    }`}
                                    title={isCurrentUser ? "No puedes cambiar tu propio rol" : ""}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
