import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, type JSX, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale } from "../types";

/**
 * Chart time intervals supported by TradingView AdvancedChart.
 *
 * @example
 * ```tsx
 * <AdvancedChart interval="D" /> // Daily chart
 * <AdvancedChart interval="60" /> // 1-hour chart
 * ```
 */
export type AdvancedChartInterval =
  | "1"
  | "3"
  | "5"
  | "15"
  | "30"
  | "60"
  | "120"
  | "180"
  | "240"
  | "D"
  | "W";

/**
 * Timezone identifiers for chart data display.
 * Controls what timezone is used for displaying candle open/close times.
 *
 * @example
 * ```tsx
 * <AdvancedChart timezone="America/New_York" /> // Eastern Time
 * <AdvancedChart timezone="exchange" /> // Use exchange timezone
 * ```
 */
export type TimeZone =
  | "exchange"
  | "Etc/UTC"
  | "Pacific/Honolulu"
  | "America/Anchorage"
  | "America/Juneau"
  | "America/Los_Angeles"
  | "America/Phoenix"
  | "America/Vancouver"
  | "US/Mountain"
  | "America/Mexico_City"
  | "America/El_Salvador"
  | "America/Bogota"
  | "America/Chicago"
  | "America/Lima"
  | "America/Caracas"
  | "America/New_York"
  | "America/Santiago"
  | "America/Toronto"
  | "America/Argentina/Buenos_Aires"
  | "America/Sao_Paulo"
  | "Atlantic/Azores"
  | "Atlantic/Reykjavik"
  | "Africa/Casablanca"
  | "Europe/Dublin"
  | "Africa/Lagos"
  | "Europe/Lisbon"
  | "Europe/London"
  | "Africa/Tunis"
  | "Europe/Amsterdam"
  | "Europe/Belgrade"
  | "Europe/Berlin"
  | "Europe/Bratislava"
  | "Europe/Brussels"
  | "Europe/Budapest"
  | "Europe/Copenhagen"
  | "Africa/Johannesburg"
  | "Europe/Luxembourg"
  | "Europe/Madrid"
  | "Europe/Malta"
  | "Europe/Oslo"
  | "Europe/Paris"
  | "Europe/Prague"
  | "Europe/Rome"
  | "Europe/Stockholm"
  | "Europe/Vienna"
  | "Europe/Warsaw"
  | "Europe/Zurich"
  | "Europe/Athens"
  | "Asia/Bahrain"
  | "Europe/Bucharest"
  | "Africa/Cairo"
  | "Europe/Helsinki"
  | "Europe/Istanbul"
  | "Asia/Jerusalem"
  | "Asia/Kuwait"
  | "Europe/Moscow"
  | "Africa/Nairobi"
  | "Asia/Nicosia"
  | "Asia/Qatar"
  | "Europe/Riga"
  | "Asia/Riyadh"
  | "Europe/Tallinn"
  | "Europe/Vilnius"
  | "Asia/Tehran"
  | "Asia/Dubai"
  | "Asia/Muscat"
  | "Asia/Kabul"
  | "Asia/Ashkhabad"
  | "Asia/Almaty"
  | "Asia/Karachi"
  | "Asia/Colombo"
  | "Asia/Kolkata"
  | "Asia/Kathmandu"
  | "Asia/Dhaka"
  | "Asia/Yangon"
  | "Asia/Bangkok"
  | "Asia/Ho_Chi_Minh"
  | "Asia/Jakarta"
  | "Asia/Chongqing"
  | "Asia/Hong_Kong"
  | "Asia/Kuala_Lumpur"
  | "Asia/Manila"
  | "Australia/Perth"
  | "Asia/Shanghai"
  | "Asia/Singapore"
  | "Asia/Taipei"
  | "Asia/Seoul"
  | "Asia/Tokyo"
  | "Australia/Adelaide"
  | "Australia/Brisbane"
  | "Australia/Sydney"
  | "Pacific/Norfolk"
  | "Pacific/Auckland"
  | "Pacific/Chatham"
  | "Pacific/Fakaofo";

/**
 * Chart visualization styles available in TradingView.
 *
 * @example
 * ```tsx
 * <AdvancedChart chartStyle="candles" /> // Traditional candlestick chart
 * <AdvancedChart chartStyle="line" /> // Simple line chart
 * <AdvancedChart chartStyle="renko" /> // Renko brick chart
 * ```
 */
