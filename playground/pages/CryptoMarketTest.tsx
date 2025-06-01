import { createSignal, For } from "solid-js";

import { CryptoMarket, type CryptoMarketDisplayCurrency } from "../../src/screeners/CryptoMarket";
import type { ColorTheme, Size } from "../../src/types";

const DISPLAY_CURRENCIES: {
  value: CryptoMarketDisplayCurrency;
  label: string;
  description: string;
}[] = [
  {
    value: "USD",
    label: "US Dollar (USD)",
    description: "Display prices in US Dollars - standard fiat currency view",
  },
  {
    value: "BTC",
    label: "Bitcoin (BTC)",
    description: "Display prices in Bitcoin terms - crypto-native perspective",
  },
];

const SIZE_PRESETS = [
  { value: "full", label: "Full" },
  { value: 800, label: "800px" },
  { value: 1000, label: "1000px" },
  { value: 1200, label: "1200px" },
  { value: 1400, label: "1400px" },
] as const;

const POPULAR_CRYPTOS = [
  "Bitcoin (BTC)",
  "Ethereum (ETH)",
  "Binance Coin (BNB)",
  "Cardano (ADA)",
  "Solana (SOL)",
  "Polkadot (DOT)",
  "Dogecoin (DOGE)",
  "Avalanche (AVAX)",
];

export const CryptoMarketTest = () => {
  const [displayCurrency, setDisplayCurrency] = createSignal<CryptoMarketDisplayCurrency>("USD");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("light");
  const [width, setWidth] = createSignal<Size>("full");
  const [height, setHeight] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");
  const [autosize, setAutosize] = createSignal(true);
  const [isTransparent, setIsTransparent] = createSignal(false);

  const handleCustomSizeSubmit = (dimension: "width" | "height") => (e: Event) => {
    e.preventDefault();
    const value = dimension === "width" ? customWidth() : customHeight();
    const setter = dimension === "width" ? setWidth : setHeight;
    const clearInput = dimension === "width" ? setCustomWidth : setCustomHeight;

    const numValue = parseInt(value.trim());
    if (!isNaN(numValue) && numValue > 0) {
      setter(numValue);
      clearInput("");
    }
  };

  return (
    <div class="p-6 bg-white min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">CryptoMarket Widget Test</h1>
          <p class="text-gray-600">
            Test the CryptoMarket widget with different currency displays, themes, and customization
            options.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div class="lg:col-span-1 space-y-6">
            {/* Currency Display */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Currency Display</h3>

              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-2">Current Currency</h4>
                <div class="p-3 bg-white border border-gray-300 rounded-lg">
                  <code class="text-sm font-mono text-indigo-600">{displayCurrency()}</code>
                </div>
              </div>

              <div class="space-y-3">
                <For each={DISPLAY_CURRENCIES}>
                  {(currency) => (
                    <button
                      class={`w-full text-left p-3 rounded-lg transition-colors ${
                        displayCurrency() === currency.value
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setDisplayCurrency(currency.value)}
                    >
                      <div class="font-medium text-sm">{currency.label}</div>
                      <div class="text-xs text-gray-500 mt-1">{currency.description}</div>
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Popular Cryptocurrencies Info */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Popular Cryptocurrencies</h3>
              <div class="text-sm text-gray-600 mb-3">
                The widget displays real-time data for thousands of cryptocurrencies including:
              </div>
              <div class="space-y-1">
                <For each={POPULAR_CRYPTOS}>
                  {(crypto) => (
                    <div class="text-xs text-gray-500 py-1 px-2 bg-white rounded border">
                      {crypto}
                    </div>
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

                    <form onSubmit={handleCustomSizeSubmit("width")} class="mt-2">
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

                    <form onSubmit={handleCustomSizeSubmit("height")} class="mt-2">
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
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Live CryptoMarket Preview</h2>

              <div class="space-y-6">
                {/* Main Demo */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">
                    Cryptocurrency Market Overview ({displayCurrency()})
                  </h3>
                  <div
                    class="border border-gray-300 rounded-lg overflow-hidden"
                    style={{
                      width: autosize() || width() === "full" ? "100%" : `${width()}px`,
                      height: autosize() || height() === "full" ? "600px" : `${height()}px`,
                    }}
                  >
                    <CryptoMarket
                      displayCurrency={displayCurrency()}
                      colorTheme={colorTheme()}
                      width={width()}
                      height={height()}
                      autosize={autosize()}
                      isTransparent={isTransparent()}
                    />
                  </div>
                </div>

                {/* Currency Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">
                    Currency Display Comparison
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">USD Denomination</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "400px" }}
                      >
                        <CryptoMarket
                          displayCurrency="USD"
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">BTC Denomination</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "400px" }}
                      >
                        <CryptoMarket
                          displayCurrency="BTC"
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
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
                        style={{ height: "400px" }}
                      >
                        <CryptoMarket
                          displayCurrency={displayCurrency()}
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
                        style={{ height: "400px" }}
                      >
                        <CryptoMarket
                          displayCurrency={displayCurrency()}
                          colorTheme="dark"
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">CryptoMarket Features</h3>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">💰 Real-time Pricing</h4>
                        <p class="text-gray-600">Live cryptocurrency prices with instant updates</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">📊 Market Data</h4>
                        <p class="text-gray-600">Market cap, volume, and 24h price changes</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">🔄 Dual Currency</h4>
                        <p class="text-gray-600">USD and BTC denomination options</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">📈 Price Charts</h4>
                        <p class="text-gray-600">Mini sparkline charts for quick trend analysis</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">🔍 Search & Filter</h4>
                        <p class="text-gray-600">Find specific cryptocurrencies quickly</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">⚡ Responsive</h4>
                        <p class="text-gray-600">Optimized for all screen sizes</p>
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
