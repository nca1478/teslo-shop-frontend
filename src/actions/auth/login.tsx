"use server";

import { signIn } from "@/config";
import { AuthError } from "next-auth";
// import { sleep } from "@/utils";

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        // await sleep(2);

        await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirect: false,
        });

        return "Success";
    } catch (error) {
        const authError = error as AuthError;
        if (authError.type === "CredentialsSignin") {
            return "CredentialsSignin";
        }
        return "UnknownError";
    }
}