export type AdvancedChartStyle =
  | "bars"
  | "candles"
  | "hollow_candles"
  | "area"
  | "line"
  | "line_break"
  | "renko"
  | "heikin_ashi"
  | "kagi"
  | "point_and_figure";

/**
 * Technical indicators and studies available for the chart.
 * These are mapped to TradingView's internal indicator IDs.
 *
 * @example
 * ```tsx
 * <AdvancedChart
 *   indicators={["relativeStrengthIndex", "bollingerBands", "volume"]}
 * />
 * ```
 */
export type AdvancedChartIndicator =
  | "volume24h"
  | "accumulationDistribution"
  | "advanceDeclineLine"
  | "advanceDeclineRatio"
  | "advanceDeclineRatioBars"
  | "arnaudLegouxMovingAverage"
  | "aroon"
  | "averageDayRange"
  | "averageDirectionalIndex"
  | "averageTrueRange"
  | "awesomeOscillator"
  | "balanceOfPower"
  | "bbTrend"
  | "bollingerBands"
  | "bollingerBandsPercentB"
  | "bollingerBandwidth"
  | "bollingerBars"
  | "bullBearPower"
  | "chaikinMoneyFlow"
  | "chaikinOscillator"
  | "chandeKrollStop"
  | "chandeMomentumOscillator"
  | "chopZone"
  | "choppinessIndex"
  | "commodityChannelIndex"
  | "connorsRsi"
  | "coppockCurve"
  | "correlationCoefficientBasic"
  | "correlationCoefficient"
  | "cumulativeVolumeDelta"
  | "cumulativeVolumeIndex"
  | "detrendedPriceOscillator"
  | "directionalMovementIndex"
  | "donchianChannels"
  | "doubleEma"
  | "easeOfMovement"
  | "elderForceIndex"
  | "envelope"
  | "fisherTransform"
  | "gaps"
  | "historicalVolatility"
  | "hullMovingAverage"
  | "ichimokuCloud"
  | "keltnerChannels"
  | "klingerOscillator"
  | "knowSureThing"
  | "leastSquaresMovingAverage"
  | "linearRegressionChannel"
  | "maCross"
  | "massIndex"
  | "mcginleyDynamic"
  | "median"
  | "momentum"
  | "moneyFlowIndex"
  | "moonPhases"
  | "movingAverageConvergenceDivergence"
  | "movingAverageExponential"
  | "movingAverageRibbon"
  | "movingAverageSimple"
  | "movingAverageWeighted"
  | "multiTimePeriodCharts"
  | "netVolume"
  | "onBalanceVolume"
  | "openInterest"
  | "parabolicSar"
  | "performance"
  | "pivotPointsHighLow"
  | "pivotPointsStandard"
  | "priceOscillator"
  | "priceTarget"
  | "priceVolumeTrendBasic"
  | "priceVolumeTrend"
  | "rankCorrelationIndex"
  | "rateOfChange"
  | "rciRibbon"
  | "relativeStrengthIndex"
  | "relativeVigorIndex"
  | "relativeVolatilityIndex"
  | "relativeVolumeAtTime"
  | "robBookerIntradayPivotPoints"
  | "robBookerKnoxvilleDivergence"
  | "robBookerMissedPivotPoints"
  | "robBookerReversal"
  | "robBookerZivGhostPivots"
  | "rsiDivergenceIndicator"
  | "seasonality"
  | "smiErgodicIndicator"
  | "smiErgodicOscillator"
  | "smoothedMovingAverage"
  | "stochastic"
  | "stochasticMomentumIndex"
  | "stochasticRsi"
  | "supertrend"
  | "technicalRatings"
  | "timeWeightedAveragePrice"
  | "tradingSessions"
  | "trendStrengthIndex"
  | "tripleEma"
  | "trix"
  | "trueStrengthIndex"
  | "ultimateOscillator"
  | "upDownVolume"
  | "visibleAveragePrice"
  | "volatilityStop"
  | "volume"
  | "volumeDelta"
  | "volumeOscillator"
  | "volumeWeightedAveragePrice"
  | "volumeWeightedMovingAverage"
  | "vortexIndicator"
  | "williamsAlligator"
  | "williamsFractals"
  | "williamsPercentRange"
  | "woodiesCci"
  | "zigZag";

