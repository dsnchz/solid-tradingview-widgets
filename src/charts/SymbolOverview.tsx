import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Scale modes for price axis display in the SymbolOverview widget.
 *
 * - `normal`: Linear price scale (standard arithmetic progression)
 * - `percentage`: Percentage-based scale showing relative changes
 * - `logarithmic`: Logarithmic scale for better visualization of exponential growth
 *
 * @example
 * ```tsx
 * <SymbolOverview scaleMode="percentage" /> // Show percentage changes
 * <SymbolOverview scaleMode="logarithmic" /> // Better for volatile assets
 * ```
 */
export type ScaleMode = "normal" | "percentage" | "logarithmic";

/**
 * Position of the price scale axis in the chart.
 *
 * - `left`: Price scale on the left side of the chart
 * - `right`: Price scale on the right side of the chart (default)
 * - `no`: Hide the price scale completely
 *
 * @example
 * ```tsx
 * <SymbolOverview scalePosition="left" /> // Left-aligned price scale
 * <SymbolOverview scalePosition="no" /> // Clean chart without price scale
 * ```
 */
export type ScalePosition = "left" | "right" | "no";

/**
 * Chart visualization types for the SymbolOverview widget.
 *
 * - `area`: Filled area chart with gradient (default for most use cases)
 * - `line`: Simple line chart showing price movement
 * - `bar`: OHLC bar chart showing open, high, low, close prices
 * - `candlestick`: Japanese candlestick chart with body and wicks
 *
 * @example
 * ```tsx
 * <SymbolOverview chartType="candlestick" /> // Full OHLC data visualization
 * <SymbolOverview chartType="line" /> // Simple price line
 * ```
 */
export type ChartType = "area" | "line" | "bar" | "candlestick";

/**
 * Value tracking display modes for price information.
 *
 * - `floating_tooltip`: Floating tooltip that follows cursor movement
 * - `colored_tooltip`: Colored tooltip with enhanced visibility
 * - `legend`: Fixed legend display showing current values
 * - `scale_labels`: Values displayed on the price scale axis
 *
 * @example
 * ```tsx
 * <SymbolOverview valueTrackingMode="legend" /> // Fixed legend display
 * <SymbolOverview valueTrackingMode="floating_tooltip" /> // Interactive tooltip
 * ```
 */
export type ValueTrackingMode = "floating_tooltip" | "colored_tooltip" | "legend" | "scale_labels";

/**
 * Line drawing styles for line and area charts.
 *
 * - `simple`: Straight lines connecting data points (default)
 * - `curved`: Smooth curved lines with bezier interpolation
 * - `stepLine`: Step-like lines creating a staircase pattern
 *
 * @example
 * ```tsx
 * <SymbolOverview lineType="curved" /> // Smooth curved lines
 * <SymbolOverview lineType="stepLine" /> // Step-like visualization
 * ```
 */
export type LineType = "simple" | "curved" | "stepLine";

/**
 * Header font size options for the widget title and symbol information.
 *
 * - `small`: Compact header with minimal space usage
 * - `medium`: Standard header size (default)
 * - `large`: Prominent header for emphasis
 *
 * @example
 * ```tsx
 * <SymbolOverview headerFontSize="large" /> // Prominent header
 * <SymbolOverview headerFontSize="small" /> // Compact design
 * ```
 */
export type HeaderFontSize = "small" | "medium" | "large";

/**
 * Price change display modes in the widget header.
 *
 * - `price-and-percent`: Show both absolute price change and percentage (default)
 * - `price-only`: Show only absolute price change value
 * - `percent-only`: Show only percentage change
 * - `no-values`: Hide change values completely
 *
 * @example
 * ```tsx
 * <SymbolOverview changeMode="percent-only" /> // Only show percentage
 * <SymbolOverview changeMode="no-values" /> // Clean display without changes
 * ```
 */
export type ChangeMode = "price-and-percent" | "price-only" | "percent-only" | "no-values";

/**
 * Time format for timestamp display in the widget.
 *
 * - `12h`: 12-hour format with AM/PM (e.g., "2:30 PM")
 * - `24h`: 24-hour format (e.g., "14:30")
 *
 * @example
 * ```tsx
 * <SymbolOverview timeFormat="24h" /> // European time format
 * <SymbolOverview timeFormat="12h" /> // American time format
 * ```
 */
