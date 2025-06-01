import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Exchange regions and markets supported by the TradingView Screener widget.
 *
 * The screener supports stock exchanges from major financial markets worldwide,
 * as well as forex and cryptocurrency markets. Each exchange has its own set of
 * available column views and screening criteria.
 *
 * **Americas:**
 * - `america`: United States stock markets (NYSE, NASDAQ, etc.)
 * - `argentina`: Buenos Aires Stock Exchange (BYMA)
 * - `brazil`: B3 (Brasil Bolsa Balcão)
 * - `canada`: Toronto Stock Exchange (TSX)
 * - `chile`: Santiago Stock Exchange
 * - `colombia`: Colombia Stock Exchange
 * - `mexico`: Mexican Stock Exchange (BMV)
 * - `venezuela`: Caracas Stock Exchange
 * - `australia`: Australian Securities Exchange (ASX)
 *
 * **Europe:**
 * - `austria`: Vienna Stock Exchange
 * - `cyprus`: Cyprus Stock Exchange
 * - `czech`: Prague Stock Exchange
 * - `denmark`: NASDAQ Copenhagen
 * - `estonia`: NASDAQ Tallinn
 * - `finland`: NASDAQ Helsinki
 * - `germany`: Frankfurt Stock Exchange (XETRA)
 * - `greece`: Athens Exchange
 * - `hungary`: Budapest Stock Exchange
 * - `iceland`: NASDAQ Iceland
 * - `italy`: Borsa Italiana
 * - `latvia`: NASDAQ Riga
 * - `lithuania`: NASDAQ Vilnius
 * - `poland`: Warsaw Stock Exchange
 * - `russia`: Moscow Exchange
 * - `spain`: Madrid Stock Exchange (BME)
 * - `switzerland`: SIX Swiss Exchange
 *
 * **Asia & Middle East:**
 * - `china`: Shanghai and Shenzhen Stock Exchanges
 * - `india`: NSE and BSE (National and Bombay Stock Exchanges)
 * - `indonesia`: Indonesia Stock Exchange
 * - `israel`: Tel Aviv Stock Exchange
 * - `kuwait`: Kuwait Stock Exchange
 * - `srilanka`: Colombo Stock Exchange
 * - `taiwan`: Taiwan Stock Exchange
 * - `turkey`: Borsa Istanbul
 * - `uae`: Dubai Financial Market and Abu Dhabi Securities Exchange
 * - `vietnam`: Ho Chi Minh and Hanoi Stock Exchanges
 *
 * **Africa:**
 * - `egypt`: Egyptian Exchange
 * - `morocco`: Casablanca Stock Exchange
 * - `rsa`: Johannesburg Stock Exchange (South Africa)
 *
 * **Global Markets:**
 * - `forex`: Foreign exchange currency pairs
 * - `crypto`: Cryptocurrency markets
 *
 * @example
 * ```tsx
 * <Screener exchange="america" /> // US markets
 * <Screener exchange="germany" /> // German DAX and other German stocks
 * <Screener exchange="forex" /> // Currency pairs
 * <Screener exchange="crypto" /> // Cryptocurrencies
 * ```
 */
export type ScreenerExchange =
  // Americas
  | "america"
  | "argentina"
  | "brazil"
  | "canada"
  | "chile"
  | "colombia"
  | "mexico"
  | "venezuela"
  | "australia"

  // Europe
  | "austria"
  | "cyprus"
  | "czech"
  | "denmark"
  | "estonia"
  | "finland"
  | "germany"
  | "greece"
  | "hungary"
  | "iceland"
  | "italy"
  | "latvia"
  | "lithuania"
  | "poland"
  | "russia"
  | "spain"
  | "switzerland"

  // Asia & Middle East
  | "china"
  | "india"
  | "indonesia"
  | "israel"
  | "kuwait"
  | "srilanka"
  | "taiwan"
  | "turkey"
  | "uae"
  | "vietnam"

  // Africa
  | "egypt"
  | "morocco"
  | "rsa" // South Africa

  // Global/Other
  | "forex"
  | "crypto";

