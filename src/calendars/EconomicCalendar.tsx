import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Supported countries for economic calendar filtering.
 *
 * The economic calendar can be filtered to show events from specific countries.
 * This includes major economies from all continents with comprehensive coverage
 * of North America, Europe, Asia-Pacific, Middle East, Africa, and Latin America.
 *
 * @example
 * ```tsx
 * // Show events from major economies
 * <EconomicCalendar countries={["United States", "Germany", "Japan"]} />
 *
 * // Focus on European Union events
 * <EconomicCalendar countries={["European Union", "Germany", "France", "Italy"]} />
 *
 * // Emerging markets focus
 * <EconomicCalendar countries={["China", "India", "Brazil", "South Africa"]} />
 * ```
 */
export type Country =
  // North America
  | "United States"
  | "Canada"

  // Europe
  | "Austria"
  | "Belgium"
  | "Cyprus"
  | "Czech Republic"
  | "Denmark"
  | "Estonia"
  | "European Union"
  | "Finland"
  | "France"
  | "Germany"
  | "Greece"
  | "Hungary"
  | "Iceland"
  | "Ireland"
  | "Italy"
  | "Latvia"
  | "Lithuania"
  | "Luxembourg"
  | "Netherlands"
  | "Norway"
  | "Poland"
  | "Portugal"
  | "Romania"
  | "Russia"
  | "Serbia"
  | "Slovakia"
  | "Spain"
  | "Sweden"
  | "Switzerland"
  | "Ukraine"
  | "United Kingdom"
  // Middle East / Africa
  | "Angola"
  | "Bahrain"
  | "Botswana"
  | "Egypt"
  | "Ethiopia"
  | "Ghana"
  | "Israel"
  | "Kenya"
  | "Kuwait"
  | "Malawi"
  | "Mauritius"
  | "Morocco"
  | "Mozambique"
  | "Namibia"
  | "Nigeria"
  | "Oman"
  | "Qatar"
  | "Rwanda"
  | "Saudi Arabia"
  | "Seychelles"
  | "South Africa"
  | "Tanzania"
  | "Tunisia"
  | "Turkey"
  | "Uganda"
  | "United Arab Emirates"
  | "Zambia"
  | "Zimbabwe"

  // Mexico and South America
  | "Argentina"
  | "Brazil"
  | "Chile"
  | "Colombia"
  | "Mexico"
  | "Peru"
  | "Venezuela"

  // Asia / Pacific
  | "Australia"
  | "Bangladesh"
  | "China"
  | "Hong Kong"
  | "India"
  | "Indonesia"
  | "Japan"
  | "South Korea"
  | "Sri Lanka"
  | "Malaysia"
  | "New Zealand"
  | "Pakistan"
  | "Philippines"
  | "Singapore"
  | "Taiwan"
  | "Thailand"
  | "Vietnam";

/**
 * Maps country names to their ISO country codes used by TradingView's API.
 * @internal
 */
const CountryMap: Record<Country, string> = {
  // North America
  "United States": "us",
  Canada: "ca",

  // Europe
  Austria: "at",
  Belgium: "be",
  Cyprus: "cy",
  "Czech Republic": "cz",
  Denmark: "dk",
  Estonia: "ee",
  "European Union": "eu", // Not standard ISO, but accepted by TradingView
  Finland: "fi",
  France: "fr",
  Germany: "de",
  Greece: "gr",
  Hungary: "hu",
  Iceland: "is",
  Ireland: "ie",
  Italy: "it",
  Latvia: "lv",
  Lithuania: "lt",
  Luxembourg: "lu",
  Netherlands: "nl",
  Norway: "no",
  Poland: "pl",
  Portugal: "pt",
  Romania: "ro",
  Russia: "ru",
  Serbia: "rs",
  Slovakia: "sk",
  Spain: "es",
  Sweden: "se",
  Switzerland: "ch",
  Ukraine: "ua",
  "United Kingdom": "gb",

  // Middle East / Africa
  Angola: "ao",
  Bahrain: "bh",
  Botswana: "bw",
  Egypt: "eg",
  Ethiopia: "et",
  Ghana: "gh",
  Israel: "il",
  Kenya: "ke",
  Kuwait: "kw",
  Malawi: "mw",
  Mauritius: "mu",
  Morocco: "ma",
  Mozambique: "mz",
  Namibia: "na",
  Nigeria: "ng",
  Oman: "om",
  Qatar: "qa",
  Rwanda: "rw",
  "Saudi Arabia": "sa",
  Seychelles: "sc",
  "South Africa": "za",
  Tanzania: "tz",
  Tunisia: "tn",
  Turkey: "tr",
  Uganda: "ug",
  "United Arab Emirates": "ae",
  Zambia: "zm",
  Zimbabwe: "zw",

  // Mexico and South America
  Argentina: "ar",
  Brazil: "br",
  Chile: "cl",
  Colombia: "co",
  Mexico: "mx",
  Peru: "pe",
  Venezuela: "ve",

  // Asia / Pacific
  Australia: "au",
  Bangladesh: "bd",
  China: "cn",
  "Hong Kong": "hk",
  India: "in",
  Indonesia: "id",
  Japan: "jp",
  "South Korea": "kr",
  "Sri Lanka": "lk",
  Malaysia: "my",
  "New Zealand": "nz",
  Pakistan: "pk",
  Philippines: "ph",
  Singapore: "sg",
  Taiwan: "tw",
  Thailand: "th",
  Vietnam: "vn",
};

