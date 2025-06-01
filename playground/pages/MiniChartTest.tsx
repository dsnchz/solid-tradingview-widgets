import { createSignal, For } from "solid-js";

import { MiniChart, type MiniChartDateRange } from "../../src/charts/MiniChart";
import type { ColorTheme, Size } from "../../src/types";

const POPULAR_SYMBOLS = [
  { symbol: "NASDAQ:AAPL", name: "Apple Inc." },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc." },
  { symbol: "NASDAQ:MSFT", name: "Microsoft Corp." },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc." },
  { symbol: "NYSE:JPM", name: "JPMorgan Chase" },
  { symbol: "NASDAQ:AMZN", name: "Amazon.com Inc." },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum" },
  { symbol: "FOREX:EURUSD", name: "EUR/USD" },
  { symbol: "SP:SPX", name: "S&P 500" },
] as const;

const DATE_RANGES: { value: MiniChartDateRange; label: string }[] = [
  { value: "1D", label: "1 Day" },
  { value: "1M", label: "1 Month" },
  { value: "3M", label: "3 Months" },
  { value: "1Y", label: "1 Year" },
  { value: "5Y", label: "5 Years" },
  { value: "ALL", label: "All Time" },
];

const SIZE_PRESETS = [
  { value: "full", label: "Full" },
  { value: 300, label: "300px" },
  { value: 400, label: "400px" },
  { value: 500, label: "500px" },
  { value: 600, label: "600px" },
  { value: 800, label: "800px" },
] as const;

const COLOR_PRESETS = [
  { color: undefined, label: "Default" },
  { color: "#2962FF", label: "Blue" },
  { color: "#FF6B35", label: "Orange" },
  { color: "#00C851", label: "Green" },
  { color: "#FF3547", label: "Red" },
  { color: "#8E24AA", label: "Purple" },
  { color: "#FFB300", label: "Amber" },
];

