import { Title, SearchResults } from "@/components";

export default function SearchPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <Title title="Búsqueda de Productos" />

            <div className="mt-6">
                <SearchResults />
            </div>
        </div>
    );
}