/**
 * Props for the EconomicCalendar component.
 */
export type EconomicCalendarProps = {
  /**
   * Widget width in pixels. Ignored if `autosize` is true.
   * @default "full"
   */
  readonly width?: Size;

  /**
   * Widget height in pixels. Ignored if `autosize` is true.
   * @default "full"
   */
  readonly height?: Size;

  /**
   * Locale for widget interface and date/time formatting.
   * @default "en"
   */
  readonly locale?: Locale;

  /**
   * Color theme for the widget interface.
   * @default "light"
   */
  readonly colorTheme?: ColorTheme;

  /**
   * Array of countries to filter economic events by.
   * When empty, shows events from all countries.
   * Duplicates are automatically removed.
   *
   * @default []
   * @example
   * ```tsx
   * // Major economies
   * countries={["United States", "Germany", "Japan", "China"]}
   *
   * // European focus
   * countries={["European Union", "United Kingdom", "Switzerland"]}
   *
   * // Emerging markets
   * countries={["Brazil", "India", "South Africa", "Turkey"]}
   * ```
   */
  readonly countries?: Country[];

  /**
   * Whether the widget should automatically resize to fit its container.
   * When true, `width` and `height` props are ignored.
   * @default true
   */
  readonly autosize?: boolean;

  /**
   * Whether to show only high-importance economic events.
   * When true, filters out low and medium importance events.
   * When false, shows all importance levels.
   *
   * @default false
   * @example
   * ```tsx
   * // Show only critical events like Fed meetings, GDP releases
   * <EconomicCalendar showHighImportanceOnly />
   *
   * // Show all events including minor data releases
   * <EconomicCalendar showHighImportanceOnly={false} />
   * ```
   */
  readonly showHighImportanceOnly?: boolean;

  /**
   * Whether to use a transparent background.
   * @default false
   */
  readonly isTransparent?: boolean;

  /**
   * Callback function called when an error occurs during widget initialization.
   * @param error The error that occurred
   */
  readonly onError?: (error: Error) => void;
};

/**
 * TradingView Economic Calendar widget for displaying upcoming economic events.
 *
 * Keep an eye on key upcoming economic events, announcements, and news. The widget
 * provides comprehensive economic event tracking with filtering capabilities for
 * event importance and affected countries. Perfect for traders and investors who
 * need to stay informed about market-moving economic releases.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/calendars/economic-calendar/
 *
 * @example
 * Basic usage - all events from all countries:
 * ```tsx
 * <EconomicCalendar />
 * ```
 *
 * @example
 * Major economies with high importance filter:
 * ```tsx
 * <EconomicCalendar
 *   countries={["United States", "European Union", "Japan", "United Kingdom"]}
 *   showHighImportanceOnly
 *   colorTheme="dark"
 * />
 * ```
 *
 * @example
 * Custom sizing and regional focus:
 * ```tsx
 * <EconomicCalendar
 *   countries={["Germany", "France", "Italy", "Spain"]}
 *   width={800}
 *   height={600}
 *   autosize={false}
 *   showHighImportanceOnly={false}
 *   isTransparent
 * />
 * ```
 *
 * @example
 * Emerging markets tracking:
 * ```tsx
 * <EconomicCalendar
 *   countries={["China", "India", "Brazil", "South Africa", "Turkey", "Mexico"]}
 *   locale="en"
 *   colorTheme="light"
 * />
 * ```
 */
export const EconomicCalendar = (props: EconomicCalendarProps) => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      countries: [] as Country[],
      autosize: true,
      showHighImportanceOnly: false,
      isTransparent: false,
    },
    props,
  );

  // Remove duplicates countries
  const countries = () => new Array(...new Set(_props.countries));

  createEffect(() => {
    const widgetRoot = document.createElement("div");
    widgetRoot.classList.add("tradingview-widget-container__widget");
    container.appendChild(widgetRoot);

    const fullWidth = _props.autosize || _props.width === "full";
    container.style.width = fullWidth ? "100%" : `${_props.width}px`;
    widgetRoot.style.width = fullWidth ? "100%" : `${_props.width}px`;

    const fullHeight = _props.autosize || _props.height === "full";
    container.style.height = fullHeight ? "100%" : `${_props.height}px`;
    widgetRoot.style.height = fullHeight ? "100%" : `${_props.height}px`;

    const downloadScript = async () => {
      const [error] = await tryCatch(
        loadScript(
          "https://s3.tradingview.com/external-embedding/embed-widget-events.js",
          {
            textContent: JSON.stringify({
              autosize: _props.autosize,
              width: fullWidth ? "100%" : _props.width,
              height: fullHeight ? "100%" : _props.height,
              locale: _props.locale,
              colorTheme: _props.colorTheme,
              importanceFilter: _props.showHighImportanceOnly ? "0,1" : "-1,0,1",
              isTransparent: _props.isTransparent,
              countryFilter: countries()
                .map((country) => CountryMap[country])
                .join(","),
            }),
          },
          widgetRoot,
        ),
      );

      if (error) _props.onError?.(error);
    };

    void downloadScript();

    onCleanup(() => {
      widgetRoot.remove();
    });
  });

  return <div class="tradingview-widget-container" ref={container} />;
};
