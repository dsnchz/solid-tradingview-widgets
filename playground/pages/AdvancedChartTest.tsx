import { createSignal, For } from "solid-js";

import { AdvancedChart } from "../../src/charts/AdvancedChart";
import type { ColorTheme } from "../../src/types";

// Import types from the AdvancedChart file since they're not exported
type Interval = "1" | "3" | "5" | "15" | "30" | "60" | "120" | "180" | "240" | "D" | "W";
type Style =
  | "bars"
  | "candles"
  | "hollow_candles"
  | "area"
  | "line"
  | "line_break"
  | "renko"
  | "heikin_ashi"
  | "kagi"
  | "point_and_figure";
type TimeZone =
  | "exchange"
  | "Etc/UTC"
  | "America/New_York"
  | "America/Los_Angeles"
  | "Europe/London"
  | "Europe/Berlin"
  | "Asia/Tokyo"
  | "Asia/Shanghai"
  | "Asia/Hong_Kong"
  | "Australia/Sydney";

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

const INTERVALS = [
  { value: "1", label: "1m" },
  { value: "3", label: "3m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "30", label: "30m" },
  { value: "60", label: "1h" },
  { value: "120", label: "2h" },
  { value: "180", label: "3h" },
  { value: "240", label: "4h" },
  { value: "D", label: "1D" },
  { value: "W", label: "1W" },
] as const;

const CHART_STYLES = [
  { value: "candles", label: "Candles" },
  { value: "bars", label: "Bars" },
  { value: "hollow_candles", label: "Hollow Candles" },
  { value: "area", label: "Area" },
  { value: "line", label: "Line" },
  { value: "line_break", label: "Line Break" },
  { value: "renko", label: "Renko" },
  { value: "heikin_ashi", label: "Heikin Ashi" },
  { value: "kagi", label: "Kagi" },
  { value: "point_and_figure", label: "Point & Figure" },
] as const;

const TIMEZONES = [
  { value: "exchange", label: "Exchange" },
  { value: "Etc/UTC", label: "UTC" },
  { value: "America/New_York", label: "New York" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Shanghai", label: "Shanghai" },
  { value: "Asia/Hong_Kong", label: "Hong Kong" },
  { value: "Australia/Sydney", label: "Sydney" },
] as const;

const SIZE_PRESETS = [
  { width: 400, height: 300, label: "Small" },
  { width: 600, height: 400, label: "Medium" },
  { width: 800, height: 500, label: "Large" },
  { width: 1000, height: 600, label: "X-Large" },
  { width: 1200, height: 700, label: "XX-Large" },
] as const;

export const AdvancedChartTest = () => {
  const [currentSymbol, setCurrentSymbol] = createSignal("NASDAQ:AAPL");
  const [customSymbol, setCustomSymbol] = createSignal("");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("dark");
  const [interval, setInterval] = createSignal<Interval>("D");
  const [chartStyle, setChartStyle] = createSignal<Style>("candles");
  const [timeZone, setTimeZone] = createSignal<TimeZone>("exchange");

  // Size controls
  const [autosize, setAutosize] = createSignal(true);
  const [width, setWidth] = createSignal(800);
  const [height, setHeight] = createSignal(500);
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");

  // Feature toggles
  const [allowSymbolChange, setAllowSymbolChange] = createSignal(true);
  const [showTopToolbar, setShowTopToolbar] = createSignal(true);
  const [showDrawingToolsBar, setShowDrawingToolsBar] = createSignal(true);
  const [showVolume, setShowVolume] = createSignal(true);
  const [showSymbolDescription, setShowSymbolDescription] = createSignal(true);
  const [showHotlist, setShowHotlist] = createSignal(false);

  // Color controls
  const [backgroundColor, setBackgroundColor] = createSignal<string | undefined>(undefined);
  const [gridColor, setGridColor] = createSignal<string | undefined>(undefined);
  const [customBackgroundColor, setCustomBackgroundColor] = createSignal("");
  const [customGridColor, setCustomGridColor] = createSignal("");

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

  return (
    <div class="p-6 max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">AdvancedChart Widget Test</h1>
      <p class="text-gray-600 mb-6">
        This page demonstrates the powerful AdvancedChart widget from TradingView. This is the most
        feature-rich chart widget with full trading capabilities, technical analysis tools, and
        extensive customization options!
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
              <span class="text-blue-800 font-medium">Interval: </span>
              <span class="text-blue-900 font-bold">{interval()}</span>
            </div>
            <div>
              <span class="text-blue-800 font-medium">Size: </span>
              <span class="text-blue-900 font-bold">
                {autosize() ? "Auto" : `${width()}×${height()}px`}
              </span>
            </div>
            <div>
              <span class="text-blue-800 font-medium">Colors: </span>
              <span class="text-blue-900 font-bold">
                {backgroundColor() || gridColor() ? "Custom" : "Default"}
              </span>
            </div>
          </div>
          {(backgroundColor() || gridColor()) && (
            <div class="mt-2 pt-2 border-t border-blue-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {backgroundColor() && (
                  <div>
                    <span class="text-blue-700">Background: </span>
                    <span class="text-blue-800 font-mono">{backgroundColor()}</span>
                  </div>
                )}
                {gridColor() && (
                  <div>
                    <span class="text-blue-700">Grid: </span>
                    <span class="text-blue-800 font-mono">{gridColor()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-6">
          {/* Symbol Selection */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Symbol</h3>

            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Popular Symbols</h4>
              <div class="grid grid-cols-1 gap-1">
                <For each={POPULAR_SYMBOLS.slice(0, 6)}>
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

          {/* Chart Settings */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Chart Settings</h3>

            {/* Interval */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Interval</h4>
              <div class="grid grid-cols-3 gap-1">
                <For each={INTERVALS}>
                  {(item) => (
                    <button
                      class={`p-1 text-xs rounded transition-colors ${
                        interval() === item.value
                          ? "bg-purple-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-purple-50"
                      }`}
                      onClick={() => setInterval(item.value as Interval)}
                    >
                      {item.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Chart Style */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Chart Style</h4>
              <select
                value={chartStyle()}
                onChange={(e) => setChartStyle(e.currentTarget.value as Style)}
                class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <For each={CHART_STYLES}>
                  {(style) => <option value={style.value}>{style.label}</option>}
                </For>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <h4 class="text-md font-medium text-gray-600 mb-2">Timezone</h4>
              <select
                value={timeZone()}
                onChange={(e) => setTimeZone(e.currentTarget.value as TimeZone)}
                class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <For each={TIMEZONES}>{(tz) => <option value={tz.value}>{tz.label}</option>}</For>
              </select>
            </div>
          </div>

          {/* Color Controls */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Colors</h3>

            {/* Background Color */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Background Color</h4>
              <div class="space-y-2">
                <div class="grid grid-cols-1 gap-1">
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      backgroundColor() === undefined
                        ? "bg-gray-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setBackgroundColor(undefined)}
                  >
                    Default
                  </button>
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      backgroundColor() === "rgba(13, 13, 13, 1)"
                        ? "bg-teal-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-teal-50"
                    }`}
                    onClick={() => setBackgroundColor("rgba(13, 13, 13, 1)")}
                  >
                    Dark RGBA
                  </button>
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      backgroundColor() === "hsl(210, 100%, 95%)"
                        ? "bg-teal-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-teal-50"
                    }`}
                    onClick={() => setBackgroundColor("hsl(210, 100%, 95%)")}
                  >
                    Light HSL
                  </button>
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      backgroundColor() === "oklch(0.1 0.02 200)"
                        ? "bg-teal-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-teal-50"
                    }`}
                    onClick={() => setBackgroundColor("oklch(0.1 0.02 200)")}
                  >
                    Dark OKLCH
                  </button>
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      backgroundColor() === "#1a1a1a"
                        ? "bg-teal-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-teal-50"
                    }`}
                    onClick={() => setBackgroundColor("#1a1a1a")}
                  >
                    Hex Dark
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const color = customBackgroundColor().trim();
                    if (color) {
                      setBackgroundColor(color);
                      setCustomBackgroundColor("");
                    }
                  }}
                  class="flex gap-1"
                >
                  <input
                    type="text"
                    placeholder="Custom color"
                    value={customBackgroundColor()}
                    onInput={(e) => setCustomBackgroundColor(e.currentTarget.value)}
                    class="flex-1 p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    class="px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-xs"
                  >
                    Set
                  </button>
                </form>
                {backgroundColor() && (
                  <div class="text-xs text-gray-600 bg-gray-100 p-1 rounded">
                    {backgroundColor()}
                  </div>
                )}
              </div>
            </div>

            {/* Grid Color */}
            <div>
              <h4 class="text-md font-medium text-gray-600 mb-2">Grid Color</h4>
              <div class="space-y-2">
                <div class="grid grid-cols-1 gap-1">
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      gridColor() === undefined
                        ? "bg-gray-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setGridColor(undefined)}
                  >
                    Default
                  </button>
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      gridColor() === "rgba(255, 0, 0, 0.2)"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
                    }`}
                    onClick={() => setGridColor("rgba(255, 0, 0, 0.2)")}
                  >
                    Red RGBA
                  </button>
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      gridColor() === "hsl(240, 100%, 80%)"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
                    }`}
                    onClick={() => setGridColor("hsl(240, 100%, 80%)")}
                  >
                    Blue HSL
                  </button>
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      gridColor() === "oklch(0.7 0.15 120)"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
                    }`}
                    onClick={() => setGridColor("oklch(0.7 0.15 120)")}
                  >
                    Green OKLCH
                  </button>
                  <button
                    class={`p-1 text-xs rounded transition-colors ${
                      gridColor() === "#ffff0033"
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
                    }`}
                    onClick={() => setGridColor("#ffff0033")}
                  >
                    Yellow Hex+Alpha
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const color = customGridColor().trim();
                    if (color) {
                      setGridColor(color);
                      setCustomGridColor("");
                    }
                  }}
                  class="flex gap-1"
                >
                  <input
                    type="text"
                    placeholder="Custom color"
                    value={customGridColor()}
                    onInput={(e) => setCustomGridColor(e.currentTarget.value)}
                    class="flex-1 p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                  >
                    Set
                  </button>
                </form>
                {gridColor() && (
                  <div class="text-xs text-gray-600 bg-gray-100 p-1 rounded">{gridColor()}</div>
                )}
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Appearance</h3>

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

            {/* Feature Toggles */}
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={allowSymbolChange()}
                  onChange={(e) => setAllowSymbolChange(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Allow Symbol Change</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={showTopToolbar()}
                  onChange={(e) => setShowTopToolbar(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Show Top Toolbar</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={showDrawingToolsBar()}
                  onChange={(e) => setShowDrawingToolsBar(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Show Drawing Tools</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={showVolume()}
                  onChange={(e) => setShowVolume(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Show Volume</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={showSymbolDescription()}
                  onChange={(e) => setShowSymbolDescription(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Show Symbol Description</span>
              </label>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={showHotlist()}
                  onChange={(e) => setShowHotlist(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Show Hotlist</span>
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
                  <h4 class="text-md font-medium text-gray-600 mb-2">Presets</h4>
                  <div class="grid grid-cols-1 gap-1">
                    <For each={SIZE_PRESETS}>
                      {(preset) => (
                        <button
                          class={`p-1 text-xs rounded transition-colors ${
                            width() === preset.width && height() === preset.height
                              ? "bg-orange-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-orange-50"
                          }`}
                          onClick={() => {
                            setWidth(preset.width);
                            setHeight(preset.height);
                          }}
                        >
                          {preset.label} ({preset.width}×{preset.height})
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
        </div>
      </div>

      {/* Main Chart Demo */}
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Live Chart Demo</h2>
        <div class="flex justify-center">
          <div
            class="border border-gray-200 rounded"
            style={{
              width: autosize() ? "100%" : `${width()}px`,
              height: autosize() ? "600px" : `${height()}px`,
              "min-width": "400px",
              "min-height": "300px",
            }}
          >
            <AdvancedChart
              symbol={currentSymbol()}
              colorTheme={colorTheme()}
              autosize={autosize()}
              width={width()}
              height={height()}
              interval={interval()}
              chartStyle={chartStyle()}
              timezone={timeZone()}
              backgroundColor={backgroundColor()}
              gridColor={gridColor()}
              allowSymbolChange={allowSymbolChange()}
              showTopToolbar={showTopToolbar()}
              showDrawingToolsBar={showDrawingToolsBar()}
              showVolume={showVolume()}
              showSymbolDescription={showSymbolDescription()}
              showHotlist={showHotlist()}
            />
          </div>
        </div>
        <p class="text-sm text-gray-500 text-center mt-2">
          Full-featured trading chart with advanced analysis tools
        </p>
      </div>

      {/* Multiple Charts Comparison */}
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Multiple Charts</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">{currentSymbol()} - Daily</h3>
            <div class="h-80">
              <AdvancedChart
                symbol={currentSymbol()}
                colorTheme={colorTheme()}
                autosize={true}
                interval="D"
                chartStyle="candles"
                backgroundColor={backgroundColor()}
                gridColor={gridColor()}
                showTopToolbar={true}
                showDrawingToolsBar={false}
              />
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">{currentSymbol()} - Hourly</h3>
            <div class="h-80">
              <AdvancedChart
                symbol={currentSymbol()}
                colorTheme={colorTheme()}
                autosize={true}
                interval="60"
                chartStyle="line"
                backgroundColor={backgroundColor()}
                gridColor={gridColor()}
                showTopToolbar={true}
                showDrawingToolsBar={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 class="text-lg font-medium text-green-800 mb-2">About this demo</h3>
        <ul class="text-green-700 space-y-1">
          <li>
            • <strong>Full Trading Chart:</strong> Complete TradingView charting experience with all
            tools
          </li>
          <li>
            • <strong>Chart Styles:</strong> Multiple visualization types (candles, bars, line,
            etc.)
          </li>
          <li>
            • <strong>Technical Analysis:</strong> Built-in indicators, drawing tools, and analysis
            features
          </li>
          <li>
            • <strong>Customizable Interface:</strong> Hide/show toolbars, volume, legend, and more
          </li>
          <li>
            • <strong>Multi-timeframe:</strong> From 1-minute to weekly charts
          </li>
          <li>
            • <strong>Global Markets:</strong> Stocks, forex, crypto, indices, and more
          </li>
        </ul>
      </div>
    </div>
  );
};