export type TimeFormat = "12h" | "24h";

/**
 * Configuration for symbol comparison in the chart.
 * Allows overlaying multiple symbols for relative performance analysis.
 */
type CompareSymbol = {
  /** The symbol to compare (e.g., "NASDAQ:GOOGL") */
  readonly symbol: string;
  /** Custom color for the comparison line */
  readonly lineColor?: string;
  /** Line width for the comparison symbol (default: 1) */
  readonly lineWidth?: number;
  /** Whether to show labels for the comparison symbol */
  readonly showLabels?: boolean;
};

const ScaleModeMap: Record<ScaleMode, string> = {
  normal: "Normal",
  percentage: "Percentage",
  logarithmic: "Logarithmic",
};

const ChartTypeMap: Record<ChartType, string> = {
  area: "area",
  line: "line",
  bar: "bars",
  candlestick: "candlesticks",
};

const ValueTrackingModeMap: Record<ValueTrackingMode, string> = {
  floating_tooltip: "1",
  colored_tooltip: "2",
  legend: "3",
  scale_labels: "0",
};

const LineTypeMap: Record<LineType, number> = {
  simple: 0,
  curved: 2,
  stepLine: 1,
};

const TimeFormatMap: Record<TimeFormat, string> = {
  "12h": "12-hours",
  "24h": "24-hours",
};

/**
 * Props for the SymbolOverview component.
 */
export type SymbolOverviewProps = {
  /**
   * Array of financial symbols to display in the overview.
   * Each symbol should include the exchange prefix for accurate data retrieval.
   *
   * **Supported formats:**
   * - `EXCHANGE:SYMBOL` format (e.g., ["NASDAQ:AAPL", "NYSE:TSLA"])
   * - Multiple asset classes: stocks, forex, crypto, commodities, indices
   *
   * @example
   * ```tsx
   * // Single symbol
   * <SymbolOverview symbols={["NASDAQ:AAPL"]} />
   *
   * // Multiple symbols comparison
   * <SymbolOverview symbols={["NASDAQ:AAPL", "NASDAQ:GOOGL", "NASDAQ:MSFT"]} />
   *
   * // Mixed asset classes
   * <SymbolOverview symbols={["NASDAQ:AAPL", "BINANCE:BTCUSDT", "FX:EURUSD"]} />
   * ```
   */
  readonly symbols: string[];

  /** Widget width in pixels, or "full" for container width */
  readonly width?: Size;
  /** Widget height in pixels, or "full" for container height */
  readonly height?: Size;
  /** Display language and regional formatting */
  readonly locale?: Locale;

  /** Price scale display mode for better data visualization */
  readonly scaleMode?: ScaleMode;
  /** Position of the price scale axis */
  readonly scalePosition?: ScalePosition;
  /** Widget color theme (light/dark) */
  readonly colorTheme?: ColorTheme;

  /** Chart visualization type (area, line, bar, candlestick) */
  readonly chartType?: ChartType;
  /** Value tracking and tooltip display mode */
  readonly valueTrackingMode?: ValueTrackingMode;
  /** Additional symbol for comparison overlay */
  readonly compareSymbol?: CompareSymbol;
  /** Line drawing style for line/area charts */
  readonly lineType?: LineType;

  /** Header text size for symbol information */
  readonly headerFontSize?: HeaderFontSize;
  /** Price change display format in header */
  readonly changeMode?: ChangeMode;
  /** Time format for timestamps */
  readonly timeFormat?: TimeFormat;

  /** Line width for chart lines (default: 1) */
  readonly lineWidth?: number;
  /** Base font size for widget text */
  readonly fontSize?: number;

  // Color Customization
  /** Text color for widget content */
  readonly fontColor?: string;
  /** Main trend line color */
  readonly trendLineColor?: string;
  /** Area chart upper gradient color */
  readonly underLineColor?: string;
  /** Area chart lower gradient color */
  readonly underLineBottomColor?: string;

  // Responsive Configuration
  /** Auto-resize to container dimensions */
  readonly autosize?: boolean;
  /** Transparent widget background */
  readonly isTransparent?: boolean;
  /** Show/hide time scale axis */
  readonly showTimeScale?: boolean;
  /** Show/hide widget header with symbol info */
  readonly showHeader?: boolean;

  // Chart Type Specific Colors
  /** Line color for line charts only (maps to trendLineColor internally) */
  readonly color?: string;
  /** Line color for area chart border (area charts only) */
  readonly lineColor?: string;
  /** Top gradient color for area charts only */
  readonly topColor?: string;
  /** Bottom gradient color for area charts only */
  readonly bottomColor?: string;
  /** Bullish bar/candle color (bar and candlestick charts only) */
  readonly upColor?: string;
  /** Bearish bar/candle color (bar and candlestick charts only) */
  readonly downColor?: string;
  /** Bullish border color for bars/candles (bar and candlestick charts only) */
  readonly borderUpColor?: string;
  /** Bearish border color for bars/candles (bar and candlestick charts only) */
  readonly borderDownColor?: string;
  /** Bullish wick color (candlestick charts only) */
  readonly wickUpColor?: string;
  /** Bearish wick color (candlestick charts only) */
  readonly wickDownColor?: string;

  // Grid and Background
  /** Chart grid line color */
  readonly gridLineColor?: string;
  /** Widget text color override */
  readonly widgetFontColor?: string;
  /** Widget background color */
  readonly backgroundColor?: string;

  // Volume Display
  /** Show/hide volume bars below main chart */
  readonly showVolume?: boolean;
  /** Volume bar color for up periods */
  readonly volumeUpColor?: string;
  /** Volume bar color for down periods */
  readonly volumeDownColor?: string;

  // UI Elements
  /** Show/hide date range selector buttons */
  readonly showDateRanges?: boolean;
  /** Show/hide symbol logo in header */
  readonly showSymbolLogo?: boolean;
  /** Show/hide market status indicator */
  readonly showMarketStatus?: boolean;

  // Moving Average
  /** Show/hide moving average line */
  readonly showMA?: boolean;
  /** Moving average line color */
  readonly maLineColor?: string;
  /** Moving average line width */
  readonly maLineWidth?: number;
  /** Moving average period (e.g., 20, 50, 200) */
  readonly maLength?: number;

  /** Error handler for widget loading failures */
  readonly onError?: (error: Error) => void;
};

