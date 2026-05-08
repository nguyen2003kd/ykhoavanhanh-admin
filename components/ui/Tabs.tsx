"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeKey, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex border-b border-gray-200", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
            tab.key === activeKey
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn("ml-2 px-1.5 py-0.5 rounded-full text-xs font-semibold", tab.key === activeKey ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600")}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
