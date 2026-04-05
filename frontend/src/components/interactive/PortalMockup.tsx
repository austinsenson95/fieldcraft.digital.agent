"use client";

const sidebarItems = [
  { label: "Dashboard", active: true },
  { label: "Blueprints", active: false },
  { label: "Content", active: false },
  { label: "Settings", active: false },
];

const blueprintResult = {
  title: "Freedom Business Blueprint",
  subtitle: "Generated for: Online Coach — Fitness & Mindset",
  items: [
    "Core offer structure mapped",
    "3 content pillars identified",
    "Delivery sequence: 6-week drip",
    "Revenue model: subscription + upsell",
  ],
};

export default function PortalMockup() {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-lg border border-field-mint/10 bg-field-obsidian text-sm">
      {/* Sidebar */}
      <div className="hidden w-48 shrink-0 border-r border-field-mint/10 bg-[#141412] p-4 sm:block">
        <div className="mb-6 font-display text-xs font-medium tracking-wider text-field-mint/60 uppercase">
          Portal
        </div>
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`rounded-md px-3 py-2 font-body text-xs ${
                item.active
                  ? "bg-field-verdant/10 text-field-mint"
                  : "text-field-warm-gray/50 hover:text-field-warm-gray/70"
              }`}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="mb-4 font-display text-base font-medium text-field-parchment sm:text-lg">
          Blueprint Generator
        </div>

        {/* Input area */}
        <div className="mb-4 rounded-lg border border-field-mint/10 bg-[#1A1A18] p-3 sm:p-4">
          <div className="mb-2 font-body text-xs text-field-warm-gray/50">
            Describe your business model
          </div>
          <div className="font-body text-xs leading-relaxed text-field-soft-teal/70 sm:text-sm">
            I&apos;m a freedom business coach helping professionals transition
            from 9-5 to location-independent businesses. I offer 1:1 coaching,
            a group program, and digital courses...
          </div>
        </div>

        {/* Result card */}
        <div className="rounded-lg border border-field-verdant/20 bg-field-verdant/5 p-3 sm:p-4">
          <div className="mb-1 font-display text-sm font-medium text-field-mint">
            {blueprintResult.title}
          </div>
          <div className="mb-3 font-body text-xs text-field-warm-gray/50">
            {blueprintResult.subtitle}
          </div>
          <ul className="flex flex-col gap-1.5">
            {blueprintResult.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 font-body text-xs text-field-soft-teal/80"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-field-verdant" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