/**
 * TradingView SymbolOverview widget for displaying financial instrument data with mini charts.
 *
 * This versatile widget combines symbol information (price, change, volume) with a compact
 * chart visualization, making it perfect for dashboards, watchlists, and portfolio overviews.
 * It supports multiple symbols, various chart types, and extensive customization options
 * for professional financial applications.
 *
 * **Key Features:**
 * - Multi-symbol support with comparison capabilities
 * - 4 chart types: area, line, bar, candlestick
 * - Comprehensive color customization for all chart elements
 * - Volume display with customizable colors
 * - Moving average overlay with configurable periods
 * - Responsive design with auto-sizing capabilities
 * - Real-time data updates from TradingView
 * - Professional styling options and themes
 *
 * **Chart Types:**
 * - **Area**: Filled gradient charts ideal for trend visualization
 * - **Line**: Clean line charts for simple price tracking
 * - **Bar**: OHLC bars showing full price action
 * - **Candlestick**: Japanese candlesticks with body and wick colors
 *
 * **Color Format Support:**
 * All color props support multiple CSS formats:
 * - Hex: `#1a1a1a`, `#ff6b3580` (with alpha)
 * - RGB/RGBA: `rgb(255, 107, 53)`, `rgba(41, 98, 255, 0.3)`
 * - HSL: `hsl(210, 100%, 50%)`
 * - OKLCH: `oklch(0.7 0.15 180)`
 *
 * **Chart-Specific Color Properties:**
 * Different color properties apply to different chart types:
 *
 * - **Line Charts**: Use `color` for the main line color.
 * - **Area Charts**: Use `lineColor` (border), `topColor` (top gradient), `bottomColor` (bottom gradient)
 * - **Bar Charts**: Use `upColor`/`downColor` (bar fill), `borderUpColor`/`borderDownColor` (bar borders)
 * - **Candlestick Charts**: Use `upColor`/`downColor` (candle body), `borderUpColor`/`borderDownColor` (body borders), `wickUpColor`/`wickDownColor` (wick colors)
 * - **All Charts**: `gridLineColor`, `widgetFontColor`, `backgroundColor` apply universally
 *
 * @see https://www.tradingview.com/widget-docs/widgets/charts/symbol-overview/
 *
 * @example
 * ```tsx
 * // Basic symbol overview
 * <SymbolOverview
 *   symbols={["NASDAQ:AAPL"]}
 *   colorTheme="light"
 *   width={400}
 *   height={300}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Multi-symbol comparison with custom styling
 * <SymbolOverview
 *   symbols={["NASDAQ:AAPL", "NASDAQ:GOOGL", "NASDAQ:MSFT"]}
 *   chartType="candlestick"
 *   colorTheme="dark"
 *   upColor="#00C853"
 *   downColor="#FF1744"
 *   showVolume={true}
 *   showMA={true}
 *   maLength={20}
 *   maLineColor="#2196F3"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Responsive dashboard widget
 * <SymbolOverview
 *   symbols={["BINANCE:BTCUSDT"]}
 *   autosize={true}
 *   isTransparent={true}
 *   showHeader={true}
 *   showSymbolLogo={true}
 *   valueTrackingMode="legend"
 *   backgroundColor="rgba(255, 255, 255, 0.1)"
 * />
 * ```
 */
