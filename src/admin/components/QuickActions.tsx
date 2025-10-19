import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";

const QuickActions: React.FC = () => {
    const { actions } = useDashboardData();

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={index}
                            className={`flex items-center space-x-3 p-3 rounded-lg text-white transition-colors ${action.color}`}
                        >
                            <Icon size={18} />
                            <span className="text-sm font-medium">{action.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;
