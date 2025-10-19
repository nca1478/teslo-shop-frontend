import { useUsers } from "@/auth/hooks/useUsers";
import { useProducts } from "@/shop/hooks/useProducts";
import {
    Bell,
    DollarSign,
    Download,
    FileText,
    Plus,
    Settings,
    ShoppingCart,
    TrendingUp,
    Upload,
    User,
    UserPlus,
    Users,
} from "lucide-react";

export const useDashboardData = () => {
    const { data: users } = useUsers();
    const { data: products } = useProducts();

    const stats = [
        {
            title: "Total de Usuarios",
            value: users?.count.toString() || "0",
            change: "3 usuarios agregados esta semana",
            changeType: "positive" as const,
            icon: Users,
            color: "bg-blue-500",
        },
        {
            title: "Total de Productos",
            value: products?.count.toString() || "0",
            change: "10 productos agregados esta semana",
            changeType: "positive" as const,
            icon: ShoppingCart,
            color: "bg-green-500",
        },
        {
            title: "Orders",
            value: "15",
            change: "10 ordenes rechazadas esta semana",
            changeType: "negative" as const,
            icon: DollarSign,
            color: "bg-purple-500",
        },
        {
            title: "Ventas Completadas",
            value: "3.24%",
            change: "+0.3% desde el último mes",
            changeType: "positive" as const,
            icon: TrendingUp,
            color: "bg-orange-500",
        },
    ];

    const chartData = [
        { label: "Desktop", value: 65 },
        { label: "Mobile", value: 28 },
        { label: "Tablet", value: 7 },
    ];

    const performanceData = [
        { label: "Page Views", value: 24567 },
        { label: "Sessions", value: 18234 },
        { label: "Users", value: 12847 },
        { label: "Bounce Rate", value: 23 },
    ];

    const topPages = [
        { page: "/dashboard", views: 2847, change: "+12%" },
        { page: "/products", views: 1923, change: "+8%" },
        { page: "/analytics", views: 1456, change: "+15%" },
        { page: "/settings", views: 987, change: "-3%" },
    ];

    const systemStatus = [
        {
            service: "API Server",
            status: "Online",
            uptime: "99.9%",
            color: "bg-green-500",
        },
        {
            service: "Database",
            status: "Online",
            uptime: "99.8%",
            color: "bg-green-500",
        },
        {
            service: "Cache Server",
            status: "Warning",
            uptime: "98.2%",
            color: "bg-yellow-500",
        },
        {
            service: "CDN",
            status: "Online",
            uptime: "99.9%",
            color: "bg-green-500",
        },
    ];

    const activities = [
        {
            icon: User,
            title: "New user registered",
            description: "Sarah Johnson joined the platform",
            time: "2 minutes ago",
            color: "bg-blue-500",
        },
        {
            icon: ShoppingCart,
            title: "New order received",
            description: "Order #12847 worth $299.99",
            time: "5 minutes ago",
            color: "bg-green-500",
        },
        {
            icon: FileText,
            title: "Report generated",
            description: "Monthly sales report is ready",
            time: "15 minutes ago",
            color: "bg-purple-500",
        },
        {
            icon: Bell,
            title: "System notification",
            description: "Server maintenance scheduled",
            time: "1 hour ago",
            color: "bg-orange-500",
        },
    ];

    const actions = [
        { icon: Plus, label: "New Project", color: "bg-blue-500 hover:bg-blue-600" },
        { icon: UserPlus, label: "Add User", color: "bg-green-500 hover:bg-green-600" },
        { icon: FileText, label: "Generate Report", color: "bg-purple-500 hover:bg-purple-600" },
        { icon: Download, label: "Export Data", color: "bg-orange-500 hover:bg-orange-600" },
        { icon: Upload, label: "Import Data", color: "bg-teal-500 hover:bg-teal-600" },
        { icon: Settings, label: "Settings", color: "bg-gray-500 hover:bg-gray-600" },
    ];

    return {
        chartData,
        performanceData,
        stats,
        topPages,
        systemStatus,
        activities,
        actions,
    };
};
