import { Footer, Sidebar, TopMenu } from "@/components";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex flex-col">
            <TopMenu />

            <Sidebar />

            <div className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
                {children}
            </div>

            <Footer />
        </main>
    );
}
