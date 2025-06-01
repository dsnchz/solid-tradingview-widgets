import { A } from "@solidjs/router";
import { For } from "solid-js";

type WidgetCard = {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly category: string;
  readonly features: readonly string[];
};

const WIDGET_CARDS: readonly WidgetCard[] = [
  {
    title: "SymbolInfo",
    description:
      "Display comprehensive symbol information including price, market data, and basic details.",
    path: "/symbol-info",
    category: "Symbol",
    features: ["Real-time prices", "Market status", "Symbol metadata", "Multiple display modes"],
  },
  {
    title: "Technical Analysis",
    description:
      "Technical analysis gauges showing buy/sell/neutral recommendations from various indicators.",
    path: "/technical-analysis",
    category: "Symbol",
    features: [
      "Technical indicators",
      "Buy/sell signals",
      "Multiple timeframes",
      "Oscillators & moving averages",
    ],
  },
  {
    title: "Advanced Chart",
    description: "Full-featured interactive trading chart with professional tools and indicators.",
    path: "/advanced-chart",
    category: "Charts",
    features: ["Interactive charts", "50+ indicators", "Drawing tools", "Multiple chart types"],
  },
  {
    title: "MiniChart",
    description: "Compact price chart widget perfect for dashboards and overviews.",
    path: "/mini-chart",
    category: "Charts",
    features: ["Compact design", "Date range selection", "Trend lines", "Custom colors"],
  },
  {
    title: "SymbolOverview",
    description: "Symbol overview widget combining price information with a mini chart.",
    path: "/symbol-overview",
    category: "Charts",
    features: ["Multi-symbol support", "4 chart types", "Volume display", "Moving averages"],
  },
  {
    title: "SingleTicker",
    description: "Individual symbol ticker showing real-time price and change information.",
    path: "/single-ticker",
    category: "Tickers",
    features: ["Real-time updates", "Compact layout", "Multi-asset support", "Customizable themes"],
  },
  {
    title: "FundamentalData",
    description: "Company fundamentals and financial metrics display widget.",
    path: "/fundamental-data",
    category: "Symbol",
    features: ["Financial metrics", "Company data", "Multiple display modes", "Sector information"],
  },
  {
    title: "CompanyProfile",
    description:
      "Detailed company profiles with business information, sector data, and key statistics.",
    path: "/company-profile",
    category: "Symbol",
    features: [
      "Company overview",
      "Business description",
      "Sector & industry",
      "Executive information",
    ],
  },
  {
    title: "Screener",
    description:
      "Powerful multi-market screener for stocks, forex, and crypto with advanced filtering.",
    path: "/screener",
    category: "Screeners",
    features: ["Multi-market support", "Advanced filters", "Custom screens", "Real-time data"],
  },
  {
    title: "CryptoMarket",
    description: "Comprehensive cryptocurrency market overview with thousands of digital assets.",
    path: "/crypto-market",
    category: "Screeners",
    features: ["Crypto market data", "USD/BTC pricing", "Market cap rankings", "Price charts"],
  },
  {
    title: "TopStories",
    description: "Financial news widget with curated market stories designed for quick reading.",
    path: "/top-stories",
    category: "News",
    features: ["20-second reads", "Multiple feed modes", "Symbol-specific news", "Adaptive layout"],
  },
  {
    title: "EconomicCalendar",
    description: "Economic events calendar with global coverage and importance filtering.",
    path: "/economic-calendar",
    category: "Market Data",
    features: ["80+ countries", "Importance levels", "Regional filters", "Market impact info"],
  },
];

// Define category order with Charts first
const CATEGORIES = ["Charts", "Symbol", "Screeners", "Tickers", "News", "Market Data"];

export const Home = () => {
  return (
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">TradingView Widgets Playground</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore and test all available TradingView widgets with interactive examples,
            customization options, and comprehensive documentation.
          </p>
        </div>

        {/* Quick Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-indigo-600 mb-2">{WIDGET_CARDS.length}</div>
            <div class="text-gray-600">Widget Types</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">{CATEGORIES.length}</div>
            <div class="text-gray-600">Categories</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <div class="text-gray-600">Interactive Examples</div>
          </div>
        </div>

        {/* Widget Cards by Category */}
        <For each={CATEGORIES}>
          {(category) => (
            <div class="mb-12">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6">{category}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={WIDGET_CARDS.filter((card) => card.category === category)}>
                  {(widget) => (
                    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <div class="p-6">
                        <div class="flex items-start justify-between mb-4">
                          <h3 class="text-lg font-semibold text-gray-900">{widget.title}</h3>
                          <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                            {widget.category}
                          </span>
                        </div>

                        <p class="text-gray-600 mb-4 text-sm leading-relaxed">
                          {widget.description}
                        </p>

                        <div class="mb-4">
                          <h4 class="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                          <ul class="text-xs text-gray-600 space-y-1">
                            <For each={widget.features}>
                              {(feature) => (
                                <li class="flex items-center">
                                  <span class="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2" />
                                  {feature}
                                </li>
                              )}
                            </For>
                          </ul>
                        </div>

                        <A
                          href={widget.path}
                          class="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                          Try {widget.title}
                          <svg
                            class="ml-2 w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </A>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>

        {/* Footer */}
        <div class="mt-16 pt-8 border-t border-gray-200">
          <div class="text-center">
            <p class="text-gray-600 mb-4">Built with ❤️ using SolidJS and TradingView Widgets</p>
            <div class="flex justify-center space-x-6">
              <a
                href="https://www.tradingview.com/widget-docs/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                TradingView Widget Docs ↗
              </a>
              <a
                href="https://solidjs.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                SolidJS Docs ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
