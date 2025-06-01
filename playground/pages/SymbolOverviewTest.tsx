import { createSignal, For } from "solid-js";

import {
  type ChartType,
  type LineType,
  type ScaleMode,
  type ScalePosition,
  SymbolOverview,
  type ValueTrackingMode,
} from "../../src/charts/SymbolOverview";
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
  { symbol: "FX:EURUSD", name: "EUR/USD" },
  { symbol: "TVC:SPX", name: "S&P 500" },
] as const;

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
  { value: "bar", label: "Bar" },
  { value: "candlestick", label: "Candlestick" },
];

const SCALE_MODES: { value: ScaleMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "percentage", label: "Percentage" },
  { value: "logarithmic", label: "Logarithmic" },
];

const VALUE_TRACKING_MODES: { value: ValueTrackingMode; label: string }[] = [
  { value: "floating_tooltip", label: "Floating Tooltip" },
  { value: "colored_tooltip", label: "Colored Tooltip" },
  { value: "legend", label: "Legend" },
  { value: "scale_labels", label: "Scale Labels" },
];

const SIZE_PRESETS = [
  { value: "full", label: "Full" },
  { value: 400, label: "400px" },
  { value: 500, label: "500px" },
  { value: 600, label: "600px" },
  { value: 800, label: "800px" },
  { value: 1000, label: "1000px" },
] as const;

