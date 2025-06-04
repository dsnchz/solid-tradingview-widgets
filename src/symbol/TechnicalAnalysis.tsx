import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, type JSX, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Display modes for the TechnicalAnalysis widget.
 *
 * - `single`: Shows analysis for one timeframe at a time
 * - `multiple`: Shows analysis for multiple timeframes simultaneously
 *
 * @example
 * ```tsx
 * <TechnicalAnalysis symbol="NASDAQ:AAPL" displayMode="single" /> // Focus on one interval
 * <TechnicalAnalysis symbol="NASDAQ:AAPL" displayMode="multiple" /> // Multi-timeframe view
 * ```
 */
export type TechnicalAnalysisDisplayMode = "single" | "multiple";

/**
 * Time intervals for technical analysis calculations.
 *
 * Supports both minute-based and period-based intervals:
 * - Minute intervals: 1m, 5m, 15m, 30m for short-term analysis
 * - Hour intervals: 1h, 2h, 4h for intraday analysis
 * - Period intervals: 1D (daily), 1W (weekly), 1M (monthly) for longer-term analysis
 *
 * @example
 * ```tsx
 * <TechnicalAnalysis symbol="NASDAQ:AAPL" interval="5m" /> // 5-minute analysis
 * <TechnicalAnalysis symbol="NASDAQ:AAPL" interval="1D" /> // Daily analysis
 * <TechnicalAnalysis symbol="NASDAQ:AAPL" interval="1W" /> // Weekly analysis
 * ```
 */
export type TechnicalAnalysisInterval =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "1D"
  | "1W"
  | "1M";

/**
 * Props for the TechnicalAnalysis component.
 */
export type TechnicalAnalysisProps = {
  /**
   * The financial symbol to analyze (e.g., "NASDAQ:AAPL", "BINANCE:BTCUSDT").
   * This is the primary symbol for which technical analysis will be displayed.
   *
   * @example "NASDAQ:AAPL", "FOREX:EURUSD", "BINANCE:BTCUSDT", "NYSE:TSLA"
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
   * Locale for widget interface and content language.
   * @default "en"
   */
  readonly locale?: Locale;

  /**
   * Display mode for technical analysis presentation.
   * @default "single"
   */
  readonly displayMode?: TechnicalAnalysisDisplayMode;

  /**
   * Time interval for technical analysis calculations.
   * Determines the timeframe used for technical indicators and signals.
   * @default "5m"
   */
  readonly interval?: TechnicalAnalysisInterval;

  /**
   * Color theme for the widget interface.
   * @default "light"
   */
  readonly colorTheme?: ColorTheme;

  /**
   * Whether the widget should automatically resize to fit its container.
   * When true, `width` and `height` props are ignored.
   * @default true
   */
  readonly autosize?: boolean;

  /**
   * Whether to show interval selection tabs in the widget.
   * When true, users can switch between different timeframes.
   * When false, only the specified interval is shown.
   *
   * @default false
   * @example
   * ```tsx
   * // Allow users to switch between timeframes
   * <TechnicalAnalysis symbol="NASDAQ:AAPL" showIntervalTabs />
   *
   * // Lock to specific interval
   * <TechnicalAnalysis symbol="NASDAQ:AAPL" interval="1D" showIntervalTabs={false} />
   * ```
   */
  readonly showIntervalTabs?: boolean;

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
 * TradingView Technical Analysis widget for displaying trading signals and analysis.
 *
 * This widget provides comprehensive technical analysis including buy/sell signals,
 * moving averages, oscillators, and overall market sentiment based on multiple
 * technical indicators. Perfect for traders who need quick technical insights
 * and signal confirmations for their trading decisions.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/symbol-details/technical-analysis/
 *
 * @example
 * Basic usage:
 * ```tsx
 * <TechnicalAnalysis symbol="NASDAQ:AAPL" />
 * ```
 *
 * @example
 * Multi-timeframe analysis with user controls:
 * ```tsx
 * <TechnicalAnalysis
 *   symbol="NASDAQ:AAPL"
 *   displayMode="multiple"
 *   showIntervalTabs
 *   colorTheme="dark"
 * />
 * ```
 *
 * @example
 * Specific interval analysis:
 * ```tsx
 * <TechnicalAnalysis
 *   symbol="BINANCE:BTCUSDT"
 *   interval="1h"
 *   displayMode="single"
 *   width={400}
 *   height={300}
 *   autosize={false}
 * />
 * ```
 *
 * @example
 * Forex analysis with transparent background:
 * ```tsx
 * <TechnicalAnalysis
 *   symbol="FOREX:EURUSD"
 *   interval="4h"
 *   displayMode="single"
 *   isTransparent
 *   colorTheme="light"
 *   showIntervalTabs={false}
 * />
 * ```
 */
export const TechnicalAnalysis = (props: TechnicalAnalysisProps): JSX.Element => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      displayMode: "single" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      interval: "5m" as TechnicalAnalysisInterval,
      autosize: true,
      showIntervalTabs: false,
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
          "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
          {
            textContent: JSON.stringify({
              symbol: _props.symbol,
              width: fullWidth ? "100%" : _props.width,
              height: fullHeight ? "100%" : _props.height,
              interval: _props.interval,
              showIntervalTabs: _props.showIntervalTabs,
              displayMode: _props.displayMode,
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
