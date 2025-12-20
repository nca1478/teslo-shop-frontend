"use client";

import { ReactNode } from "react";

interface ResponsiveTableProps {
    children: ReactNode;
    className?: string;
}

export const ResponsiveTable = ({ children, className = "" }: ResponsiveTableProps) => {
    return (
        <div className="w-full overflow-hidden rounded-lg shadow-sm border border-gray-200">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className={`min-w-full ${className}`}>{children}</table>
            </div>
        </div>
    );
};

interface MobileCardProps {
    children: ReactNode;
    className?: string;
}

export const MobileCardContainer = ({ children, className = "" }: MobileCardProps) => {
    return <div className={`md:hidden space-y-4 ${className}`}>{children}</div>;
};

interface MobileCardItemProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const MobileCardItem = ({ children, className = "", onClick }: MobileCardItemProps) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 ${
                onClick ? "cursor-pointer" : ""
            } ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

interface MobileCardFieldProps {
    label: string;
    value: ReactNode;
    className?: string;
}

export const MobileCardField = ({ label, value, className = "" }: MobileCardFieldProps) => {
    return (
        <div
            className={`flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0 ${className}`}
        >
            <span className="text-sm font-medium text-gray-600 shrink-0 mr-3">{label}:</span>
            <div className="text-sm text-gray-900 text-right flex-1 min-w-0">{value}</div>
        </div>
    );
};