/**
 * Maps indicator enum values to TradingView's internal indicator IDs.
 * @internal
 */
const IndicatorMap: Record<AdvancedChartIndicator, string> = {
  volume24h: "STD;24h%Volume",
  accumulationDistribution: "STD;Accumulation_Distribution",
  advanceDeclineLine: "STD;Advance%1Decline%1Line",
  advanceDeclineRatio: "STD;Advance%1Decline%1Ratio",
  advanceDeclineRatioBars: "STD;Advance_Decline_Ratio_Bars",
  arnaudLegouxMovingAverage: "STD;Arnaud%1Legoux%1Moving%1Average",
  aroon: "STD;Aroon",
  averageDayRange: "STD;Average%Day%Range",
  averageDirectionalIndex: "STD;Average%1Directional%1Index",
  averageTrueRange: "STD;Average_True_Range",
  awesomeOscillator: "STD;Awesome_Oscillator",
  balanceOfPower: "STD;Balance%1of%1Power",
  bbTrend: "STD;BBTrend",
  bollingerBands: "STD;Bollinger_Bands",
  bollingerBandsPercentB: "STD;Bollinger_Bands_B",
  bollingerBandwidth: "STD;Bollinger_Bands_Width",
  bollingerBars: "STD;Bollinger%1Bars",
  bullBearPower: "STD;Bull%Bear%Power",
  chaikinMoneyFlow: "STD;Chaikin_Money_Flow",
  chaikinOscillator: "STD;Chaikin_Oscillator",
  chandeKrollStop: "STD;Chande%1Kroll%1Stop",
  chandeMomentumOscillator: "STD;Chande_Momentum_Oscillator",
  chopZone: "STD;Chop%1Zone",
  choppinessIndex: "STD;Choppiness_Index",
  commodityChannelIndex: "STD;CCI",
  connorsRsi: "STD;Connors_RSI",
  coppockCurve: "STD;Coppock%1Curve",
  correlationCoefficientBasic: "CorrelationCoefficient@tv-basicstudies",
  correlationCoefficient: "STD;Correlation_Coeff",
  cumulativeVolumeDelta: "STD;Cumulative%1Volume%1Delta",
  cumulativeVolumeIndex: "STD;Cumulative%1Volume%1Index",
  detrendedPriceOscillator: "STD;DPO",
  directionalMovementIndex: "STD;DMI",
  donchianChannels: "STD;Donchian_Channels",
  doubleEma: "STD;DEMA",
  easeOfMovement: "STD;EOM",
  elderForceIndex: "STD;EFI",
  envelope: "STD;ENV",
  fisherTransform: "STD;Fisher_Transform",
  gaps: "STD;Gaps",
  historicalVolatility: "STD;Historical_Volatility",
  hullMovingAverage: "STD;Hull%1MA",
  ichimokuCloud: "STD;Ichimoku%1Cloud",
  keltnerChannels: "STD;Keltner_Channels",
  klingerOscillator: "STD;Klinger%1Oscillator",
  knowSureThing: "STD;Know_Sure_Thing",
  leastSquaresMovingAverage: "STD;Least%1Squares%1Moving%1Average",
  linearRegressionChannel: "STD;Linear_Regression",
  maCross: "STD;MA%1Cross",
  massIndex: "STD;Mass%1Index",
  mcginleyDynamic: "STD;McGinley%1Dynamic",
  median: "STD;Median",
  momentum: "STD;Momentum",
  moneyFlowIndex: "STD;Money_Flow",
  moonPhases: "MoonPhases@tv-basicstudies", // not the same as STD
  movingAverageConvergenceDivergence: "STD;MACD",
  movingAverageExponential: "STD;EMA",
  movingAverageRibbon: "STD;MA%Ribbon",
  movingAverageSimple: "STD;SMA",
  movingAverageWeighted: "STD;WMA",
  multiTimePeriodCharts: "STD;Multi-Time%Period%Charts",
  netVolume: "STD;Net%1Volume",
  onBalanceVolume: "STD;On_Balance_Volume",
  openInterest: "STD;Open%Interest",
  parabolicSar: "STD;PSAR",
  performance: "STD;Performance",
  pivotPointsHighLow: "STD;Pivot%1Points%1High%1Low",
  pivotPointsStandard: "STD;Pivot%1Points%1Standard",
  priceOscillator: "STD;Price_Oscillator",
  priceTarget: "STD;Price%1Target",
  priceVolumeTrendBasic: "PriceVolumeTrend@tv-basicstudies",
  priceVolumeTrend: "STD;Price_Volume_Trend",
  rankCorrelationIndex: "STD;Rank_Correlation_Index",
  rateOfChange: "STD;ROC",
  rciRibbon: "STD;RCI_Ribbon",
  relativeStrengthIndex: "STD;RSI",
  relativeVigorIndex: "STD;Relative_Vigor_Index",
  relativeVolatilityIndex: "STD;Relative_Volatility_Index",
  relativeVolumeAtTime: "STD;Relative%1Volume%1at%1Time",
  robBookerIntradayPivotPoints: "BookerIntradayPivots@tv-basicstudies",
  robBookerKnoxvilleDivergence: "BookerKnoxvilleDivergence@tv-basicstudies",
  robBookerMissedPivotPoints: "BookerMissedPivots@tv-basicstudies",
  robBookerReversal: "BookerReversal@tv-basicstudies",
  robBookerZivGhostPivots: "STD;Rob%1Booker%1Ghost%1Pivots%1v2",
  rsiDivergenceIndicator: "STD;Divergence%1Indicator",
  seasonality: "STD;Seasonality",
  smiErgodicIndicator: "STD;SMI_Ergodic_Indicator_Oscillator",
  smiErgodicOscillator: "STD;SMI_Ergodic_Oscillator",
  smoothedMovingAverage: "STD;Smoothed%1Moving%1Average",
  stochastic: "STD;Stochastic",
  stochasticMomentumIndex: "STD;SMI",
  stochasticRsi: "STD;Stochastic_RSI",
  supertrend: "STD;Supertrend",
  technicalRatings: "STD;Technical%1Ratings",
  timeWeightedAveragePrice: "STD;Time%1Weighted%1Average%1Price",
  tradingSessions: "STD;Trading%1Sessions",
  trendStrengthIndex: "STD;Trend%1Strength%1Index",
  tripleEma: "STD;TEMA",
  trix: "STD;TRIX",
  trueStrengthIndex: "STD;True%1Strength%1Indicator",
  ultimateOscillator: "STD;Ultimate_Oscillator",
  upDownVolume: "STD;UP_DOWN_Volume",
  visibleAveragePrice: "STD;Visible%1Average%1Price",
  volatilityStop: "STD;Volatility_Stop",
  volume: "Volume@tv-basicstudies",
  volumeDelta: "STD;Volume%1Delta",
  volumeOscillator: "STD;Volume%1Oscillator",
  volumeWeightedAveragePrice: "STD;VWAP",
  volumeWeightedMovingAverage: "STD;VWMA",
  vortexIndicator: "STD;Vortex%1Indicator",
  williamsAlligator: "STD;Williams_Alligator",
  williamsFractals: "STD;Whilliams_Fractals",
  williamsPercentRange: "STD;Willams_R",
  woodiesCci: "STD;Woodies%1CCI",
  zigZag: "STD;Zig_Zag",
};

