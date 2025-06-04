import { createSignal, For } from "solid-js";

import {
  TopStories,
  type TopStoriesDisplayMode,
  type TopStoriesFeedMode,
} from "../../src/news/TopStories";
import type { ColorTheme, Size } from "../../src/types";

const FEED_MODES: { value: TopStoriesFeedMode; label: string; description: string }[] = [
  {
    value: "all_symbols",
    label: "All Symbols",
    description: "General market news from all symbols and sectors",
  },
  {
    value: "market",
    label: "Market",
    description: "Market-wide news and sector-specific stories",
  },
  {
    value: "symbol",
    label: "Symbol-Specific",
    description: "News specific to a particular symbol (requires symbol)",
  },
];

const DISPLAY_MODES: { value: TopStoriesDisplayMode; label: string; description: string }[] = [
  {
    value: "adaptive",
    label: "Adaptive",
    description: "Automatically adjusts layout based on container size",
  },
  {
    value: "regular",
    label: "Regular",
    description: "Standard layout with full article previews",
  },
  {
    value: "compact",
    label: "Compact",
    description: "Condensed layout with minimal article previews",
  },
];

const POPULAR_SYMBOLS = [
  { symbol: "NASDAQ:AAPL", name: "Apple Inc." },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc." },
  { symbol: "NASDAQ:MSFT", name: "Microsoft Corporation" },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc." },
  { symbol: "NYSE:JPM", name: "JPMorgan Chase & Co." },
  { symbol: "NASDAQ:AMZN", name: "Amazon.com Inc." },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum" },
];

const SIZE_PRESETS = [
  { value: "full", label: "Full" },
  { value: 600, label: "600px" },
  { value: 800, label: "800px" },
  { value: 1000, label: "1000px" },
  { value: 1200, label: "1200px" },
] as const;