export const MiniChartTest = () => {
  const [currentSymbol, setCurrentSymbol] = createSignal("NASDAQ:AAPL");
  const [customSymbol, setCustomSymbol] = createSignal("");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("light");
  const [dateRange, setDateRange] = createSignal<MiniChartDateRange>("1M");

  // Size controls
  const [autosize, setAutosize] = createSignal(false);
  const [width, setWidth] = createSignal<Size>("full");
  const [height, setHeight] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");

  // Color controls
  const [trendLineColor, setTrendLineColor] = createSignal<string | undefined>(undefined);
  const [underLineColor, setUnderLineColor] = createSignal<string | undefined>(undefined);
  const [underLineBottomColor, setUnderLineBottomColor] = createSignal<string | undefined>(
    undefined,
  );
  const [customTrendColor, setCustomTrendColor] = createSignal("");
  const [customUnderColor, setCustomUnderColor] = createSignal("");
  const [customUnderBottomColor, setCustomUnderBottomColor] = createSignal("");

  // Display options
  const [isTransparent, setIsTransparent] = createSignal(false);
  const [chartOnly, setChartOnly] = createSignal(false);
  const [noTimeScale, setNoTimeScale] = createSignal(false);

  const handleCustomSymbolSubmit = (e: Event) => {
    e.preventDefault();
    const symbol = customSymbol().trim();
    if (symbol) {
      setCurrentSymbol(symbol);
      setCustomSymbol("");
    }
  };

  const handleCustomSizeSubmit = (e: Event) => {
    e.preventDefault();
    const widthValue = parseInt(customWidth().trim());
    const heightValue = parseInt(customHeight().trim());

    if (!isNaN(widthValue) && widthValue > 0) {
      setWidth(widthValue);
      setCustomWidth("");
    }
    if (!isNaN(heightValue) && heightValue > 0) {
      setHeight(heightValue);
      setCustomHeight("");
    }
  };

  const handleTrendColorSubmit = (e: Event) => {
    e.preventDefault();
    const color = customTrendColor().trim();
    if (color) {
      setTrendLineColor(color);
      setCustomTrendColor("");
    }
  };

  const handleUnderColorSubmit = (e: Event) => {
    e.preventDefault();
    const color = customUnderColor().trim();
    if (color) {
      setUnderLineColor(color);
      setCustomUnderColor("");
    }
  };

  const handleUnderBottomColorSubmit = (e: Event) => {
    e.preventDefault();
    const color = customUnderBottomColor().trim();
    if (color) {
      setUnderLineBottomColor(color);
      setCustomUnderBottomColor("");
    }
  };

  return (
    <div class="p-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">MiniChart Widget Test</h1>
      <p class="text-gray-600 mb-6">
        This page demonstrates the MiniChart widget from TradingView. It's a compact, lightweight
        chart perfect for displaying price trends and basic market data in smaller spaces like
        dashboards, sidebars, or overview panels.
      </p>

      {/* Controls Panel */}
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Chart Controls</h2>

        {/* Current Settings Display */}
        <div class="mb-4 p-3 bg-blue-100 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
            <div>
              <span class="text-blue-800 font-medium">Symbol: </span>
              <span class="text-blue-900 font-bold">{currentSymbol()}</span>
            </div>
            <div>
              <span class="text-blue-800 font-medium">Range: </span>
              <span class="text-blue-900 font-bold">{dateRange()}</span>
            </div>
            <div>
              <span class="text-blue-800 font-medium">Size: </span>
              <span class="text-blue-900 font-bold">
                {autosize() ? "Auto" : `${width()}×${height()}`}
              </span>
            </div>
            <div>
              <span class="text-blue-800 font-medium">Theme: </span>
              <span class="text-blue-900 font-bold">{colorTheme()}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-6">
          {/* Symbol Selection */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Symbol</h3>

            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Popular Symbols</h4>
              <div class="grid grid-cols-1 gap-1">
                <For each={POPULAR_SYMBOLS.slice(0, 8)}>
                  {(item) => (
                    <button
                      class={`p-2 rounded text-sm font-medium transition-colors ${
                        currentSymbol() === item.symbol
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
                      }`}
                      onClick={() => setCurrentSymbol(item.symbol)}
                    >
                      <div class="font-bold text-left">{item.symbol.split(":")[1]}</div>
                      <div class="text-xs opacity-80 text-left">{item.name}</div>
                    </button>
                  )}
                </For>
              </div>
            </div>

            <div>
              <h4 class="text-md font-medium text-gray-600 mb-2">Custom Symbol</h4>
              <form onSubmit={handleCustomSymbolSubmit} class="flex gap-1">
                <input
                  type="text"
                  placeholder="e.g. NYSE:NVDA"
                  value={customSymbol()}
                  onInput={(e) => setCustomSymbol(e.currentTarget.value)}
                  class="flex-1 p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  class="px-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                >
                  Set
                </button>
              </form>
            </div>
          </div>

          {/* Date Range & Theme */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Display</h3>

            {/* Date Range */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Date Range</h4>
              <div class="grid grid-cols-2 gap-1">
                <For each={DATE_RANGES}>
                  {(range) => (
                    <button
                      class={`p-1 text-xs rounded transition-colors ${
                        dateRange() === range.value
                          ? "bg-purple-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-purple-50"
                      }`}
                      onClick={() => setDateRange(range.value)}
                    >
                      {range.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Theme */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Theme</h4>
              <div class="flex gap-2">
                <button
                  class={`px-3 py-2 rounded-lg transition-colors ${
                    colorTheme() === "light"
                      ? "bg-yellow-500 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-yellow-50"
                  }`}
                  onClick={() => setColorTheme("light")}
                >
                  Light
                </button>
                <button
                  class={`px-3 py-2 rounded-lg transition-colors ${
                    colorTheme() === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setColorTheme("dark")}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Display Options */}
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={isTransparent()}
                  onChange={(e) => setIsTransparent(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Transparent Background</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={chartOnly()}
                  onChange={(e) => setChartOnly(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Chart Only (No Details)</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={noTimeScale()}
                  onChange={(e) => setNoTimeScale(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Hide Time Scale</span>
              </label>
            </div>
          </div>

          {/* Size Controls */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Size</h3>

            <div class="mb-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={autosize()}
                  onChange={(e) => setAutosize(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700 font-medium">Auto Size</span>
              </label>
            </div>

            {!autosize() && (
              <>
                <div class="mb-4">
                  <h4 class="text-md font-medium text-gray-600 mb-2">Width</h4>
                  <div class="grid grid-cols-2 gap-1 mb-2">
                    <For each={SIZE_PRESETS}>
                      {(preset) => (
                        <button
                          class={`p-1 text-xs rounded transition-colors ${
                            width() === preset.value
                              ? "bg-orange-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-orange-50"
                          }`}
                          onClick={() => setWidth(preset.value)}
                        >
                          {preset.label}
                        </button>
                      )}
                    </For>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="text-md font-medium text-gray-600 mb-2">Height</h4>
                  <div class="grid grid-cols-2 gap-1 mb-2">
                    <For each={SIZE_PRESETS}>
                      {(preset) => (
                        <button
                          class={`p-1 text-xs rounded transition-colors ${
                            height() === preset.value
                              ? "bg-red-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
                          }`}
                          onClick={() => setHeight(preset.value)}
                        >
                          {preset.label}
                        </button>
                      )}
                    </For>
                  </div>
                </div>

                <div>
                  <h4 class="text-md font-medium text-gray-600 mb-2">Custom Size</h4>
                  <form onSubmit={handleCustomSizeSubmit} class="space-y-2">
                    <input
                      type="number"
                      placeholder={`Width (${width()})`}
                      value={customWidth()}
                      onInput={(e) => setCustomWidth(e.currentTarget.value)}
                      class="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      placeholder={`Height (${height()})`}
                      value={customHeight()}
                      onInput={(e) => setCustomHeight(e.currentTarget.value)}
                      class="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="submit"
                      class="w-full px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-xs"
                    >
                      Apply Size
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

          {/* Trend Line Color */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Trend Line</h3>

            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Color Presets</h4>
              <div class="grid grid-cols-1 gap-1">
                <For each={COLOR_PRESETS}>
                  {(preset) => (
                    <button
                      class={`p-1 text-xs rounded transition-colors ${
                        trendLineColor() === preset.color
                          ? "bg-teal-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-teal-50"
                      }`}
                      onClick={() => setTrendLineColor(preset.color)}
                      style={preset.color ? { "border-left": `4px solid ${preset.color}` } : {}}
                    >
                      {preset.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            <div>
              <h4 class="text-md font-medium text-gray-600 mb-2">Custom Color</h4>
              <form onSubmit={handleTrendColorSubmit} class="flex gap-1">
                <input
                  type="text"
                  placeholder="e.g. #FF5722"
                  value={customTrendColor()}
                  onInput={(e) => setCustomTrendColor(e.currentTarget.value)}
                  class="flex-1 p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  class="px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-xs"
                >
                  Set
                </button>
              </form>
              {trendLineColor() && (
                <div class="text-xs text-gray-600 bg-gray-100 p-1 rounded mt-1">
                  {trendLineColor()}
                </div>
              )}
            </div>
          </div>

          {/* Area Colors */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Area Colors</h3>

            {/* Under Line Color */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Under Line (Top)</h4>
              <div class="grid grid-cols-2 gap-1 mb-2">
                <For each={COLOR_PRESETS.slice(0, 4)}>
                  {(preset) => (
                    <button
                      class={`p-1 text-xs rounded transition-colors ${
                        underLineColor() === preset.color
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                      }`}
                      onClick={() => setUnderLineColor(preset.color)}
                      style={preset.color ? { "border-left": `4px solid ${preset.color}` } : {}}
                    >
                      {preset.label}
                    </button>
                  )}
                </For>
              </div>
              <form onSubmit={handleUnderColorSubmit} class="flex gap-1">
                <input
                  type="text"
                  placeholder="Custom color"
                  value={customUnderColor()}
                  onInput={(e) => setCustomUnderColor(e.currentTarget.value)}
                  class="flex-1 p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  class="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-xs"
                >
                  Set
                </button>
              </form>
            </div>

            {/* Under Line Bottom Color */}
            <div>
              <h4 class="text-md font-medium text-gray-600 mb-2">Under Line (Bottom)</h4>
              <div class="grid grid-cols-2 gap-1 mb-2">
                <For each={COLOR_PRESETS.slice(0, 4)}>
                  {(preset) => (
                    <button
                      class={`p-1 text-xs rounded transition-colors ${
                        underLineBottomColor() === preset.color
                          ? "bg-pink-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-pink-50"
                      }`}
                      onClick={() => setUnderLineBottomColor(preset.color)}
                      style={preset.color ? { "border-left": `4px solid ${preset.color}` } : {}}
                    >
                      {preset.label}
                    </button>
                  )}
                </For>
              </div>
              <form onSubmit={handleUnderBottomColorSubmit} class="flex gap-1">
                <input
                  type="text"
                  placeholder="Custom color"
                  value={customUnderBottomColor()}
                  onInput={(e) => setCustomUnderBottomColor(e.currentTarget.value)}
                  class="flex-1 p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  class="px-2 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors text-xs"
                >
                  Set
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Demo */}
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Live MiniChart Demo</h2>
        <div class="flex justify-center">
          <div
            class="border border-gray-200 rounded"
            style={{
              width: autosize() ? "100%" : width() === "full" ? "100%" : `${width()}px`,
              height: autosize() ? "300px" : height() === "full" ? "300px" : `${height()}px`,
              "min-width": "200px",
              "min-height": "150px",
            }}
          >
            <MiniChart
              symbol={currentSymbol()}
              colorTheme={colorTheme()}
              autosize={autosize()}
              width={width()}
              height={height()}
              dateRange={dateRange()}
              trendLineColor={trendLineColor()}
              underLineColor={underLineColor()}
              underLineBottomColor={underLineBottomColor()}
              isTransparent={isTransparent()}
              chartOnly={chartOnly()}
              noTimeScale={noTimeScale()}
            />
          </div>
        </div>
        <p class="text-sm text-gray-500 text-center mt-2">
          Compact chart widget perfect for dashboards and overview displays
        </p>
      </div>

      {/* Multiple Charts Grid */}
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">MiniChart Showcase</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Standard Chart */}
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Standard View</h3>
            <div class="h-48">
              <MiniChart
                symbol={currentSymbol()}
                colorTheme={colorTheme()}
                dateRange="1M"
                autosize={true}
              />
            </div>
          </div>

          {/* Chart Only */}
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Chart Only</h3>
            <div class="h-48">
              <MiniChart
                symbol={currentSymbol()}
                colorTheme={colorTheme()}
                dateRange="1M"
                chartOnly={true}
                autosize={true}
              />
            </div>
          </div>

          {/* Custom Colors */}
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Custom Colors</h3>
            <div class="h-48">
              <MiniChart
                symbol={currentSymbol()}
                colorTheme={colorTheme()}
                dateRange="1M"
                trendLineColor="#FF6B35"
                underLineColor="rgba(255, 107, 53, 0.3)"
                underLineBottomColor="rgba(255, 107, 53, 0.1)"
                autosize={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Different Time Ranges */}
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Date Range Comparison</h2>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={DATE_RANGES.slice(0, 6)}>
            {(range) => (
              <div>
                <h3 class="text-md font-medium text-gray-600 mb-2 text-center">{range.label}</h3>
                <div class="h-32">
                  <MiniChart
                    symbol={currentSymbol()}
                    colorTheme={colorTheme()}
                    dateRange={range.value}
                    chartOnly={true}
                    autosize={true}
                  />
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 class="text-lg font-medium text-green-800 mb-2">About this demo</h3>
        <ul class="text-green-700 space-y-1">
          <li>
            • <strong>Lightweight:</strong> Compact chart perfect for dashboards and overviews
          </li>
          <li>
            • <strong>Flexible Sizing:</strong> Auto-size or custom dimensions with full/pixel
            values
          </li>
          <li>
            • <strong>Date Ranges:</strong> From 1 day to all-time historical data
          </li>
          <li>
            • <strong>Custom Colors:</strong> Customize trend line and area gradient colors
          </li>
          <li>
            • <strong>Display Modes:</strong> Full widget or chart-only views
          </li>
          <li>
            • <strong>Theme Support:</strong> Light and dark theme compatibility
          </li>
        </ul>
      </div>
    </div>
  );
};
