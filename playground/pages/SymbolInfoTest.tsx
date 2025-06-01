import { createSignal, For } from "solid-js";

import { SymbolInfo } from "../../src/symbol/SymbolInfo";

const POPULAR_SYMBOLS = [
  { symbol: "NASDAQ:AAPL", name: "Apple Inc." },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc." },
  { symbol: "NASDAQ:MSFT", name: "Microsoft Corp." },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc." },
  { symbol: "NYSE:JPM", name: "JPMorgan Chase" },
  { symbol: "NASDAQ:AMZN", name: "Amazon.com Inc." },
] as const;

export const SymbolInfoTest = () => {
  const [currentSymbol, setCurrentSymbol] = createSignal("NASDAQ:AAPL");
  const [customSymbol, setCustomSymbol] = createSignal("");

  const handleCustomSymbolSubmit = (e: Event) => {
    e.preventDefault();
    const symbol = customSymbol().trim();
    if (symbol) {
      setCurrentSymbol(symbol);
      setCustomSymbol("");
    }
  };

  return (
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">SymbolInfo Widget Test</h1>
      <p class="text-gray-600 mb-6">
        This page demonstrates the reactive SymbolInfo widget from TradingView. Change the symbol
        using the controls below and watch the widget update in real-time!
      </p>

      {/* Symbol Controls */}
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Symbol Controls</h2>

        {/* Current Symbol Display */}
        <div class="mb-4 p-3 bg-blue-100 rounded-lg">
          <span class="text-blue-800 font-medium">Current Symbol: </span>
          <span class="text-blue-900 font-bold">{currentSymbol()}</span>
        </div>

        {/* Popular Symbols */}
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-700 mb-3">Popular Symbols</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
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
          <h3 class="text-lg font-medium text-gray-700 mb-3">Custom Symbol</h3>
          <form onSubmit={handleCustomSymbolSubmit} class="flex gap-2">
            <input
              type="text"
              placeholder="e.g. NYSE:NVDA or BINANCE:BTCUSDT"
              value={customSymbol()}
              onInput={(e) => setCustomSymbol(e.currentTarget.value)}
              class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Apply
            </button>
          </form>
          <p class="text-sm text-gray-500 mt-1">
            Format: EXCHANGE:SYMBOL (e.g., NASDAQ:AAPL, NYSE:TSLA, BINANCE:BTCUSDT)
          </p>
        </div>
      </div>

      {/* Widget Demo */}
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Live Widget Demo</h2>
        <div class="flex justify-center">
          <SymbolInfo symbol={currentSymbol()} colorTheme="dark" width={600} />
        </div>
      </div>

      {/* Multiple Widgets */}
      <div class="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Multiple Widgets Comparison</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Light Theme</h3>
            <SymbolInfo symbol={currentSymbol()} colorTheme="light" width={400} />
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Dark Theme</h3>
            <SymbolInfo symbol={currentSymbol()} colorTheme="dark" width={400} />
          </div>
        </div>
      </div>

      <div class="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 class="text-lg font-medium text-green-800 mb-2">About this demo</h3>
        <ul class="text-green-700 space-y-1">
          <li>
            • <strong>Reactive:</strong> The widget updates automatically when the symbol changes
          </li>
          <li>
            • <strong>Multiple themes:</strong> Compare light and dark themes side by side
          </li>
          <li>
            • <strong>Custom symbols:</strong> Test any valid TradingView symbol
          </li>
          <li>
            • <strong>Popular presets:</strong> Quick access to common stocks
          </li>
        </ul>
      </div>
    </div>
  );
};
