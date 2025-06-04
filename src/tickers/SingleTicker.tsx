import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, type JSX, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Props for the SingleTicker component.
 */
export type SingleTickerProps = {
  /**
   * The financial symbol to display in the ticker widget.
   * This should be a valid TradingView symbol identifier including the exchange prefix.
   *
   * **Symbol Format:**
   * - Format: `EXCHANGE:SYMBOL` (e.g., "NASDAQ:AAPL", "BINANCE:BTCUSDT")
   * - Exchange prefix is required for accurate data retrieval
   * - Case-sensitive symbol matching
   *
   * **Supported Asset Classes:**
   * - **Stocks:** "NASDAQ:AAPL", "NYSE:TSLA", "LSE:LLOY"
   * - **Cryptocurrencies:** "BINANCE:BTCUSDT", "COINBASE:ETHUSD"
   * - **Forex:** "FX:EURUSD", "OANDA:GBPJPY"
   * - **Commodities:** "COMEX:GC1!", "NYMEX:CL1!"
   * - **Indices:** "TVC:SPX", "TVC:DJI", "CAPITALCOM:US500"
   * - **Bonds:** "TVC:TNX", "TVC:DGS10"
   * - **Futures:** "CME:ES1!", "EUREX:FESX1!"
   *
   * @example "NASDAQ:AAPL", "BINANCE:BTCUSDT", "FX:EURUSD", "TVC:SPX"
   */
  readonly symbol: string;

  /**
   * Widget width in pixels. The widget will automatically adjust its height.
   * Use "full" to make the widget take the full width of its container.
   * @default "full"
   */
  readonly width?: Size;

  /**
   * Color theme for the widget interface.
   * - `light`: Light theme with white background
   * - `dark`: Dark theme with dark background
   * @default "light"
   */
  readonly colorTheme?: ColorTheme;

  /**
   * Locale for widget interface and content language.
   * Controls the display language for text elements and number formatting.
   * @default "en"
   */
  readonly locale?: Locale;

  /**
   * Whether to use a transparent background.
   * When enabled, removes the widget's background for seamless integration.
   * @default false
   */
  readonly isTransparent?: boolean;

  /**
   * Callback function called when an error occurs during widget initialization.
   * Use this to handle loading errors or invalid symbol configurations.
   * @param error The error that occurred
   */
  readonly onError?: (error: Error) => void;
};

/**
 * TradingView SingleTicker widget for displaying real-time financial instrument data.
 *
 * This compact widget displays essential information for a single financial instrument,
 * including current price, daily change, and key market data. Perfect for embedding
 * individual stock quotes, cryptocurrency prices, forex rates, or other financial
 * data directly into web pages, dashboards, or applications.
 *
 * **Key Features:**
 * - Real-time price updates for any supported financial instrument
 * - Current price with absolute and percentage change indicators
 * - Clean, compact design suitable for any layout
 * - Automatic height adjustment based on content
 * - Support for all major asset classes (stocks, crypto, forex, commodities)
 * - Color-coded price movement indicators
 * - Responsive design for various screen sizes
 * - Seamless integration with transparent background option
 *
 * **Displayed Information:**
 * - **Symbol Name:** Full name of the financial instrument
 * - **Current Price:** Real-time market price
 * - **Price Change:** Absolute change from previous close
 * - **Percentage Change:** Percentage change from previous close
 * - **Price Direction:** Color-coded indicators (green/red for up/down)
 * - **Market Status:** Open/closed indicator where applicable
 *
 * **Supported Markets:**
 * - **Global Stock Exchanges:** NYSE, NASDAQ, LSE, TSE, and 100+ others
 * - **Cryptocurrency Exchanges:** Binance, Coinbase, Kraken, and major platforms
 * - **Forex Markets:** Major and minor currency pairs
 * - **Commodities:** Gold, silver, oil, agricultural products
 * - **Indices:** S&P 500, Dow Jones, FTSE, DAX, Nikkei, and more
 * - **Bonds & Treasuries:** Government and corporate bonds
 * - **Futures & Options:** Derivatives across asset classes
 *
 * @see https://www.tradingview.com/widget-docs/widgets/tickers/single-ticker/
 *
 * @example
 * Basic Apple stock ticker:
 * ```tsx
 * <SingleTicker symbol="NASDAQ:AAPL" />
 * ```
 *
 * @example
 * Bitcoin price ticker with dark theme:
 * ```tsx
 * <SingleTicker
 *   symbol="BINANCE:BTCUSDT"
 *   colorTheme="dark"
 *   width={300}
 * />
 * ```
 *
 * @example
 * EUR/USD forex ticker with transparent background:
 * ```tsx
 * <SingleTicker
 *   symbol="FX:EURUSD"
 *   colorTheme="light"
 *   isTransparent
 *   locale="en"
 * />
 * ```
 *
 * @example
 * S&P 500 index ticker with custom configuration:
 * ```tsx
 * <SingleTicker
 *   symbol="TVC:SPX"
 *   width={400}
 *   locale="es"
 *   colorTheme="dark"
 *   isTransparent={false}
 * />
 * ```
 */
export const SingleTicker = (props: SingleTickerProps): JSX.Element => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      isTransparent: false,
    },
    props,
  );

  createEffect(() => {
    const widgetRoot = document.createElement("div");
    widgetRoot.classList.add("tradingview-widget-container__widget");
    container.appendChild(widgetRoot);

    container.style.width = _props.width === "full" ? "100%" : `${_props.width}px`;
    widgetRoot.style.width = _props.width === "full" ? "100%" : `${_props.width}px`;

    const downloadScript = async () => {
      const [error] = await tryCatch(
        loadScript(
          "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js",
          {
            textContent: JSON.stringify({
              symbol: _props.symbol,
              width: _props.width === "full" ? "100%" : _props.width,
              locale: _props.locale,
              colorTheme: _props.colorTheme,
              isTransparent: _props.isTransparent,
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
