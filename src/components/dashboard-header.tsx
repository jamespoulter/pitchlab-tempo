"use client";

import { ReactNode } from "react";

interface DashboardHeaderProps {
  heading: string;
  description?: string;
  children?: ReactNode;
}

export function DashboardHeader({
  heading,
  description,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">{heading}</h1>
        {description && (
          <p className="text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
} 