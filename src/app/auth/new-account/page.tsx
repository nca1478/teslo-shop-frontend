import { titleFont } from "@/config/fonts/fonts";
import { RegisterForm } from "./ui/RegisterForm";

export default function NewAccountPage() {
    return (
        <div className="flex flex-col min-h-screen pt-20">
            <h1 className={`${titleFont.className} text-4xl mb-5`}>Nueva cuenta</h1>

            <RegisterForm />
        </div>
    );
}