/**
 * Position for comparison symbols on the chart.
 * - `SameScale`: Symbol shares the same price scale as the main symbol
 * - `NewPriceScale`: Symbol gets its own price scale on the right
 * - `NewPane`: Symbol is displayed in a separate pane below the main chart
 */
export type ComparisonPosition = "SameScale" | "NewPriceScale" | "NewPane";

/**
 * Configuration for additional symbols to compare against the main symbol.
 *
 * @example
 * ```tsx
 * <AdvancedChart
 *   symbol="NASDAQ:AAPL"
 *   compareSymbols={[
 *     { symbol: "NASDAQ:GOOGL", position: "SameScale" },
 *     { symbol: "NASDAQ:MSFT", position: "NewPriceScale" }
 *   ]}
 * />
 * ```
 */
export type ComparisonSymbol = {
  /** The symbol to compare (e.g., "NASDAQ:GOOGL") */
  readonly symbol: string;
  /** How to display this symbol relative to the main chart */
  readonly position: ComparisonPosition;
};

/**
 * Props for the AdvancedChart component.
 */
export type AdvancedChartProps = {
  /**
   * The financial symbol to display (e.g., "NASDAQ:AAPL", "BINANCE:BTCUSDT").
   * This is the primary symbol that will be charted.
   *
   * @example "NASDAQ:AAPL", "FOREX:EURUSD", "BINANCE:BTCUSDT"
   */
  readonly symbol: string;

  /**
   * Color theme for the chart interface.
   * @default "light"
   */
  readonly colorTheme?: ColorTheme;

  /**
   * Chart width in pixels. Ignored if `autosize` is true.
   * @default 400
   */
  readonly width?: number;

  /**
   * Chart height in pixels. Ignored if `autosize` is true.
   * @default 300
   */
  readonly height?: number;

  /**
   * Locale for chart interface and number formatting.
   * @default "en"
   */
  readonly locale?: Locale;

  /**
   * Custom background color for the chart area.
   * Supports any CSS color format: hex, rgb, rgba, hsl, oklch, etc.
   *
   * @example
   * ```tsx
   * backgroundColor="rgba(13, 13, 13, 1)" // Dark background
   * backgroundColor="hsl(210, 100%, 95%)" // Light blue
   * backgroundColor="#1a1a1a" // Hex dark
   * ```
   */
  readonly backgroundColor?: string;

  /**
   * Custom color for chart grid lines.
   * Supports any CSS color format: hex, rgb, rgba, hsl, oklch, etc.
   *
   * @example
   * ```tsx
   * gridColor="rgba(255, 0, 0, 0.2)" // Semi-transparent red
   * gridColor="hsl(240, 100%, 80%)" // Light blue
   * gridColor="#ffff0033" // Yellow with alpha
   * ```
   */
  readonly gridColor?: string;

  /**
   * Time interval for chart candles/bars.
   * Numbers represent minutes, "D" = daily, "W" = weekly.
   * @default "1"
   */
  readonly interval?: AdvancedChartInterval;

  /**
   * Timezone for displaying chart data timestamps.
   * Use "exchange" to show data in the exchange's timezone.
   * @default "Etc/UTC"
   */
  readonly timezone?: TimeZone;

  /**
   * Chart visualization style (candles, bars, line, etc.).
   * @default "candles"
   */
  readonly chartStyle?: AdvancedChartStyle;

  /**
   * Array of technical indicators to display on the chart.
   * Indicators will be automatically added when the chart loads.
   *
   * @example
   * ```tsx
   * indicators={["relativeStrengthIndex", "movingAverageSimple", "volume"]}
   * ```
   */
  readonly indicators?: AdvancedChartIndicator[];

  /**
   * Array of symbols for the watchlist sidebar.
   *
   * @example
   * ```tsx
   * watchlist={["NASDAQ:AAPL", "NASDAQ:GOOGL", "NASDAQ:MSFT"]}
   * ```
   */
  readonly watchlist?: string[];

  /**
   * Additional symbols to compare against the main symbol.
   * These will be overlaid on the chart for comparison.
   */
  readonly compareSymbols?: ComparisonSymbol[];

  /**
   * Whether the chart should automatically resize to fit its container.
   * When true, `width` and `height` props are ignored.
   * @default true
   */
  readonly autosize?: boolean;

  /**
   * Whether users can change the symbol from within the chart interface.
   * @default true
   */
  readonly allowSymbolChange?: boolean;

  /**
   * Whether to show the bottom toolbar with date range buttons.
   * @default false
   */
  readonly showBottomToolbar?: boolean;

  /**
   * Whether to show detailed information panel.
   * @default false
   */
  readonly showDetails?: boolean;

  /**
   * Whether to show the left sidebar with drawing tools.
   * @default true
   */
  readonly showDrawingToolsBar?: boolean;

  /**
   * Whether to show the hotlist sidebar on the right.
   * @default false
   */
  readonly showHotlist?: boolean;

  /**
   * Whether to show the save image button in the top toolbar.
   * @default false
   */
  readonly showSaveImageButton?: boolean;

  /**
   * Whether to show symbol description/legend information.
   * @default true
   */
  readonly showSymbolDescription?: boolean;

  /**
   * Whether to show the top toolbar with chart controls.
   * @default true
   */
  readonly showTopToolbar?: boolean;

  /**
   * Whether to show volume bars at the bottom of the chart.
   * @default true
   */
  readonly showVolume?: boolean;

  /**
   * Callback function called when an error occurs during chart initialization.
   * @param error The error that occurred
   */
  readonly onError?: (error: Error) => void;
};

