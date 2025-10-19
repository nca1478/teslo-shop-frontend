import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";

const ActivityFeed: React.FC = () => {
    const { activities } = useDashboardData();

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <div key={index} className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${activity.color}`}>
                                <Icon size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {activity.title}
                                </p>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all activities
            </button>
        </div>
    );
};

export default ActivityFeed;
