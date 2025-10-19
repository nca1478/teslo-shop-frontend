import { BarChart3, Eye } from "lucide-react";
import ActivityFeed from "@/admin/components/ActivityFeed";
import Chart from "@/admin/components/Chart";
import QuickActions from "@/admin/components/QuickActions";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { CustomStatCard } from "@/components/custom/CustomStatCard";
import { useDashboardData } from "@/admin/hooks/useDashboardData";

export const DashboardPage = () => {
    const { stats, chartData, performanceData, topPages, systemStatus } = useDashboardData();

    return (
        <>
            {/* Welcome Section */}
            <AdminTitle title="Dashboard" subtitle="Aquí puedes ver el estado de tu negocio" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <CustomStatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts and Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    <Chart title="Traffic Sources" data={chartData} />
                    <Chart title="Performance Metrics" data={performanceData} />
                </div>

                <div className="space-y-6">
                    <ActivityFeed />
                    <QuickActions />
                </div>
            </div>

            {/* Additional Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
                        <Eye size={20} className="text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {topPages.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-900">{item.page}</p>
                                    <p className="text-sm text-gray-600">
                                        {item.views.toLocaleString()} views
                                    </p>
                                </div>
                                <span
                                    className={`text-sm font-medium ${
                                        item.change.startsWith("+")
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {item.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                        <BarChart3 size={20} className="text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {systemStatus.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.service}</p>
                                        <p className="text-sm text-gray-600">{item.status}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {item.uptime}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