/**
 * Advanced TradingView chart widget with full trading capabilities.
 *
 * This is the most feature-rich chart component, providing the complete TradingView
 * charting experience with technical analysis tools, indicators, drawing tools,
 * and extensive customization options.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/
 *
 * @example
 * Basic usage:
 * ```tsx
 * <AdvancedChart symbol="NASDAQ:AAPL" />
 * ```
 *
 * @example
 * With custom styling and indicators:
 * ```tsx
 * <AdvancedChart
 *   symbol="NASDAQ:AAPL"
 *   interval="D"
 *   chartStyle="candles"
 *   colorTheme="dark"
 *   backgroundColor="rgba(13, 13, 13, 1)"
 *   gridColor="rgba(255, 255, 255, 0.1)"
 *   indicators={["relativeStrengthIndex", "bollingerBands"]}
 *   showDrawingToolsBar
 *   showVolume
 * />
 * ```
 *
 * @example
 * Comparison chart:
 * ```tsx
 * <AdvancedChart
 *   symbol="NASDAQ:AAPL"
 *   compareSymbols={[
 *     { symbol: "NASDAQ:GOOGL", position: "SameScale" },
 *     { symbol: "NASDAQ:MSFT", position: "NewPriceScale" }
 *   ]}
 * />
 * ```
 */