export const SymbolOverview = (props: SymbolOverviewProps) => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      locale: "en" as Locale,
      scaleMode: "normal" as ScaleMode,
      scalePosition: "right" as ScalePosition,
      colorTheme: "light" as ColorTheme,
      chartType: "line" as ChartType,
      valueTrackingMode: "floating_tooltip" as ValueTrackingMode,
      lineType: "simple" as LineType,
      headerFontSize: "small" as HeaderFontSize,
      changeMode: "price-and-percent" as ChangeMode,
      timeFormat: "12h" as TimeFormat,

      lineWidth: 2,
      showHeader: true,
      showSymbolLogo: true,
      showMarketStatus: true,
      showDateRanges: true,

      fontSize: 10,
      autosize: true,
      showTimeScale: true,
      isTransparent: false,
      chartOnly: false,
      showVolume: false,
      showMA: false,
      maLineColor: "blue",
      maLineWidth: 1,
      maLength: 9,
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
          "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
          {
            textContent: JSON.stringify({
              autosize: _props.autosize,
              width: fullWidth ? "100%" : _props.width,
              height: fullHeight ? "100%" : _props.height,
              locale: _props.locale,
              noTimeScale: !_props.showTimeScale,
              colorTheme: _props.colorTheme,
              scalePosition: _props.scalePosition,
              scaleMode: ScaleModeMap[_props.scaleMode],
              lineWidth: _props.lineWidth,
              lineType: LineTypeMap[_props.lineType],
              chartType: ChartTypeMap[_props.chartType],
              valuesTracking: ValueTrackingModeMap[_props.valueTrackingMode],
              timeHoursFormat: TimeFormatMap[_props.timeFormat],
              headerFontSize: _props.headerFontSize,
              hideDateRanges: !_props.showDateRanges,
              hideMarketStatus: !_props.showMarketStatus,
              hideSymbolLogo: !_props.showSymbolLogo,
              fontSize: _props.fontSize,
              fontColor: _props.fontColor,
              showVolume: _props.showVolume,
              volumeUpColor: _props.volumeUpColor,
              volumeDownColor: _props.volumeDownColor,
              showMA: _props.showMA,
              maLineColor: _props.maLineColor,
              maLineWidth: _props.maLineWidth,
              maLength: _props.maLength,
              symbols: _props.symbols.map((symbol) => {
                // Extract exchange and symbol name for display
                const parts = symbol.split(":");
                const displayName = parts.length > 1 ? parts[1] : symbol;
                return [displayName, `${symbol}|1D`];
              }),
              chartOnly: !_props.showHeader,
              trendLineColor: _props.trendLineColor,
              underLineColor: _props.underLineColor,
              underLineBottomColor: _props.underLineBottomColor,
              isTransparent: _props.isTransparent,
              color: _props.color,
              lineColor: _props.lineColor,
              topColor: _props.topColor,
              bottomColor: _props.bottomColor,
              upColor: _props.upColor,
              downColor: _props.downColor,
              borderUpColor: _props.borderUpColor,
              borderDownColor: _props.borderDownColor,
              wickUpColor: _props.wickUpColor,
              wickDownColor: _props.wickDownColor,
              gridLineColor: _props.gridLineColor,
              widgetFontColor: _props.widgetFontColor,
              backgroundColor: _props.backgroundColor,
              changeMode: _props.changeMode,

              // TODO: Make this configurable
              dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
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
