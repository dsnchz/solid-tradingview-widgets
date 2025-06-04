import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, type JSX, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Date range options for the MiniChart widget.
 * Controls the time period displayed in the chart.
 *
 * - `1D`: 1 Day - Intraday view with hourly candles
 * - `1M`: 1 Month - Daily candles for the past month
 * - `3M`: 3 Months - Daily candles for the past quarter
 * - `1Y`: 1 Year - Daily/weekly candles for the past year
 * - `5Y`: 5 Years - Weekly/monthly candles for 5 years
 * - `ALL`: All Time - Full historical data available
 *
 * @example
 * ```tsx
 * <MiniChart symbol="NASDAQ:AAPL" dateRange="1D" /> // Intraday view
 * <MiniChart symbol="NASDAQ:AAPL" dateRange="1Y" /> // Year overview
 * <MiniChart symbol="NASDAQ:AAPL" dateRange="ALL" /> // Full history
 * ```
 */
export type MiniChartDateRange = "1D" | "1M" | "3M" | "1Y" | "5Y" | "ALL";

/**
 * Props for the MiniChart component.
 */
export type MiniChartProps = {
  /**
   * The financial symbol to display (e.g., "NASDAQ:AAPL", "BINANCE:BTCUSDT").
   * This is the primary symbol that will be charted.
   *
   * @example "NASDAQ:AAPL", "FOREX:EURUSD", "BINANCE:BTCUSDT", "NYSE:TSLA"
   */
  readonly symbol: string;

  /**
   * Chart width in pixels. Ignored if `autosize` is true.
   * @default "full"
   */
  readonly width?: Size;

  /**
   * Chart height in pixels. Ignored if `autosize` is true.
   * @default "full"
   */
  readonly height?: Size;

  /**
   * Locale for chart interface and number formatting.
   * @default "en"
   */
  readonly locale?: Locale;

  /**
   * Time period to display in the chart.
   * @default "1M"
   */
  readonly dateRange?: MiniChartDateRange;

  /**
   * Color theme for the chart interface.
   * @default "light"
   */
  readonly colorTheme?: ColorTheme;

  /**
   * Custom color for the main trend line.
   * Supports any CSS color format: hex, rgb, rgba, hsl, etc.
   *
   * @example
   * ```tsx
   * trendLineColor="#2962FF" // Blue trend line
   * trendLineColor="rgb(255, 107, 53)" // Orange trend line
   * trendLineColor="hsl(210, 100%, 50%)" // HSL blue
   * ```
   */
  readonly trendLineColor?: string;

  /**
   * Custom color for the area fill under the trend line (top gradient).
   * Supports any CSS color format: hex, rgb, rgba, hsl, etc.
   *
   * @example
   * ```tsx
   * underLineColor="rgba(41, 98, 255, 0.3)" // Semi-transparent blue
   * underLineColor="#FF6B3530" // Hex with alpha
   * ```
   */
  readonly underLineColor?: string;

  /**
   * Custom color for the area fill under the trend line (bottom gradient).
   * Creates a gradient effect when combined with underLineColor.
   * Supports any CSS color format: hex, rgb, rgba, hsl, etc.
   *
   * @example
   * ```tsx
   * underLineColor="rgba(41, 98, 255, 0.3)"
   * underLineBottomColor="rgba(41, 98, 255, 0.1)" // Lighter bottom
   * ```
   */
  readonly underLineBottomColor?: string;

  /**
   * Whether the chart should automatically resize to fit its container.
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
   * Whether to show only the chart without additional details.
   * When true, hides symbol info, price details, and other UI elements.
   * @default false
   */
  readonly chartOnly?: boolean;

  /**
   * Whether to hide the time scale at the bottom of the chart.
   * @default false
   */
  readonly noTimeScale?: boolean;

  /**
   * Callback function called when an error occurs during chart initialization.
   * @param error The error that occurred
   */
  readonly onError?: (error: Error) => void;
};

/**
 * TradingView MiniChart widget for compact price visualization.
 *
 * A lightweight, compact chart widget perfect for displaying price trends and basic
 * market data in smaller spaces like dashboards, sidebars, or overview panels.
 * The MiniChart provides essential price information with customizable styling
 * while maintaining a minimal footprint.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/charts/mini-chart/
 *
 * @example
 * Basic usage:
 * ```tsx
 * <MiniChart symbol="NASDAQ:AAPL" />
 * ```
 *
 * @example
 * Custom styling with colors:
 * ```tsx
 * <MiniChart
 *   symbol="NASDAQ:AAPL"
 *   dateRange="1Y"
 *   colorTheme="dark"
 *   trendLineColor="#FF6B35"
 *   underLineColor="rgba(255, 107, 53, 0.3)"
 *   underLineBottomColor="rgba(255, 107, 53, 0.1)"
 * />
 * ```
 *
 * @example
 * Minimalist chart-only view:
 * ```tsx
 * <MiniChart
 *   symbol="BINANCE:BTCUSDT"
 *   dateRange="1D"
 *   chartOnly
 *   noTimeScale
 *   isTransparent
 *   width={300}
 *   height={150}
 *   autosize={false}
 * />
 * ```
 *
 * @example
 * Dashboard widget with custom dimensions:
 * ```tsx
 * <MiniChart
 *   symbol="FOREX:EURUSD"
 *   dateRange="3M"
 *   width={400}
 *   height={200}
 *   autosize={false}
 *   trendLineColor="#00C851"
 *   colorTheme="light"
 * />
 * ```
 */
export const MiniChart = (props: MiniChartProps): JSX.Element => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      dateRange: "1M" as MiniChartDateRange,

      autosize: true,
      isTransparent: false,
      chartOnly: false,
      noTimeScale: false,
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
          "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js",
          {
            textContent: JSON.stringify({
              symbol: _props.symbol,
              autosize: _props.autosize,
              width: fullWidth ? "100%" : _props.width,
              height: fullHeight ? "100%" : _props.height,
              locale: _props.locale,
              colorTheme: _props.colorTheme,
              dateRange: _props.dateRange,
              trendLineColor: _props.trendLineColor,
              underLineColor: _props.underLineColor,
              underLineBottomColor: _props.underLineBottomColor,
              isTransparent: _props.isTransparent,
              chartOnly: _props.chartOnly,
              noTimeScale: _props.noTimeScale,
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