export const SymbolOverviewTest = () => {
  // Symbol controls
  const [selectedSymbols, setSelectedSymbols] = createSignal<string[]>(["NASDAQ:AAPL"]);
  const [customSymbol, setCustomSymbol] = createSignal("");

  // Chart appearance
  const [chartType, setChartType] = createSignal<ChartType>("line");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("dark");
  const [scaleMode, setScaleMode] = createSignal<ScaleMode>("normal");
  const [_scalePosition, _setScalePosition] = createSignal<ScalePosition>("right");
  const [valueTrackingMode, setValueTrackingMode] =
    createSignal<ValueTrackingMode>("floating_tooltip");
  const [_lineType, _setLineType] = createSignal<LineType>("simple");

  // Size controls
  const [width, setWidth] = createSignal<Size>("full");
  const [height, setHeight] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");

  // Display options
  const [showHeader, setShowHeader] = createSignal(true);
  const [showSymbolLogo, setShowSymbolLogo] = createSignal(true);
  const [showMarketStatus, setShowMarketStatus] = createSignal(true);
  const [showDateRanges, setShowDateRanges] = createSignal(true);
  const [showTimeScale, setShowTimeScale] = createSignal(true);
  const [showVolume, setShowVolume] = createSignal(false);
  const [showMA, setShowMA] = createSignal(false);
  const [isTransparent, setIsTransparent] = createSignal(false);

  // Color customization
  const [lineColor, setLineColor] = createSignal("#2196F3");
  const [topColor, setTopColor] = createSignal("rgba(33, 150, 243, 0.3)");
  const [bottomColor, setBottomColor] = createSignal("rgba(33, 150, 243, 0.05)");
  const [upColor, setUpColor] = createSignal("#00C853");
  const [downColor, setDownColor] = createSignal("#FF1744");

  const handleSymbolToggle = (symbol: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol],
    );
  };

  const handleCustomSymbolSubmit = (e: Event) => {
    e.preventDefault();
    const symbol = customSymbol().trim();
    if (symbol && !selectedSymbols().includes(symbol)) {
      setSelectedSymbols((prev) => [...prev, symbol]);
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

  return (
    <div class="p-6 bg-white min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">SymbolOverview Widget Test</h1>
          <p class="text-gray-600">
            Test the SymbolOverview widget with various symbols, chart types, and customization
            options.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div class="lg:col-span-1 space-y-6">
            {/* Symbol Selection */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Symbol Selection</h3>

              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-2">Popular Symbols</h4>
                <div class="grid grid-cols-1 gap-2">
                  <For each={POPULAR_SYMBOLS}>
                    {(item) => (
                      <label class="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedSymbols().includes(item.symbol)}
                          onChange={() => handleSymbolToggle(item.symbol)}
                          class="rounded"
                        />
                        <span class="text-sm text-gray-700">{item.name}</span>
                      </label>
                    )}
                  </For>
                </div>
              </div>

              <form onSubmit={handleCustomSymbolSubmit} class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-2">Add Custom Symbol</h4>
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
                    Add
                  </button>
                </div>
              </form>

              <div class="text-sm text-gray-600">
                Selected: {selectedSymbols().length} symbol
                {selectedSymbols().length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Chart Settings */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Chart Settings</h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Chart Type</label>
                  <select
                    value={chartType()}
                    onChange={(e) => setChartType(e.currentTarget.value as ChartType)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <For each={CHART_TYPES}>
                      {(type) => <option value={type.value}>{type.label}</option>}
                    </For>
                  </select>
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

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Scale Mode</label>
                  <select
                    value={scaleMode()}
                    onChange={(e) => setScaleMode(e.currentTarget.value as ScaleMode)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <For each={SCALE_MODES}>
                      {(mode) => <option value={mode.value}>{mode.label}</option>}
                    </For>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Value Tracking</label>
                  <select
                    value={valueTrackingMode()}
                    onChange={(e) =>
                      setValueTrackingMode(e.currentTarget.value as ValueTrackingMode)
                    }
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <For each={VALUE_TRACKING_MODES}>
                      {(mode) => <option value={mode.value}>{mode.label}</option>}
                    </For>
                  </select>
                </div>
              </div>
            </div>

            {/* Display Options */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Display Options</h3>

              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={showHeader()}
                    onChange={(e) => setShowHeader(e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Show Header</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={showSymbolLogo()}
                    onChange={(e) => setShowSymbolLogo(e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Show Symbol Logo</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={showMarketStatus()}
                    onChange={(e) => setShowMarketStatus(e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Show Market Status</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={showDateRanges()}
                    onChange={(e) => setShowDateRanges(e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Show Date Ranges</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTimeScale()}
                    onChange={(e) => setShowTimeScale(e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Show Time Scale</span>
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
                    checked={showMA()}
                    onChange={(e) => setShowMA(e.currentTarget.checked)}
                    class="mr-2"
                  />
                  <span class="text-sm text-gray-700">Show Moving Average</span>
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
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Size Controls</h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Width Presets</label>
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
                  <label class="block text-sm font-medium text-gray-600 mb-2">Height Presets</label>
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

            {/* Color Customization */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Color Customization</h3>
              <p class="text-xs text-gray-500 mb-3">
                Colors apply based on chart type - see documentation for details
              </p>

              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Line/Area Color
                  </label>
                  <input
                    type="color"
                    value={lineColor()}
                    onInput={(e) => setLineColor(e.currentTarget.value)}
                    class="w-full h-8 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Top Gradient (Area)
                  </label>
                  <input
                    type="text"
                    value={topColor()}
                    onInput={(e) => setTopColor(e.currentTarget.value)}
                    placeholder="rgba(33, 150, 243, 0.3)"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Bottom Gradient (Area)
                  </label>
                  <input
                    type="text"
                    value={bottomColor()}
                    onInput={(e) => setBottomColor(e.currentTarget.value)}
                    placeholder="rgba(33, 150, 243, 0.05)"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Up Color (Bar/Candle)
                  </label>
                  <input
                    type="color"
                    value={upColor()}
                    onInput={(e) => setUpColor(e.currentTarget.value)}
                    class="w-full h-8 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Down Color (Bar/Candle)
                  </label>
                  <input
                    type="color"
                    value={downColor()}
                    onInput={(e) => setDownColor(e.currentTarget.value)}
                    class="w-full h-8 rounded border border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Widget Display */}
          <div class="lg:col-span-3">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Live Widget Preview</h2>

              <div class="space-y-6">
                {/* Main Demo */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Multi-Symbol Overview</h3>
                  <div
                    class="border border-gray-300 rounded-lg overflow-hidden"
                    style={{
                      width: width() === "full" ? "100%" : `${width()}px`,
                      height: height() === "full" ? "400px" : `${height()}px`,
                    }}
                  >
                    <SymbolOverview
                      symbols={selectedSymbols()}
                      chartType={chartType()}
                      colorTheme={colorTheme()}
                      scaleMode={scaleMode()}
                      scalePosition={_scalePosition()}
                      valueTrackingMode={valueTrackingMode()}
                      lineType={_lineType()}
                      width={width()}
                      height={height()}
                      showHeader={showHeader()}
                      showSymbolLogo={showSymbolLogo()}
                      showMarketStatus={showMarketStatus()}
                      showDateRanges={showDateRanges()}
                      showTimeScale={showTimeScale()}
                      showVolume={showVolume()}
                      showMA={showMA()}
                      isTransparent={isTransparent()}
                      color={chartType() === "line" ? lineColor() : undefined}
                      lineColor={chartType() === "area" ? lineColor() : undefined}
                      topColor={chartType() === "area" ? topColor() : undefined}
                      bottomColor={chartType() === "area" ? bottomColor() : undefined}
                      upColor={["bar", "candlestick"].includes(chartType()) ? upColor() : undefined}
                      downColor={
                        ["bar", "candlestick"].includes(chartType()) ? downColor() : undefined
                      }
                    />
                  </div>
                </div>

                {/* Chart Type Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Chart Type Comparison</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <For each={CHART_TYPES}>
                      {(type) => (
                        <div>
                          <h4 class="text-sm font-medium text-gray-600 mb-2 capitalize">
                            {type.label} Chart
                          </h4>
                          <div
                            class="border border-gray-300 rounded-lg overflow-hidden"
                            style={{ height: "200px" }}
                          >
                            <SymbolOverview
                              symbols={[selectedSymbols()[0] || "NASDAQ:AAPL"]}
                              chartType={type.value}
                              colorTheme={colorTheme()}
                              width="full"
                              height="full"
                              showHeader={false}
                              color={type.value === "line" ? lineColor() : undefined}
                              lineColor={type.value === "area" ? lineColor() : undefined}
                              topColor={type.value === "area" ? topColor() : undefined}
                              bottomColor={type.value === "area" ? bottomColor() : undefined}
                              upColor={
                                ["bar", "candlestick"].includes(type.value) ? upColor() : undefined
                              }
                              downColor={
                                ["bar", "candlestick"].includes(type.value)
                                  ? downColor()
                                  : undefined
                              }
                            />
                          </div>
                        </div>
                      )}
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
                        style={{ height: "250px" }}
                      >
                        <SymbolOverview
                          symbols={[selectedSymbols()[0] || "NASDAQ:AAPL"]}
                          chartType={chartType()}
                          colorTheme="light"
                          width="full"
                          height="full"
                          showVolume={showVolume()}
                          showMA={showMA()}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">Dark Theme</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "250px" }}
                      >
                        <SymbolOverview
                          symbols={[selectedSymbols()[0] || "NASDAQ:AAPL"]}
                          chartType={chartType()}
                          colorTheme="dark"
                          width="full"
                          height="full"
                          showVolume={showVolume()}
                          showMA={showMA()}
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