/**
 * Available column views for stock screening.
 * Different markets support different column sets:
 * - Stock markets: Full feature set with all financial data
 * - Forex/Crypto: Limited set focusing on price and technical data
 *
 * **All Columns (Stock Markets):**
 * - `overview`: Basic symbol information and key metrics
 * - `performance`: Price performance over various time periods
 * - `valuation`: Valuation ratios (P/E, P/B, EV/EBITDA, etc.)
 * - `dividends`: Dividend yield, payout ratio, ex-dividend dates
 * - `margins`: Profit margins (gross, operating, net)
 * - `income_statement`: Revenue, earnings, and income metrics
 * - `balance_sheet`: Assets, liabilities, and equity data
 * - `oscillators`: Technical oscillator indicators (RSI, Stochastic, etc.)
 * - `moving_averages`: Moving average technical indicators
 *
 * **Sub Columns (Forex/Crypto Markets):**
 * - `overview`: Basic symbol information and key metrics
 * - `performance`: Price performance over various time periods
 * - `oscillators`: Technical oscillator indicators
 * - `moving_averages`: Moving average technical indicators
 */
const ALL_COLUMNS = [
  "overview",
  "performance",
  "valuation",
  "dividends",
  "margins",
  "income_statement",
  "balance_sheet",
  "oscillators",
  "moving_averages",
] as const;

const SUB_COLUMNS = ["overview", "performance", "oscillators", "moving_averages"] as const;

type ScreenerColumns = typeof ALL_COLUMNS | typeof SUB_COLUMNS;

export const ScreenerColumnViews: Record<ScreenerExchange, ScreenerColumns> = {
  america: ALL_COLUMNS,
  argentina: ALL_COLUMNS,
  australia: ALL_COLUMNS,
  austria: ALL_COLUMNS,
  brazil: ALL_COLUMNS,
  canada: ALL_COLUMNS,
  chile: ALL_COLUMNS,
  colombia: ALL_COLUMNS,
  cyprus: ALL_COLUMNS,
  czech: ALL_COLUMNS,
  denmark: ALL_COLUMNS,
  egypt: ALL_COLUMNS,
  estonia: ALL_COLUMNS,
  finland: ALL_COLUMNS,
  germany: ALL_COLUMNS,
  greece: ALL_COLUMNS,
  hungary: ALL_COLUMNS,
  iceland: ALL_COLUMNS,
  india: ALL_COLUMNS,
  indonesia: ALL_COLUMNS,
  israel: ALL_COLUMNS,
  italy: ALL_COLUMNS,
  kuwait: ALL_COLUMNS,
  latvia: ALL_COLUMNS,
  lithuania: ALL_COLUMNS,
  china: ALL_COLUMNS,
  mexico: ALL_COLUMNS,
  morocco: ALL_COLUMNS,
  poland: ALL_COLUMNS,
  russia: ALL_COLUMNS,
  rsa: ALL_COLUMNS,
  spain: ALL_COLUMNS,
  srilanka: ALL_COLUMNS,
  switzerland: ALL_COLUMNS,
  taiwan: ALL_COLUMNS,
  turkey: ALL_COLUMNS,
  uae: ALL_COLUMNS,
  venezuela: ALL_COLUMNS,
  vietnam: ALL_COLUMNS,

  forex: SUB_COLUMNS,
  crypto: SUB_COLUMNS,
};