export const AdvancedChart = (props: AdvancedChartProps): JSX.Element => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: 400,
      height: 300,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      interval: "1" as AdvancedChartInterval,
      timezone: "Etc/UTC" as TimeZone,
      chartStyle: "candles" as AdvancedChartStyle,
      indicators: [] as AdvancedChartIndicator[],
      watchlist: [] as string[],
      compareSymbols: [] as ComparisonSymbol[],

      autosize: true,
      allowSymbolChange: true,
      showBottomToolbar: false,
      showDetails: false,
      showDrawingToolsBar: true,
      showHotlist: false,
      showSaveImageButton: false,
      showSymbolDescription: true,
      showTopToolbar: true,
      showVolume: true,
    },
    props,
  );

  createEffect(() => {
    const widgetRoot = document.createElement("div");
    widgetRoot.classList.add("tradingview-widget-container__widget");
    container.appendChild(widgetRoot);

    container.style.width = _props.autosize ? "100%" : `${_props.width}px`;
    container.style.height = _props.autosize ? "100%" : `${_props.height}px`;

    widgetRoot.style.width = _props.autosize ? "100%" : `${_props.width}px`;
    widgetRoot.style.height = _props.autosize ? "100%" : `${_props.height}px`;

    const downloadScript = async () => {
      const [error] = await tryCatch(
        loadScript(
          "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
          {
            textContent: JSON.stringify({
              symbol: _props.symbol,
              width: _props.autosize ? "100%" : _props.width,
              height: _props.autosize ? "100%" : _props.height,
              interval: _props.interval,
              locale: _props.locale,
              theme: _props.colorTheme,
              timezone: _props.timezone,
              style: _props.chartStyle,
              backgroundColor: _props.backgroundColor,
              gridColor: _props.gridColor,
              studies: _props.indicators.map((indicator) => IndicatorMap[indicator]),
              watchlist: _props.watchlist,
              compare_symbols: _props.compareSymbols,
              allow_symbol_change: _props.allowSymbolChange,
              withdateranges: _props.showBottomToolbar,
              details: _props.showDetails,
              hide_side_toolbar: !_props.showDrawingToolsBar,
              hotlist: _props.showHotlist,
              save_image: _props.showSaveImageButton,
              hide_legend: !_props.showSymbolDescription,
              hide_top_toolbar: !_props.showTopToolbar,
              hide_volume: !_props.showVolume,
              support_host: "https://www.tradingview.com",
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
