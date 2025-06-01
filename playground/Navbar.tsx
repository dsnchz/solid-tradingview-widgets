import { A } from "@solidjs/router";
import { createSignal, For } from "solid-js";

type NavItem = {
  readonly path: string;
  readonly label: string;
  readonly description?: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { path: "/", label: "Home", description: "Overview of all widgets" },
  { path: "/advanced-chart", label: "Advanced Chart", description: "Full-featured trading chart" },
  { path: "/mini-chart", label: "MiniChart", description: "Compact price chart widget" },
  {
    path: "/symbol-overview",
    label: "SymbolOverview",
    description: "Symbol overview with mini chart",
  },
  {
    path: "/technical-analysis",
    label: "Technical Analysis",
    description: "Technical analysis and buy/sell signals",
  },
  { path: "/symbol-info", label: "SymbolInfo", description: "Symbol information and market data" },
  {
    path: "/fundamental-data",
    label: "FundamentalData",
    description: "Company fundamentals and financial metrics",
  },
  {
    path: "/company-profile",
    label: "CompanyProfile",
    description: "Detailed company profiles and business information",
  },
  { path: "/screener", label: "Screener", description: "Multi-market stock and forex screener" },
  { path: "/crypto-market", label: "CryptoMarket", description: "Cryptocurrency market overview" },
  { path: "/single-ticker", label: "SingleTicker", description: "Individual symbol ticker" },
  { path: "/top-stories", label: "TopStories", description: "Financial news and market updates" },
  {
    path: "/economic-calendar",
    label: "EconomicCalendar",
    description: "Economic events and announcements",
  },
];

export const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);

  return (
    <>
      {/* Mobile menu button */}
      <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 flex items-center justify-between">
        <h1 class="text-lg font-bold">TradingView Widgets</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
          class="p-2 rounded-md hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        class={`
        fixed md:relative inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isMobileMenuOpen() ? "translate-x-0" : "-translate-x-full"}
        md:flex
      `}
      >
        {/* Header */}
        <div class="p-6 border-b border-gray-700">
          <h1 class="text-xl font-bold text-white">TradingView Widgets</h1>
          <p class="text-sm text-gray-400 mt-1">Interactive Playground</p>
        </div>

        {/* Navigation */}
        <nav class="flex-1 overflow-y-auto py-4">
          <div class="px-3">
            <h2 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Widget Examples
            </h2>
            <ul class="space-y-1">
              <For each={NAV_ITEMS}>
                {(item) => (
                  <li>
                    <A
                      href={item.path}
                      class="group flex flex-col px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-gray-800 hover:text-white"
                      activeClass="bg-gray-800 text-white"
                      inactiveClass="text-gray-300"
                      end={item.path === "/"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span class="truncate">{item.label}</span>
                      {item.description && (
                        <span class="text-xs text-gray-500 group-hover:text-gray-400 mt-0.5 truncate">
                          {item.description}
                        </span>
                      )}
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div class="p-4 border-t border-gray-700">
          <div class="text-xs text-gray-500">
            <p>Built with SolidJS</p>
            <p class="mt-1">
              <a
                href="https://www.tradingview.com/widget-docs/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-400 hover:text-blue-300 transition-colors"
              >
                TradingView Widgets Docs ↗
              </a>
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen() && (
        <div
          class="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

// Keep the old Navbar export for backward compatibility, but it now renders the Sidebar
export const Navbar = Sidebar;
