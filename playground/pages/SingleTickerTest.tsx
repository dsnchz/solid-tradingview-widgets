import { createSignal, For } from "solid-js";

import { SingleTicker } from "../../src/tickers/SingleTicker";
import type { ColorTheme, Size } from "../../src/types";

const POPULAR_SYMBOLS = [
  { symbol: "NASDAQ:AAPL", name: "Apple Inc.", category: "Tech Stocks" },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc.", category: "Tech Stocks" },
  { symbol: "NASDAQ:MSFT", name: "Microsoft Corp.", category: "Tech Stocks" },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", category: "Tech Stocks" },
  { symbol: "NYSE:JPM", name: "JPMorgan Chase", category: "Financial" },
  { symbol: "NYSE:JNJ", name: "Johnson & Johnson", category: "Healthcare" },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin/USDT", category: "Cryptocurrency" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum/USDT", category: "Cryptocurrency" },
  { symbol: "BINANCE:ADAUSDT", name: "Cardano/USDT", category: "Cryptocurrency" },
  { symbol: "FX:EURUSD", name: "EUR/USD", category: "Forex" },
  { symbol: "FX:GBPUSD", name: "GBP/USD", category: "Forex" },
  { symbol: "FX:USDJPY", name: "USD/JPY", category: "Forex" },
  { symbol: "TVC:SPX", name: "S&P 500", category: "Indices" },
  { symbol: "TVC:DJI", name: "Dow Jones", category: "Indices" },
  { symbol: "COMEX:GC1!", name: "Gold Futures", category: "Commodities" },
  { symbol: "NYMEX:CL1!", name: "Crude Oil", category: "Commodities" },
] as const;

const SIZE_PRESETS = [
  { value: "full", label: "Full Width" },
  { value: 200, label: "200px" },
  { value: 300, label: "300px" },
  { value: 400, label: "400px" },
  { value: 500, label: "500px" },
  { value: 600, label: "600px" },
] as const;

export const SingleTickerTest = () => {
  const [currentSymbol, setCurrentSymbol] = createSignal("NASDAQ:AAPL");
  const [customSymbol, setCustomSymbol] = createSignal("");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("dark");
  const [width, setWidth] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [isTransparent, setIsTransparent] = createSignal(false);

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

  const groupedSymbols = () => {
    const groups: Record<string, (typeof POPULAR_SYMBOLS)[number][]> = {};
    POPULAR_SYMBOLS.forEach((symbol) => {
      if (!groups[symbol.category]) {
        groups[symbol.category] = [];
      }
      groups[symbol.category]!.push(symbol);
    });
    return groups;
  };

  return (
    <div class="p-6 bg-white min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">SingleTicker Widget Test</h1>
          <p class="text-gray-600">
            Test the SingleTicker widget with various financial instruments and customization
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
                <h4 class="text-md font-medium text-gray-600 mb-2">Current Symbol</h4>
                <div class="p-3 bg-white border border-gray-300 rounded-lg">
                  <code class="text-sm font-mono text-indigo-600">{currentSymbol()}</code>
                </div>
              </div>

              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-3">Popular Symbols by Category</h4>
                <div class="space-y-3">
                  <For each={Object.entries(groupedSymbols())}>
                    {([category, symbols]) => (
                      <div>
                        <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          {category}
                        </h5>
                        <div class="grid grid-cols-1 gap-1">
                          <For each={symbols}>
                            {(symbol) => (
                              <button
                                class={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                  currentSymbol() === symbol.symbol
                                    ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => setCurrentSymbol(symbol.symbol)}
                              >
                                <div class="font-medium">{symbol.name}</div>
                                <div class="text-xs text-gray-500">{symbol.symbol}</div>
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

                  <form onSubmit={handleCustomWidthSubmit} class="mt-2">
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
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Current Symbol Ticker</h3>
                  <div
                    class="border border-gray-300 rounded-lg overflow-hidden p-4 bg-gray-50"
                    style={{
                      width: width() === "full" ? "100%" : `${width()}px`,
                    }}
                  >
                    <SingleTicker
                      symbol={currentSymbol()}
                      width={width()}
                      colorTheme={colorTheme()}
                      isTransparent={isTransparent()}
                    />
                  </div>
                </div>

                {/* Multi-Category Showcase */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Multi-Asset Showcase</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={Object.entries(groupedSymbols())}>
                      {([category, symbols]) => (
                        <div>
                          <h4 class="text-md font-medium text-gray-600 mb-3">{category}</h4>
                          <div class="space-y-2">
                            <For each={symbols.slice(0, 2)}>
                              {(symbol) => (
                                <div class="border border-gray-300 rounded-lg overflow-hidden">
                                  <SingleTicker
                                    symbol={symbol.symbol}
                                    width="full"
                                    colorTheme={colorTheme()}
                                    isTransparent={false}
                                  />
                                </div>
                              )}
                            </For>
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
                      <div class="border border-gray-300 rounded-lg overflow-hidden">
                        <SingleTicker
                          symbol={currentSymbol()}
                          width="full"
                          colorTheme="light"
                          isTransparent={false}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">Dark Theme</h4>
                      <div class="border border-gray-300 rounded-lg overflow-hidden">
                        <SingleTicker
                          symbol={currentSymbol()}
                          width="full"
                          colorTheme="dark"
                          isTransparent={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Size Comparison</h3>
                  <div class="space-y-4">
                    <For each={SIZE_PRESETS.slice(1, 4)}>
                      {(preset) => (
                        <div>
                          <h4 class="text-sm font-medium text-gray-600 mb-2">
                            Width: {preset.label}
                          </h4>
                          <div
                            class="border border-gray-300 rounded-lg overflow-hidden inline-block"
                            style={{ width: `${preset.value}px` }}
                          >
                            <SingleTicker
                              symbol={currentSymbol()}
                              width={preset.value}
                              colorTheme={colorTheme()}
                              isTransparent={false}
                            />
                          </div>
                        </div>
                      )}
                    </For>
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
