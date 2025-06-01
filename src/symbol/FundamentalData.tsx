import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Display modes for the FundamentalData widget layout.
 * - `adaptive`: Automatically adjusts layout based on container size
 * - `regular`: Standard layout with full fundamental data display
 * - `compact`: Condensed layout with minimal fundamental data display
 *
 * @example
 * ```tsx
 * <FundamentalData displayMode="compact" /> // Minimal space usage
 * <FundamentalData displayMode="regular" /> // Full data display
 * ```
 */
export type FundamentalDataDisplayMode = "adaptive" | "regular" | "compact";

/**
 * Props for the FundamentalData component.
 */
export type FundamentalDataProps = {
  /**
   * The financial symbol to display company information for (e.g., "NASDAQ:AAPL", "NYSE:TSLA").
   * This should be a publicly traded company symbol to display meaningful profile data.
   *
   * @example "NASDAQ:AAPL", "NYSE:TSLA", "NASDAQ:GOOGL", "NYSE:JPM"
   */
  readonly symbol: string;

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
   * Display mode for the FundamentalData widget.
   * @default "adaptive"
   */
  readonly displayMode?: FundamentalDataDisplayMode;

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
 * TradingView FundamentalData widget for displaying detailed financial metrics.
 *
 * This widget provides comprehensive fundamental analysis data including financial ratios,
 * valuation metrics, profitability indicators, growth rates, and key financial statistics.
 * Perfect for deep-dive fundamental analysis of publicly traded companies, helping investors
 * evaluate financial health, performance trends, and investment potential beyond just stock price.
 *
 * Features include:
 * - Key financial ratios (P/E, P/B, ROE, ROA, etc.)
 * - Valuation metrics and market data
 * - Profitability and efficiency indicators
 * - Growth rates and trend analysis
 * - Debt and liquidity ratios
 * - Dividend information and yield data
 *
 * @see https://www.tradingview.com/widget-docs/widgets/symbol-details/fundamental-data/
 *
 * @example
 * Basic usage:
 * ```tsx
 * <FundamentalData symbol="NASDAQ:AAPL" />
 * ```
 *
 * @example
 * Custom styling and dimensions:
 * ```tsx
 * <FundamentalData
 *   symbol="NYSE:TSLA"
 *   width={600}
 *   height={400}
 *   colorTheme="dark"
 *   autosize={false}
 *   displayMode="regular"
 * />
 * ```
 *
 * @example
 * Financial services company with compact layout:
 * ```tsx
 * <FundamentalData
 *   symbol="NYSE:JPM"
 *   colorTheme="light"
 *   locale="en"
 *   displayMode="compact"
 *   isTransparent
 * />
 * ```
 *
 * @example
 * Technology company with custom configuration:
 * ```tsx
 * <FundamentalData
 *   symbol="NASDAQ:GOOGL"
 *   width={800}
 *   height={600}
 *   locale="es"
 *   colorTheme="dark"
 *   displayMode="adaptive"
 *   autosize={false}
 *   isTransparent={false}
 * />
 * ```
 */
export const FundamentalData = (props: FundamentalDataProps) => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      displayMode: "regular" as FundamentalDataDisplayMode,
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
          "https://s3.tradingview.com/external-embedding/embed-widget-financials.js",
          {
            textContent: JSON.stringify({
              symbol: _props.symbol,
              width: fullWidth ? "100%" : _props.width,
              height: fullHeight ? "100%" : _props.height,
              locale: _props.locale,
              colorTheme: _props.colorTheme,
              displayMode: _props.displayMode,
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
