import { createSignal, For } from "solid-js";

import {
  TechnicalAnalysis,
  type TechnicalAnalysisInterval,
} from "../../src/symbol/TechnicalAnalysis";
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
] as const;

const INTERVALS = [
  { value: "1m", label: "1 minute" },
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "4h", label: "4 hours" },
  { value: "1D", label: "1 day" },
  { value: "1W", label: "1 week" },
] as const;

const SIZE_PRESETS = [
  { value: "full", label: "Full" },
  { value: 300, label: "300px" },
  { value: 400, label: "400px" },
  { value: 500, label: "500px" },
  { value: 600, label: "600px" },
  { value: 800, label: "800px" },
  { value: 1000, label: "1000px" },
] as const;

export const TechnicalAnalysisTest = () => {
  const [currentSymbol, setCurrentSymbol] = createSignal("NASDAQ:AAPL");
  const [customSymbol, setCustomSymbol] = createSignal("");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("dark");
  const [interval, setInterval] = createSignal<TechnicalAnalysisInterval>("5m");
  const [displayMode, setDisplayMode] = createSignal<"single" | "multiple">("single");
  const [showIntervalTabs, setShowIntervalTabs] = createSignal(false);
  const [isTransparent, setIsTransparent] = createSignal(false);

  // Size controls
  const [width, setWidth] = createSignal<Size>("full");
  const [height, setHeight] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");

  const handleCustomSymbolSubmit = (e: Event) => {
    e.preventDefault();
    const symbol = customSymbol().trim();
    if (symbol) {
      setCurrentSymbol(symbol);
      setCustomSymbol("");
    }
  };

  const handleCustomWidthSubmit = (e: Event) => {
    e.preventDefault();
    const widthValue = parseInt(customWidth().trim());
    if (!isNaN(widthValue) && widthValue > 0) {
      setWidth(widthValue);
      setCustomWidth("");
    }
  };

  const handleCustomHeightSubmit = (e: Event) => {
    e.preventDefault();
    const heightValue = parseInt(customHeight().trim());
    if (!isNaN(heightValue) && heightValue > 0) {
      setHeight(heightValue);
      setCustomHeight("");
    }
  };

  return (
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">TechnicalAnalysis Widget Test</h1>
      <p class="text-gray-600 mb-6">
        This page demonstrates the reactive TechnicalAnalysis widget from TradingView. Adjust the
        settings below and watch the widget update in real-time with technical analysis data!
      </p>

      {/* Controls Panel */}
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Widget Controls</h2>

        {/* Current Symbol Display */}
        <div class="mb-4 p-3 bg-blue-100 rounded-lg">
          <span class="text-blue-800 font-medium">Current Symbol: </span>
          <span class="text-blue-900 font-bold">{currentSymbol()}</span>
          <span class="text-blue-700 ml-4">Size: </span>
          <span class="text-blue-900 font-bold">
            {width()}×{height()}
            {width() === "full" || height() === "full" ? "" : "px"}
          </span>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Symbol Selection */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Symbol Selection</h3>

            {/* Popular Symbols */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Popular Symbols</h4>
              <div class="grid grid-cols-2 gap-2">
                <For each={POPULAR_SYMBOLS}>
                  {(item) => (
                    <button
                      class={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        currentSymbol() === item.symbol
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
                      }`}
                      onClick={() => setCurrentSymbol(item.symbol)}
                    >
                      <div class="font-bold">{item.symbol.split(":")[1]}</div>
                      <div class="text-xs opacity-80">{item.name}</div>
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Custom Symbol Input */}
            <div>
              <h4 class="text-md font-medium text-gray-600 mb-2">Custom Symbol</h4>
              <form onSubmit={handleCustomSymbolSubmit} class="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. NYSE:NVDA"
                  value={customSymbol()}
                  onInput={(e) => setCustomSymbol(e.currentTarget.value)}
                  class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit"
                  class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>

          {/* Widget Settings */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Widget Settings</h3>

            {/* Interval Selection */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Time Interval</h4>
              <div class="grid grid-cols-4 gap-1">
                <For each={INTERVALS}>
                  {(item) => (
                    <button
                      class={`p-1 text-xs rounded transition-colors ${
                        interval() === item.value
                          ? "bg-purple-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-purple-50"
                      }`}
                      onClick={() => setInterval(item.value)}
                    >
                      {item.label}
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Theme Selection */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Color Theme</h4>
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

            {/* Display Mode */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Display Mode</h4>
              <div class="flex gap-2">
                <button
                  class={`px-3 py-2 rounded-lg transition-colors ${
                    displayMode() === "single"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                  }`}
                  onClick={() => setDisplayMode("single")}
                >
                  Single
                </button>
                <button
                  class={`px-3 py-2 rounded-lg transition-colors ${
                    displayMode() === "multiple"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                  }`}
                  onClick={() => setDisplayMode("multiple")}
                >
                  Multiple
                </button>
              </div>
            </div>

            {/* Toggle Options */}
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={showIntervalTabs()}
                  onChange={(e) => setShowIntervalTabs(e.currentTarget.checked)}
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Show Interval Tabs</span>
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

          {/* Size Controls */}
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Size Controls</h3>

            {/* Width Selection */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Width</h4>
              <div class="grid grid-cols-2 gap-1 mb-2">
                <For each={SIZE_PRESETS}>
                  {(item) => (
                    <button
                      class={`p-1 text-xs rounded transition-colors ${
                        width() === item.value
                          ? "bg-orange-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-orange-50"
                      }`}
                      onClick={() => setWidth(item.value)}
                    >
                      {item.label}
                    </button>
                  )}
                </For>
              </div>
              <form onSubmit={handleCustomWidthSubmit} class="flex gap-1">
                <input
                  type="number"
                  placeholder="Custom width"
                  value={customWidth()}
                  onInput={(e) => setCustomWidth(e.currentTarget.value)}
                  class="flex-1 p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  class="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-xs"
                >
                  Set
                </button>
              </form>
            </div>

            {/* Height Selection */}
            <div class="mb-4">
              <h4 class="text-md font-medium text-gray-600 mb-2">Height</h4>
              <div class="grid grid-cols-2 gap-1 mb-2">
                <For each={SIZE_PRESETS}>
                  {(item) => (
                    <button
                      class={`p-1 text-xs rounded transition-colors ${
                        height() === item.value
                          ? "bg-red-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
                      }`}
                      onClick={() => setHeight(item.value)}
                    >
                      {item.label}
                    </button>
                  )}
                </For>
              </div>
              <form onSubmit={handleCustomHeightSubmit} class="flex gap-1">
                <input
                  type="number"
                  placeholder="Custom height"
                  value={customHeight()}
                  onInput={(e) => setCustomHeight(e.currentTarget.value)}
                  class="flex-1 p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="submit"
                  class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                >
                  Set
                </button>
              </form>
            </div>

            {/* Quick Size Presets */}
            <div>
              <h4 class="text-md font-medium text-gray-600 mb-2">Quick Presets</h4>
              <div class="space-y-1">
                <button
                  class="w-full p-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setWidth(800);
                    setHeight(600);
                  }}
                >
                  Desktop (800×600)
                </button>
                <button
                  class="w-full p-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setWidth(400);
                    setHeight(300);
                  }}
                >
                  Tablet (400×300)
                </button>
                <button
                  class="w-full p-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setWidth(300);
                    setHeight(400);
                  }}
                >
                  Mobile (300×400)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Widget Demo */}
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Live Widget Demo</h2>
        <div class="flex justify-center">
          <div
            class="border border-gray-200 rounded"
            style={{
              width: width() === "full" ? "100%" : `${width()}px`,
              height: height() === "full" ? "400px" : `${height()}px`,
              "min-width": "200px",
              "min-height": "200px",
            }}
          >
            <TechnicalAnalysis
              symbol={currentSymbol()}
              colorTheme={colorTheme()}
              interval={interval()}
              displayMode={displayMode()}
              showIntervalTabs={showIntervalTabs()}
              isTransparent={isTransparent()}
              width={width()}
              height={height()}
            />
          </div>
        </div>
        <p class="text-sm text-gray-500 text-center mt-2">
          Current size: {width() === "full" ? "100%" : `${width()}px`} ×{" "}
          {height() === "full" ? "400px" : `${height()}px`}
        </p>
      </div>

      {/* Size Comparison Grid */}
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Size Comparison</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <For
            each={[
              { w: 300, h: 200, name: "Small" },
              { w: 400, h: 300, name: "Medium" },
              { w: 500, h: 350, name: "Large" },
            ]}
          >
            {(size) => (
              <div class="text-center">
                <h3 class="text-md font-medium text-gray-600 mb-2">
                  {size.name} ({size.w}×{size.h})
                </h3>
                <div
                  class="border border-gray-200 rounded mx-auto"
                  style={{
                    width: `${size.w}px`,
                    height: `${size.h}px`,
                  }}
                >
                  <TechnicalAnalysis
                    symbol={currentSymbol()}
                    colorTheme={colorTheme()}
                    interval={interval()}
                    displayMode={displayMode()}
                    showIntervalTabs={showIntervalTabs()}
                    width={size.w}
                    height={size.h}
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
            • <strong>Size Testing:</strong> Test how the widget adapts to different dimensions
          </li>
          <li>
            • <strong>Custom Sizes:</strong> Set exact pixel dimensions or use "full" for responsive
            sizing
          </li>
          <li>
            • <strong>Preset Options:</strong> Quick access to common sizes and device formats
          </li>
          <li>
            • <strong>Size Comparison:</strong> See multiple sizes side-by-side
          </li>
          <li>
            • <strong>Real-time Updates:</strong> All widgets update automatically when settings
            change
          </li>
        </ul>
      </div>
    </div>
  );
};