/**
 * Available screening criteria for filtering stocks.
 * Different markets support different screening options:
 * - Stock markets: Full feature set with fundamental and technical screens
 * - Forex/Crypto: Limited set focusing on technical analysis
 *
 * **All Screens (Stock Markets):**
 * - `most_capitalized`: Largest companies by market cap
 * - `volume_leaders`: Highest trading volume
 * - `top_gainers`: Best price performance today
 * - `top_losers`: Worst price performance today
 * - `ath`: Stocks at all-time highs
 * - `atl`: Stocks at all-time lows
 * - `high_dividend`: Highest dividend yields
 * - `above_52wk_high`: Trading above 52-week high
 * - `below_52wk_low`: Trading below 52-week low
 * - `monthly_high`: At monthly price highs
 * - `monthly_low`: At monthly price lows
 * - `most_volatile`: Highest price volatility
 * - `unusual_volume`: Unusual trading volume activity
 * - `overbought`: Technically overbought stocks
 * - `oversold`: Technically oversold stocks
 * - `outperforming_SMA50`: Above 50-day moving average
 * - `underperforming_SMA50`: Below 50-day moving average
 * - `earnings_this_week`: Companies reporting earnings this week
 *
 * **Sub Screens (Forex/Crypto Markets):**
 * - `general`: General currency/crypto overview
 * - `top_gainers`: Best performers
 * - `top_losers`: Worst performers
 * - `ath`: At all-time highs
 * - `atl`: At all-time lows
 * - `above_52wk_high`: Above 52-week high
 * - `below_52wk_low`: Below 52-week low
 * - `monthly_high`: At monthly highs
 * - `monthly_low`: At monthly lows
 * - `most_volatile`: Most volatile pairs
 * - `overbought`: Overbought pairs
 * - `oversold`: Oversold pairs
 * - `outperforming_SMA50`: Above 50-day MA
 * - `underperforming_SMA50`: Below 50-day MA
 */
const ALL_SCREENS = [
  "most_capitalized",
  "volume_leaders",
  "top_gainers",
  "top_losers",
  "ath",
  "atl",
  "high_dividend",
  "above_52wk_high",
  "below_52wk_low",
  "monthly_high",
  "monthly_low",
  "most_volatile",
  "unusual_volume",
  "overbought",
  "oversold",
  "outperforming_SMA50",
  "underperforming_SMA50",
  "earnings_this_week",
] as const;

const SUB_SCREENS = [
  "general",
  "top_gainers",
  "top_losers",
  "ath",
  "atl",
  "above_52wk_high",
  "below_52wk_low",
  "monthly_high",
  "monthly_low",
  "most_volatile",
  "overbought",
  "oversold",
  "outperforming_SMA50",
  "underperforming_SMA50",
] as const;

type ScreenerScreens = typeof ALL_SCREENS | typeof SUB_SCREENS;

export const ScreenerScreenViews: Record<ScreenerExchange, ScreenerScreens> = {
  america: ALL_SCREENS,
  argentina: ALL_SCREENS,
  australia: ALL_SCREENS,
  austria: ALL_SCREENS,
  brazil: ALL_SCREENS,
  canada: ALL_SCREENS,
  chile: ALL_SCREENS,
  colombia: ALL_SCREENS,
  cyprus: ALL_SCREENS,
  czech: ALL_SCREENS,
  denmark: ALL_SCREENS,
  egypt: ALL_SCREENS,
  estonia: ALL_SCREENS,
  finland: ALL_SCREENS,
  germany: ALL_SCREENS,
  greece: ALL_SCREENS,
  hungary: ALL_SCREENS,
  iceland: ALL_SCREENS,
  india: ALL_SCREENS,
  indonesia: ALL_SCREENS,
  israel: ALL_SCREENS,
  italy: ALL_SCREENS,
  kuwait: ALL_SCREENS,
  latvia: ALL_SCREENS,
  lithuania: ALL_SCREENS,
  china: ALL_SCREENS,
  mexico: ALL_SCREENS,
  morocco: ALL_SCREENS,
  poland: ALL_SCREENS,
  russia: ALL_SCREENS,
  rsa: ALL_SCREENS,
  spain: ALL_SCREENS,
  srilanka: ALL_SCREENS,
  switzerland: ALL_SCREENS,
  taiwan: ALL_SCREENS,
  turkey: ALL_SCREENS,
  uae: ALL_SCREENS,
  venezuela: ALL_SCREENS,
  vietnam: ALL_SCREENS,

  forex: SUB_SCREENS,
  crypto: SUB_SCREENS,
};