export const TopStoriesTest = () => {
  const [feedMode, setFeedMode] = createSignal<TopStoriesFeedMode>("all_symbols");
  const [displayMode, setDisplayMode] = createSignal<TopStoriesDisplayMode>("adaptive");
  const [symbol, setSymbol] = createSignal("NASDAQ:AAPL");
  const [customSymbol, setCustomSymbol] = createSignal("");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("light");
  const [width, setWidth] = createSignal<Size>("full");
  const [height, setHeight] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");
  const [autosize, setAutosize] = createSignal(true);
  const [isTransparent, setIsTransparent] = createSignal(false);

  const widthHandler = (e: Event) => {
    e.preventDefault();
    const value = customWidth();

    const numValue = parseInt(value.trim());
    if (!isNaN(numValue) && numValue > 0) {
      setWidth(numValue);
      setCustomWidth("");
    }
  };

  const heightHandler = (e: Event) => {
    e.preventDefault();
    const value = customHeight();

    const numValue = parseInt(value.trim());
    if (!isNaN(numValue) && numValue > 0) {
      setHeight(numValue);
      setCustomHeight("");
    }
  };

  const handleCustomSymbolSubmit = (e: Event) => {
    e.preventDefault();
    const value = customSymbol().trim().toUpperCase();
    if (value) {
      setSymbol(value);
      setCustomSymbol("");
    }
  };

  const getCurrentSymbolInfo = () => {
    return (
      POPULAR_SYMBOLS.find((s) => s.symbol === symbol()) || {
        symbol: symbol(),
        name: "Custom Symbol",
      }
    );
  };

  return (
    <div class="p-6 bg-white min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">TopStories Widget Test</h1>
          <p class="text-gray-600">
            Test the TopStories widget with different feed modes, display options, and customization
            settings.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div class="lg:col-span-1 space-y-6">
            {/* Feed Mode Selection */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Feed Mode</h3>

              <div class="space-y-3">
                <For each={FEED_MODES}>
                  {(mode) => (
                    <button
                      class={`w-full text-left p-3 rounded-lg transition-colors ${
                        feedMode() === mode.value
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setFeedMode(mode.value)}
                    >
                      <div class="font-medium text-sm">{mode.label}</div>
                      <div class="text-xs text-gray-500 mt-1">{mode.description}</div>
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Symbol Selection (only shown for symbol mode) */}
            {feedMode() === "symbol" && (
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Symbol Selection</h3>

                <div class="mb-4">
                  <h4 class="text-md font-medium text-gray-600 mb-2">Current Symbol</h4>
                  <div class="p-3 bg-white border border-gray-300 rounded-lg">
                    <div class="text-sm font-mono text-indigo-600">{symbol()}</div>
                    <div class="text-xs text-gray-500 mt-1">{getCurrentSymbolInfo().name}</div>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="text-md font-medium text-gray-600 mb-3">Popular Symbols</h4>
                  <div class="space-y-2 max-h-40 overflow-y-auto">
                    <For each={POPULAR_SYMBOLS}>
                      {(stock) => (
                        <button
                          class={`w-full text-left p-2 text-sm rounded-lg transition-colors ${
                            symbol() === stock.symbol
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => setSymbol(stock.symbol)}
                        >
                          <div class="font-medium">{stock.name}</div>
                          <div class="text-xs text-gray-500">{stock.symbol}</div>
                        </button>
                      )}
                    </For>
                  </div>
                </div>

                <div>
                  <h4 class="text-md font-medium text-gray-600 mb-2">Custom Symbol</h4>
                  <form onSubmit={handleCustomSymbolSubmit} class="space-y-2">
                    <input
                      type="text"
                      value={customSymbol()}
                      onInput={(e) => setCustomSymbol(e.currentTarget.value)}
                      placeholder="e.g., NASDAQ:NVDA, NYSE:BAC"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      type="submit"
                      class="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                    >
                      Load Symbol
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Display Mode */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Display Mode</h3>

              <div class="space-y-2">
                <For each={DISPLAY_MODES}>
                  {(mode) => (
                    <button
                      class={`w-full text-left p-3 rounded-lg transition-colors ${
                        displayMode() === mode.value
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setDisplayMode(mode.value)}
                    >
                      <div class="font-medium text-sm">{mode.label}</div>
                      <div class="text-xs text-gray-500 mt-1">{mode.description}</div>
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Widget Settings */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Widget Settings</h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Color Theme</label>
                  <div class="flex gap-2">
                    <button
                      class={`px-3 py-2 rounded-lg transition-colors ${
                        colorTheme() === "light"
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                      }`}
                      onClick={() => setColorTheme("light")}
                    >
                      Light
                    </button>
                    <button
                      class={`px-3 py-2 rounded-lg transition-colors ${
                        colorTheme() === "dark"
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                      }`}
                      onClick={() => setColorTheme("dark")}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      checked={autosize()}
                      onChange={(e) => setAutosize(e.currentTarget.checked)}
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">Auto-size to container</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      checked={isTransparent()}
                      onChange={(e) => setIsTransparent(e.currentTarget.checked)}
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">Transparent Background</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Size Controls */}
            {!autosize() && (
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Size Controls</h3>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2">
                      Width Presets
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                      <For each={SIZE_PRESETS}>
                        {(preset) => (
                          <button
                            class={`px-2 py-1 text-xs rounded transition-colors ${
                              width() === preset.value
                                ? "bg-indigo-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                            }`}
                            onClick={() => setWidth(preset.value)}
                          >
                            {preset.label}
                          </button>
                        )}
                      </For>
                    </div>

                    <form onSubmit={widthHandler} class="mt-2">
                      <div class="flex gap-2">
                        <input
                          type="number"
                          value={customWidth()}
                          onInput={(e) => setCustomWidth(e.currentTarget.value)}
                          placeholder="Custom width"
                          class="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <button
                          type="submit"
                          class="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                        >
                          Set
                        </button>
                      </div>
                    </form>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2">
                      Height Presets
                    </label>
                    <div class="grid grid-cols-2 gap-2">
                      <For each={SIZE_PRESETS}>
                        {(preset) => (
                          <button
                            class={`px-2 py-1 text-xs rounded transition-colors ${
                              height() === preset.value
                                ? "bg-indigo-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                            }`}
                            onClick={() => setHeight(preset.value)}
                          >
                            {preset.label}
                          </button>
                        )}
                      </For>
                    </div>

                    <form onSubmit={heightHandler} class="mt-2">
                      <div class="flex gap-2">
                        <input
                          type="number"
                          value={customHeight()}
                          onInput={(e) => setCustomHeight(e.currentTarget.value)}
                          placeholder="Custom height"
                          class="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <button
                          type="submit"
                          class="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                        >
                          Set
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Widget Display */}
          <div class="lg:col-span-3">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Live TopStories Preview</h2>

              <div class="space-y-6">
                {/* Main Demo */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">
                    {feedMode() === "all_symbols"
                      ? "All Market News"
                      : feedMode() === "market"
                        ? "Market News"
                        : `${getCurrentSymbolInfo().name} News`}
                  </h3>
                  <div
                    class="border border-gray-300 rounded-lg overflow-hidden"
                    style={{
                      width: autosize() || width() === "full" ? "100%" : `${width()}px`,
                      height: autosize() || height() === "full" ? "500px" : `${height()}px`,
                    }}
                  >
                    {feedMode() === "symbol" ? (
                      <TopStories
                        feedMode="symbol"
                        symbol={symbol()}
                        displayMode={displayMode()}
                        colorTheme={colorTheme()}
                        width={width()}
                        height={height()}
                        autosize={autosize()}
                        isTransparent={isTransparent()}
                      />
                    ) : (
                      <TopStories
                        feedMode={feedMode() as Exclude<TopStoriesFeedMode, "symbol">}
                        displayMode={displayMode()}
                        colorTheme={colorTheme()}
                        width={width()}
                        height={height()}
                        autosize={autosize()}
                        isTransparent={isTransparent()}
                      />
                    )}
                  </div>
                </div>

                {/* Feed Mode Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Feed Mode Comparison</h3>
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">All Symbols</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "350px" }}
                      >
                        <TopStories
                          feedMode="all_symbols"
                          displayMode={displayMode()}
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">Market News</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "350px" }}
                      >
                        <TopStories
                          feedMode="market"
                          displayMode={displayMode()}
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">Apple News</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "350px" }}
                      >
                        <TopStories
                          feedMode="symbol"
                          symbol="NASDAQ:AAPL"
                          displayMode={displayMode()}
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Mode Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Display Mode Comparison</h3>
                  <div class="grid grid-cols-3 gap-4">
                    <For each={DISPLAY_MODES}>
                      {(mode) => (
                        <div>
                          <h4 class="text-sm font-medium text-gray-600 mb-2">{mode.label}</h4>
                          <div
                            class="border border-gray-300 rounded-lg overflow-hidden"
                            style={{ height: "300px" }}
                          >
                            {feedMode() === "symbol" ? (
                              <TopStories
                                feedMode="symbol"
                                symbol={symbol()}
                                displayMode={mode.value}
                                colorTheme={colorTheme()}
                                width="full"
                                height="full"
                                autosize={true}
                              />
                            ) : (
                              <TopStories
                                feedMode={feedMode() as Exclude<TopStoriesFeedMode, "symbol">}
                                displayMode={mode.value}
                                colorTheme={colorTheme()}
                                width="full"
                                height="full"
                                autosize={true}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">TopStories Features</h3>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">📰 Financial News</h4>
                        <p class="text-gray-600">
                          Curated financial news designed for quick reading
                        </p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">⏱️ 20-Second Reads</h4>
                        <p class="text-gray-600">Daily news briefs optimized for busy traders</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">🎯 Multiple Feeds</h4>
                        <p class="text-gray-600">All market, sector, or symbol-specific news</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">📱 Responsive</h4>
                        <p class="text-gray-600">Adaptive layout for all screen sizes</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">🔄 Real-time</h4>
                        <p class="text-gray-600">Live updates of latest market news</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">🎨 Customizable</h4>
                        <p class="text-gray-600">Multiple display modes and themes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
