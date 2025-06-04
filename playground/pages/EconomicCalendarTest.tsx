import { createSignal, For } from "solid-js";

import { type Country, EconomicCalendar } from "../../src/calendars/EconomicCalendar";
import type { ColorTheme, Size } from "../../src/types";

const MAJOR_ECONOMIES: { country: Country; region: string; flag: string }[] = [
  { country: "United States", region: "North America", flag: "🇺🇸" },
  { country: "European Union", region: "Europe", flag: "🇪🇺" },
  { country: "China", region: "Asia-Pacific", flag: "🇨🇳" },
  { country: "Japan", region: "Asia-Pacific", flag: "🇯🇵" },
  { country: "United Kingdom", region: "Europe", flag: "🇬🇧" },
  { country: "Germany", region: "Europe", flag: "🇩🇪" },
  { country: "Canada", region: "North America", flag: "🇨🇦" },
  { country: "Australia", region: "Asia-Pacific", flag: "🇦🇺" },
];

const COUNTRY_GROUPS: {
  name: string;
  countries: Country[];
  description: string;
}[] = [
  {
    name: "G7 Countries",
    countries: ["United States", "Japan", "Germany", "United Kingdom", "France", "Italy", "Canada"],
    description: "Major developed economies",
  },
  {
    name: "BRICS",
    countries: ["Brazil", "Russia", "India", "China", "South Africa"],
    description: "Major emerging market economies",
  },
  {
    name: "European Union",
    countries: ["Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Austria"],
    description: "Core EU member states",
  },
  {
    name: "Asia-Pacific",
    countries: ["China", "Japan", "South Korea", "Australia", "India", "Singapore", "Hong Kong"],
    description: "Key Asian and Pacific economies",
  },
  {
    name: "Latin America",
    countries: ["Brazil", "Mexico", "Argentina", "Chile", "Colombia", "Peru"],
    description: "Major Latin American markets",
  },
];

const SIZE_PRESETS = [
  { value: "full", label: "Full" },
  { value: 800, label: "800px" },
  { value: 1000, label: "1000px" },
  { value: 1200, label: "1200px" },
  { value: 1400, label: "1400px" },
] as const;

