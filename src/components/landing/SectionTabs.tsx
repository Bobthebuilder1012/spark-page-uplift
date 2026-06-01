import { useState, ReactNode } from "react";

export type TabItem = { id: string; label: string; content: ReactNode };

export function SectionTabs({ tabs, initialId }: { tabs: TabItem[]; initialId?: string }) {
  const [active, setActive] = useState(initialId ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2 border-b border-black/10">
        {tabs.map((t) => {
          const isActive = t.id === current.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
                isActive ? "text-black" : "text-black/55 hover:text-black/80"
              }`}
            >
              {t.label}
              <span
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-all ${
                  isActive ? "bg-[#32CC6F]" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-10">
        {current.content}
      </div>
    </div>
  );
}
