import { createSignal, For } from "solid-js";

import { FundamentalData, type FundamentalDataDisplayMode } from "../../src/symbol/FundamentalData";
import type { ColorTheme, Size } from "../../src/types";

const POPULAR_STOCKS = [
  { symbol: "NASDAQ:AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc.", sector: "Technology" },
  { symbol: "NASDAQ:MSFT", name: "Microsoft Corp.", sector: "Technology" },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", sector: "Consumer Cyclical" },
  { symbol: "NYSE:JPM", name: "JPMorgan Chase", sector: "Financial Services" },
  { symbol: "NYSE:JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
  { symbol: "NYSE:KO", name: "Coca-Cola", sector: "Consumer Defensive" },
  { symbol: "NYSE:WMT", name: "Walmart", sector: "Consumer Defensive" },
  { symbol: "NYSE:PG", name: "Procter & Gamble", sector: "Consumer Defensive" },
  { symbol: "NYSE:XOM", name: "Exxon Mobil", sector: "Energy" },
  { symbol: "NASDAQ:AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
  { symbol: "NASDAQ:NFLX", name: "Netflix", sector: "Communication Services" },
] as const;

const DISPLAY_MODES: { value: FundamentalDataDisplayMode; label: string; description: string }[] = [
  { value: "adaptive", label: "Adaptive", description: "Automatically adjusts to container size" },
  { value: "regular", label: "Regular", description: "Standard layout with full data display" },
  { value: "compact", label: "Compact", description: "Condensed layout for smaller spaces" },
];

const SIZE_PRESETS = [
  { value: "full", label: "Full" },
  { value: 600, label: "600px" },
  { value: 800, label: "800px" },
  { value: 1000, label: "1000px" },
  { value: 1200, label: "1200px" },
] as const;

export const FundamentalDataTest = () => {
  const [currentSymbol, setCurrentSymbol] = createSignal("NASDAQ:AAPL");
  const [customSymbol, setCustomSymbol] = createSignal("");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("dark");
  const [displayMode, setDisplayMode] = createSignal<FundamentalDataDisplayMode>("adaptive");
  const [width, setWidth] = createSignal<Size>("full");
  const [height, setHeight] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");
  const [autosize, setAutosize] = createSignal(true);
  const [isTransparent, setIsTransparent] = createSignal(false);

  const handleCustomSymbolSubmit = (e: Event) => {
    e.preventDefault();
    const symbol = customSymbol().trim();
    if (symbol) {
      setCurrentSymbol(symbol);
      setCustomSymbol("");
    }
  };

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

  const groupedStocks = () => {
    const groups: Record<string, (typeof POPULAR_STOCKS)[number][]> = {};
    POPULAR_STOCKS.forEach((stock) => {
      if (!groups[stock.sector]) {
        groups[stock.sector] = [];
      }
      groups[stock.sector]!.push(stock);
    });
    return groups;
  };

  return (
    <div class="p-6 bg-white min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">FundamentalData Widget Test</h1>
          <p class="text-gray-600">
            Test the FundamentalData widget with various companies and display configurations.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div class="lg:col-span-1 space-y-6">
            {/* Symbol Selection */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Company Selection</h3>

              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-2">Current Symbol</h4>
                <div class="p-3 bg-white border border-gray-300 rounded-lg">
                  <code class="text-sm font-mono text-indigo-600">{currentSymbol()}</code>
                </div>
              </div>

              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-3">Companies by Sector</h4>
                <div class="space-y-3 max-h-64 overflow-y-auto">
                  <For each={Object.entries(groupedStocks())}>
                    {([sector, stocks]) => (
                      <div>
                        <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          {sector}
                        </h5>
                        <div class="grid grid-cols-1 gap-1">
                          <For each={stocks}>
                            {(stock) => (
                              <button
                                class={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                  currentSymbol() === stock.symbol
                                    ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => setCurrentSymbol(stock.symbol)}
                              >
                                <div class="font-medium">{stock.name}</div>
                                <div class="text-xs text-gray-500">{stock.symbol}</div>
                              </button>
                            )}
                          </For>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <form onSubmit={handleCustomSymbolSubmit} class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-2">Custom Symbol</h4>
                <div class="flex gap-2">
                  <input
                    type="text"
                    value={customSymbol()}
                    onInput={(e) => setCustomSymbol(e.currentTarget.value)}
                    placeholder="e.g., NYSE:DIS"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    type="submit"
                    class="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                  >
                    Set
                  </button>
                </div>
              </form>
            </div>

            {/* Widget Settings */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Widget Settings</h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Display Mode</label>
                  <div class="space-y-2">
                    <For each={DISPLAY_MODES}>
                      {(mode) => (
                        <label class="flex items-start space-x-2">
                          <input
                            type="radio"
                            name="displayMode"
                            checked={displayMode() === mode.value}
                            onChange={() => setDisplayMode(mode.value)}
                            class="mt-1"
                          />
                          <div class="flex-1">
                            <div class="text-sm font-medium text-gray-700">{mode.label}</div>
                            <div class="text-xs text-gray-500">{mode.description}</div>
                          </div>
                        </label>
                      )}
                    </For>
                  </div>
                </div>

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
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Live Widget Preview</h2>

              <div class="space-y-6">
                {/* Main Demo */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">
                    Current Company Fundamentals
                  </h3>
                  <div
                    class="border border-gray-300 rounded-lg overflow-hidden"
                    style={{
                      width: autosize() || width() === "full" ? "100%" : `${width()}px`,
                      height: autosize() || height() === "full" ? "500px" : `${height()}px`,
                    }}
                  >
                    <FundamentalData
                      symbol={currentSymbol()}
                      displayMode={displayMode()}
                      colorTheme={colorTheme()}
                      width={width()}
                      height={height()}
                      autosize={autosize()}
                      isTransparent={isTransparent()}
                    />
                  </div>
                </div>

                {/* Display Mode Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Display Mode Comparison</h3>
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <For each={DISPLAY_MODES}>
                      {(mode) => (
                        <div>
                          <h4 class="text-sm font-medium text-gray-600 mb-2">{mode.label} Mode</h4>
                          <div
                            class="border border-gray-300 rounded-lg overflow-hidden"
                            style={{ height: "300px" }}
                          >
                            <FundamentalData
                              symbol={currentSymbol()}
                              displayMode={mode.value}
                              colorTheme={colorTheme()}
                              width="full"
                              height="full"
                              autosize={true}
                            />
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                {/* Sector Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Sector Leaders Comparison</h3>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <For each={["NASDAQ:AAPL", "NYSE:JPM", "NYSE:JNJ", "NYSE:XOM"]}>
                      {(symbol) => {
                        const stock = POPULAR_STOCKS.find((s) => s.symbol === symbol);
                        return (
                          <div>
                            <h4 class="text-sm font-medium text-gray-600 mb-2">
                              {stock?.name} ({stock?.sector})
                            </h4>
                            <div
                              class="border border-gray-300 rounded-lg overflow-hidden"
                              style={{ height: "250px" }}
                            >
                              <FundamentalData
                                symbol={symbol}
                                displayMode="compact"
                                colorTheme={colorTheme()}
                                width="full"
                                height="full"
                                autosize={true}
                              />
                            </div>
                          </div>
                        );
                      }}
                    </For>
                  </div>
                </div>

                {/* Theme Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Theme Comparison</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">Light Theme</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "350px" }}
                      >
                        <FundamentalData
                          symbol={currentSymbol()}
                          displayMode={displayMode()}
                          colorTheme="light"
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">Dark Theme</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "350px" }}
                      >
                        <FundamentalData
                          symbol={currentSymbol()}
                          displayMode={displayMode()}
                          colorTheme="dark"
                          width="full"
                          height="full"
                          autosize={true}
                        />
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
