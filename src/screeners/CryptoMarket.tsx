import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Currency display options for the CryptoMarket widget.
 *
 * Controls how cryptocurrency prices and market data are denominated and displayed:
 * - `USD`: Display all prices in US Dollars (most common for institutional and retail analysis)
 * - `BTC`: Display all prices in Bitcoin terms (useful for Bitcoin-denominated trading and analysis)
 *
 * When using BTC denomination, prices show how much Bitcoin each cryptocurrency costs,
 * which is particularly useful for traders who think in Bitcoin terms or want to see
 * relative performance against Bitcoin as the base currency.
 *
 * @example
 * ```tsx
 * <CryptoMarket displayCurrency="USD" /> // Prices in USD
 * <CryptoMarket displayCurrency="BTC" /> // Prices in BTC terms
 * ```
 */
export type CryptoMarketDisplayCurrency = "USD" | "BTC";

/**
 * Props for the CryptoMarket component.
 */
export type CryptoMarketProps = {
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
   * Color theme for the widget interface.
   * @default "light"
   */
  readonly colorTheme?: ColorTheme;

  /**
   * Locale for widget interface and content language.
   * @default "en"
   */
  readonly locale?: Locale;

  /**
   * The currency to display in the widget.
   * @default "USD"
   */
  readonly displayCurrency?: CryptoMarketDisplayCurrency;

  /**
   * Whether the widget should automatically resize to fit its container.
   * When true, `width` and `height` props are ignored.
   * @default true
   */
  readonly autosize?: boolean;

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
 * TradingView CryptoMarket widget for cryptocurrency market overview and analysis.
 *
 * This specialized widget provides a comprehensive view of the cryptocurrency market,
 * displaying real-time data for thousands of digital assets including Bitcoin, Ethereum,
 * and altcoins. The widget offers sortable columns, filtering capabilities, and multiple
 * currency denominations to help traders and investors analyze the crypto market landscape.
 *
 * **Key Features:**
 * - Comprehensive cryptocurrency coverage (Bitcoin, Ethereum, altcoins, DeFi tokens)
 * - Real-time price data and market statistics
 * - Multiple currency denomination options (USD, BTC)
 * - Sortable columns (price, market cap, volume, 24h change, etc.)
 * - Interactive filtering and search capabilities
 * - Market cap and volume analysis
 * - Price performance indicators
 * - Clean, responsive interface
 *
 * **Data Columns Include:**
 * - **Symbol & Name:** Cryptocurrency ticker and full name
 * - **Price:** Current market price in selected currency
 * - **Market Cap:** Total market capitalization
 * - **Volume:** 24-hour trading volume
 * - **Change:** Price change over 24 hours (percentage and absolute)
 * - **Circulating Supply:** Number of tokens in circulation
 * - **Price Charts:** Mini sparkline price charts
 *
 * **Currency Options:**
 * - **USD Mode:** Standard fiat currency view for traditional analysis
 * - **BTC Mode:** Bitcoin-denominated prices for crypto-native perspective
 *
 * @see https://www.tradingview.com/widget-docs/widgets/screeners/crypto-mkt-screener/
 *
 * @example
 * Basic cryptocurrency market overview:
 * ```tsx
 * <CryptoMarket />
 * ```
 *
 * @example
 * Bitcoin-denominated crypto market with custom styling:
 * ```tsx
 * <CryptoMarket
 *   displayCurrency="BTC"
 *   colorTheme="dark"
 *   width={800}
 *   height={600}
 *   autosize={false}
 * />
 * ```
 *
 * @example
 * Transparent crypto market widget for embedding:
 * ```tsx
 * <CryptoMarket
 *   displayCurrency="USD"
 *   colorTheme="light"
 *   isTransparent
 *   locale="en"
 * />
 * ```
 *
 * @example
 * Custom-sized crypto market with specific dimensions:
 * ```tsx
 * <CryptoMarket
 *   displayCurrency="USD"
 *   width={1000}
 *   height={700}
 *   locale="es"
 *   colorTheme="dark"
 *   autosize={false}
 *   isTransparent={false}
 * />
 * ```
 */
export const CryptoMarket = (props: CryptoMarketProps) => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      displayCurrency: "USD" as CryptoMarketDisplayCurrency,
      autosize: true,
      isTransparent: false,
    },
    props,
  );

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
          "https://s3.tradingview.com/external-embedding/embed-widget-screener.js",
          {
            textContent: JSON.stringify({
              screener_type: "crypto_mkt",
              width: fullWidth ? "100%" : _props.width,
              height: fullHeight ? "100%" : _props.height,
              locale: _props.locale,
              colorTheme: _props.colorTheme,
              displayCurrency: _props.displayCurrency,
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