export const EconomicCalendarTest = () => {
  const [selectedCountries, setSelectedCountries] = createSignal<Country[]>([]);
  const [colorTheme, setColorTheme] = createSignal<ColorTheme>("light");
  const [width, setWidth] = createSignal<Size>("full");
  const [height, setHeight] = createSignal<Size>("full");
  const [customWidth, setCustomWidth] = createSignal("");
  const [customHeight, setCustomHeight] = createSignal("");
  const [autosize, setAutosize] = createSignal(true);
  const [showHighImportanceOnly, setShowHighImportanceOnly] = createSignal(false);
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

  const toggleCountry = (country: Country) => {
    const current = selectedCountries();
    if (current.includes(country)) {
      setSelectedCountries(current.filter((c) => c !== country));
    } else {
      setSelectedCountries([...current, country]);
    }
  };

  const setCountryGroup = (countries: Country[]) => {
    setSelectedCountries(countries);
  };

  const clearCountries = () => {
    setSelectedCountries([]);
  };

  return (
    <div class="p-6 bg-white min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">EconomicCalendar Widget Test</h1>
          <p class="text-gray-600">
            Test the EconomicCalendar widget with different country filters, importance settings,
            and customization options.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div class="lg:col-span-1 space-y-6">
            {/* Country Selection */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Country Filters</h3>

              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-md font-medium text-gray-600">
                    Selected Countries ({selectedCountries().length})
                  </h4>
                  <button
                    onClick={clearCountries}
                    class="text-xs text-red-600 hover:text-red-700"
                    disabled={selectedCountries().length === 0}
                  >
                    Clear All
                  </button>
                </div>
                <div class="max-h-32 overflow-y-auto bg-white border border-gray-300 rounded-lg p-2">
                  {selectedCountries().length === 0 ? (
                    <div class="text-xs text-gray-500 text-center py-2">
                      All countries (no filter)
                    </div>
                  ) : (
                    <div class="flex flex-wrap gap-1">
                      <For each={selectedCountries()}>
                        {(country) => {
                          const countryInfo = MAJOR_ECONOMIES.find((c) => c.country === country);
                          return (
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                              {countryInfo?.flag || "🏳️"} {country}
                              <button
                                onClick={() => toggleCountry(country)}
                                class="ml-1 hover:bg-indigo-200 rounded-full w-4 h-4 flex items-center justify-center"
                              >
                                ×
                              </button>
                            </span>
                          );
                        }}
                      </For>
                    </div>
                  )}
                </div>
              </div>

              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-600 mb-3">Quick Select Groups</h4>
                <div class="space-y-2">
                  <For each={COUNTRY_GROUPS}>
                    {(group) => (
                      <button
                        class="w-full text-left p-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setCountryGroup(group.countries)}
                      >
                        <div class="font-medium">{group.name}</div>
                        <div class="text-xs text-gray-500">{group.description}</div>
                      </button>
                    )}
                  </For>
                </div>
              </div>

              <div>
                <h4 class="text-md font-medium text-gray-600 mb-3">Major Economies</h4>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <For each={MAJOR_ECONOMIES}>
                    {(country) => (
                      <button
                        class={`w-full text-left p-2 text-sm rounded-lg transition-colors ${
                          selectedCountries().includes(country.country)
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => toggleCountry(country.country)}
                      >
                        <div class="flex items-center">
                          <span class="mr-2">{country.flag}</span>
                          <div>
                            <div class="font-medium">{country.country}</div>
                            <div class="text-xs text-gray-500">{country.region}</div>
                          </div>
                        </div>
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>

            {/* Event Settings */}
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Event Settings</h3>

              <div class="space-y-3">
                <label class="flex items-start">
                  <input
                    type="checkbox"
                    checked={showHighImportanceOnly()}
                    onChange={(e) => setShowHighImportanceOnly(e.currentTarget.checked)}
                    class="mr-3 mt-1"
                  />
                  <div>
                    <span class="text-sm text-gray-700 font-medium">High Importance Only</span>
                    <div class="text-xs text-gray-500 mt-1">
                      Show only critical events like Fed meetings, GDP releases, employment data
                    </div>
                  </div>
                </label>

                <div class="pt-2 border-t border-gray-200">
                  <div class="text-xs text-gray-600">
                    <div class="mb-1">
                      <strong>High Importance:</strong> Central bank decisions, GDP, employment
                    </div>
                    <div class="mb-1">
                      <strong>Medium Importance:</strong> Inflation data, retail sales
                    </div>
                    <div>
                      <strong>Low Importance:</strong> Minor economic indicators
                    </div>
                  </div>
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
              <h2 class="text-xl font-semibold text-gray-800 mb-4">
                Live EconomicCalendar Preview
              </h2>

              <div class="space-y-6">
                {/* Main Demo */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">
                    Economic Events
                    {selectedCountries().length > 0
                      ? ` (${selectedCountries().length} ${selectedCountries().length === 1 ? "country" : "countries"})`
                      : " (All Countries)"}
                    {showHighImportanceOnly() && " - High Importance Only"}
                  </h3>
                  <div
                    class="border border-gray-300 rounded-lg overflow-hidden"
                    style={{
                      width: autosize() || width() === "full" ? "100%" : `${width()}px`,
                      height: autosize() || height() === "full" ? "600px" : `${height()}px`,
                    }}
                  >
                    <EconomicCalendar
                      countries={selectedCountries()}
                      showHighImportanceOnly={showHighImportanceOnly()}
                      colorTheme={colorTheme()}
                      width={width()}
                      height={height()}
                      autosize={autosize()}
                      isTransparent={isTransparent()}
                    />
                  </div>
                </div>

                {/* Regional Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">
                    Regional Economic Calendars
                  </h3>
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">🇺🇸 North America</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "400px" }}
                      >
                        <EconomicCalendar
                          countries={["United States", "Canada"]}
                          showHighImportanceOnly={showHighImportanceOnly()}
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">🇪🇺 Europe</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "400px" }}
                      >
                        <EconomicCalendar
                          countries={["European Union", "Germany", "United Kingdom", "France"]}
                          showHighImportanceOnly={showHighImportanceOnly()}
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">🌏 Asia-Pacific</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "400px" }}
                      >
                        <EconomicCalendar
                          countries={["China", "Japan", "Australia", "South Korea"]}
                          showHighImportanceOnly={showHighImportanceOnly()}
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">🌎 Emerging Markets</h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "400px" }}
                      >
                        <EconomicCalendar
                          countries={["Brazil", "India", "South Africa", "Turkey"]}
                          showHighImportanceOnly={showHighImportanceOnly()}
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Importance Level Comparison */}
                <div>
                  <h3 class="text-lg font-medium text-gray-700 mb-3">Event Importance Levels</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">
                        🔴 High Importance Only
                      </h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "350px" }}
                      >
                        <EconomicCalendar
                          countries={["United States", "European Union", "Japan"]}
                          showHighImportanceOnly={true}
                          colorTheme={colorTheme()}
                          width="full"
                          height="full"
                          autosize={true}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-600 mb-2">
                        🟡 All Importance Levels
                      </h4>
                      <div
                        class="border border-gray-300 rounded-lg overflow-hidden"
                        style={{ height: "350px" }}
                      >
                        <EconomicCalendar
                          countries={["United States", "European Union", "Japan"]}
                          showHighImportanceOnly={false}
                          colorTheme={colorTheme()}
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
                  <h3 class="text-lg font-medium text-gray-700 mb-3">EconomicCalendar Features</h3>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">📅 Upcoming Events</h4>
                        <p class="text-gray-600">Track key economic announcements and releases</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">🌍 Global Coverage</h4>
                        <p class="text-gray-600">Events from 80+ countries worldwide</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">⭐ Importance Levels</h4>
                        <p class="text-gray-600">Filter by event significance and market impact</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">📊 Market Impact</h4>
                        <p class="text-gray-600">
                          Understand potential effects on financial markets
                        </p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">🔍 Country Filters</h4>
                        <p class="text-gray-600">Focus on specific regions or economies</p>
                      </div>
                      <div class="bg-white p-3 rounded-lg border">
                        <h4 class="font-medium text-gray-800 mb-2">🕐 Real-time Updates</h4>
                        <p class="text-gray-600">Live updates as events are published</p>
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