/**
 * Props for the Screener component.
 */
export type ScreenerProps<E extends ScreenerExchange = "america"> = {
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
   * The exchange to display.
   * @default "america"
   */
  readonly exchange?: E;

  /**
   * The column view to display.
   * @default "overview"
   */
  readonly defaultColumnView?: (typeof ScreenerColumnViews)[E][number];

  /**
   * The default screen view to display.
   * @default "general"
   */
  readonly defaultScreenView?: (typeof ScreenerScreenViews)[E][number];

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
   * Whether to show the top toolbar.
   * @default true
   */
  readonly showTopToolbar?: boolean;

  /**
   * Callback function called when an error occurs during widget initialization.
   * @param error The error that occurred
   */
  readonly onError?: (error: Error) => void;
};

/**
 * TradingView Screener widget for filtering and discovering financial instruments.
 *
 * This powerful screening tool helps users filter through thousands of stocks, forex pairs,
 * and cryptocurrencies based on fundamental and technical criteria. The screener provides
 * customizable views with various data columns and pre-built screening strategies to identify
 * investment opportunities, trending instruments, and market leaders.
 *
 * **Key Features:**
 * - Multi-market support (stocks, forex, crypto)
 * - Fundamental screening (P/E ratios, market cap, dividends, etc.)
 * - Technical analysis filters (RSI, moving averages, volume, etc.)
 * - Pre-built screens (top gainers, high dividend, most volatile, etc.)
 * - Customizable column views (overview, performance, valuation, etc.)
 * - Real-time data updates
 * - Interactive sorting and filtering
 * - Export capabilities
 *
 * **Supported Markets:**
 * - **Stock Markets:** Full fundamental and technical analysis
 * - **Forex Markets:** Technical analysis and price performance
 * - **Cryptocurrency Markets:** Technical analysis and price performance
 *
 * @see https://www.tradingview.com/widget-docs/widgets/screeners/screener/
 *
 * @example
 * Basic US stock screener:
 * ```tsx
 * <Screener exchange="america" />
 * ```
 *
 * @example
 * German stock screener with custom view:
 * ```tsx
 * <Screener
 *   exchange="germany"
 *   defaultColumnView="valuation"
 *   defaultScreenView="top_gainers"
 *   colorTheme="dark"
 *   width={800}
 *   height={600}
 *   autosize={false}
 * />
 * ```
 *
 * @example
 * Forex screener with compact layout:
 * ```tsx
 * <Screener
 *   exchange="forex"
 *   defaultColumnView="performance"
 *   defaultScreenView="most_volatile"
 *   colorTheme="light"
 *   isTransparent
 *   showTopToolbar={false}
 * />
 * ```
 *
 * @example
 * Cryptocurrency screener with custom configuration:
 * ```tsx
 * <Screener
 *   exchange="crypto"
 *   defaultColumnView="overview"
 *   defaultScreenView="top_gainers"
 *   width={1000}
 *   height={700}
 *   locale="es"
 *   colorTheme="dark"
 *   autosize={false}
 *   isTransparent={false}
 * />
 * ```
 */
export const Screener = <E extends ScreenerExchange = "america">(props: ScreenerProps<E>) => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      exchange: "america" as ScreenerExchange,
      defaultColumnView: "overview" as (typeof ScreenerColumnViews)[E][number],
      defaultScreenView: "most_capitalized" as (typeof ScreenerScreenViews)[E][number],
      autosize: true,
      isTransparent: false,
      showTopToolbar: true,
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
              width: fullWidth ? "100%" : _props.width,
              height: fullHeight ? "100%" : _props.height,
              locale: _props.locale,
              colorTheme: _props.colorTheme,
              isTransparent: _props.isTransparent,
              showTopToolbar: _props.showTopToolbar,
              market: _props.exchange,
              defaultColumn: _props.defaultColumnView,
              defaultScreen: _props.defaultScreenView,
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
