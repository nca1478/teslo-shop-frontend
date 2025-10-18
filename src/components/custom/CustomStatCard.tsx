import StatCard from "@/admin/components/StatCard";
import type { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    value: string;
    change: string;
    changeType: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    color: string;
}

export const CustomStatCard = (props: Props) => {
    return <StatCard {...props} />;
};
