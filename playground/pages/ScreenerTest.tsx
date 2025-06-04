import { createSignal, For } from "solid-js";

import {
  Screener,
  ScreenerColumnViews,
  type ScreenerExchange,
  ScreenerScreenViews,
} from "../../src/screeners/Screener";
import type { ColorTheme, Size } from "../../src/types";

const POPULAR_EXCHANGES: { value: ScreenerExchange; label: string; region: string }[] = [
  { value: "america", label: "United States", region: "Americas" },
  { value: "germany", label: "Germany", region: "Europe" },
  { value: "canada", label: "Canada", region: "Americas" },
  { value: "australia", label: "Australia", region: "Asia-Pacific" },
  { value: "brazil", label: "Brazil", region: "Americas" },
  { value: "china", label: "China", region: "Asia" },
  { value: "india", label: "India", region: "Asia" },
  { value: "forex", label: "Forex", region: "Global" },
  { value: "crypto", label: "Cryptocurrency", region: "Global" },
];

const SIZE_PRESETS = [
  { value: "full", label: "Full" },
  { value: 800, label: "800px" },
  { value: 1000, label: "1000px" },
  { value: 1200, label: "1200px" },
  { value: 1400, label: "1400px" },
] as const;

export const ScreenerTest = () => {
  const [exchange, setExchange] = createSignal<ScreenerExchange>("america");
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("light");
  const [width, setWidth] = createSignal<Size>("full");
  const [height, setHeight] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");
  const [autosize, setAutosize] = createSignal(true);
  const [isTransparent, setIsTransparent] = createSignal(false);
  const [showTopToolbar, setShowTopToolbar] = createSignal(true);

  // Dynamic options based on selected exchange
  const [defaultColumnView, setDefaultColumnView] = createSignal<string>("overview");
  const [defaultScreenView, setDefaultScreenView] = createSignal<string>("most_capitalized");

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

  const availableColumns = () => ScreenerColumnViews[exchange()];
  const availableScreens = () => ScreenerScreenViews[exchange()];

  // Reset column and screen views when exchange changes
  const handleExchangeChange = (newExchange: ScreenerExchange) => {
    setExchange(newExchange);
    const columns = ScreenerColumnViews[newExchange];
    const _screens = ScreenerScreenViews[newExchange];

    // Set defaults based on exchange type
    if (columns.includes("overview")) {
      setDefaultColumnView("overview");
    } else {
      setDefaultColumnView(columns[0]);
    }

    if (newExchange === "forex" || newExchange === "crypto") {
      setDefaultScreenView("general");
    } else {
      setDefaultScreenView("most_capitalized");
    }
  };

  return (
    <div class="p-6 bg-white min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Screener Widget Test</h1>
          <p class="text-gray-600">
            Test the Screener widget with various exchanges, screening criteria, and display
            options.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div class="lg:col-span-1 space-y-6">
            {/* Exchange Selection */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Exchange Selection</h3>

              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-2">Current Exchange</h4>
                <div class="p-3 bg-white border border-gray-300 rounded-lg">
                  <code class="text-sm font-mono text-indigo-600">{exchange()}</code>
                </div>
              </div>

              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-3">Popular Exchanges</h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <For each={POPULAR_EXCHANGES}>
                    {(ex) => (
                      <button
                        class={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          exchange() === ex.value
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => handleExchangeChange(ex.value)}
                      >
                        <div class="font-medium">{ex.label}</div>
                        <div class="text-xs text-gray-500">{ex.region}</div>
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>

            {/* Screener Options */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Screener Options</h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Column View</label>
                  <select
                    value={defaultColumnView()}
                    onChange={(e) => setDefaultColumnView(e.currentTarget.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <For each={availableColumns()}>
                      {(column) => (
                        <option value={column}>
                          {column.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      )}
                    </For>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Screen View</label>
                  <select
                    value={defaultScreenView()}
                    onChange={(e) => setDefaultScreenView(e.currentTarget.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <For each={availableScreens()}>
                      {(screen) => (
                        <option value={screen}>
                          {screen.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      )}
                    </For>
                  </select>
                </div>
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
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      checked={showTopToolbar()}
                      onChange={(e) => setShowTopToolbar(e.currentTarget.checked)}
                      class="mr-2"
                    />
                    <span class="text-sm text-gray-700">Show Top Toolbar</span>
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
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Live Screener Preview</h2>

              <div class="space-y-6">
                {/* Main Demo */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">
                    {exchange() === "forex"
                      ? "Forex Pairs"
                      : exchange() === "crypto"
                        ? "Cryptocurrency"
                        : `${POPULAR_EXCHANGES.find((ex) => ex.value === exchange())?.label || exchange()} Stocks`}{" "}
                    Screener
                  </h3>
                  <div
                    class="border border-gray-300 rounded-lg overflow-hidden"
                    style={{
                      width: autosize() || width() === "full" ? "100%" : `${width()}px`,
                      height: autosize() || height() === "full" ? "600px" : `${height()}px`,
                    }}
                  >
                    <Screener
                      exchange={exchange()}
                      defaultColumnView={defaultColumnView() as "overview"}
                      defaultScreenView={defaultScreenView() as "most_capitalized"}
                      colorTheme={colorTheme()}
                      width={width()}
                      height={height()}
                      autosize={autosize()}
                      isTransparent={isTransparent()}
                      showTopToolbar={showTopToolbar()}
                    />
                  </div>
                </div>

                {/* Exchange Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">
                    Popular Exchanges Comparison
                  </h3>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <For each={["america", "germany", "forex", "crypto"]}>
                      {(ex) => {
                        const exchangeInfo = POPULAR_EXCHANGES.find((e) => e.value === ex);
                        return (
                          <div>
                            <h4 class="text-sm font-medium text-gray-600 mb-2">
                              {exchangeInfo?.label || ex}
                            </h4>
                            <div
                              class="border border-gray-300 rounded-lg overflow-hidden"
                              style={{ height: "400px" }}
                            >
                              <Screener
                                exchange={ex as ScreenerExchange}
                                defaultColumnView="overview"
                                defaultScreenView={
                                  ex === "forex" || ex === "crypto" ? "general" : "most_capitalized"
                                }
                                colorTheme={colorTheme()}
                                width="full"
                                height="full"
                                autosize={true}
                                showTopToolbar={false}
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
                        style={{ height: "400px" }}
                      >
                        <Screener
                          exchange={exchange()}
                          defaultColumnView={defaultColumnView() as "overview"}
                          defaultScreenView={defaultScreenView() as "most_capitalized"}
                          colorTheme="light"
                          width="full"
                          height="full"
                          autosize={true}
                          showTopToolbar={false}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">Dark Theme</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "400px" }}
                      >
                        <Screener
                          exchange={exchange()}
                          defaultColumnView={defaultColumnView() as "overview"}
                          defaultScreenView={defaultScreenView() as "most_capitalized"}
                          colorTheme="dark"
                          width="full"
                          height="full"
                          autosize={true}
                          showTopToolbar={false}
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
