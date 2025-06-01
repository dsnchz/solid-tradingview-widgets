import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Feed modes for the TopStories widget.
 * - `all_symbols`: Shows news from all markets and symbols
 * - `market`: Shows news for a specific market sector
 * - `symbol`: Shows news for a specific symbol (requires symbol prop)
 *
 * @example
 * ```tsx
 * <TopStories feedMode="all_symbols" /> // All market news
 * <TopStories feedMode="symbol" symbol="NASDAQ:AAPL" /> // Apple-specific news
 * ```
 */
export type TopStoriesFeedMode = "all_symbols" | "market" | "symbol";

/**
 * Display modes for the TopStories widget layout.
 * - `adaptive`: Automatically adjusts layout based on container size
 * - `regular`: Standard layout with full article previews
 * - `compact`: Condensed layout with minimal article previews
 *
 * @example
 * ```tsx
 * <TopStories displayMode="compact" /> // Minimal space usage
 * <TopStories displayMode="regular" /> // Full article previews
 * ```
 */
export type TopStoriesDisplayMode = "adaptive" | "regular" | "compact";

/**
 * Base props shared by all TopStories feed modes.
 */
type BaseTopStoriesProps = {
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
   * Layout mode for displaying news articles.
   * @default "adaptive"
   */
  readonly displayMode?: TopStoriesDisplayMode;

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
 * Props when feedMode is "symbol" - symbol prop is required.
 * Use this configuration to show news specifically related to a particular symbol.
 *
 * @example
 * ```tsx
 * <TopStories feedMode="symbol" symbol="NASDAQ:AAPL" />
 * <TopStories feedMode="symbol" symbol="BINANCE:BTCUSDT" />
 * ```
 */
type SymbolModeProps = BaseTopStoriesProps & {
  /** Feed mode set to symbol-specific news */
  readonly feedMode: Exclude<TopStoriesFeedMode, "all_symbols" | "market">;
  /**
   * The financial symbol to show news for (e.g., "NASDAQ:AAPL", "BINANCE:BTCUSDT").
   * Required when feedMode is "symbol".
   */
  readonly symbol: string;
};

/**
 * Props when feedMode is "all_symbols" or "market" - symbol prop is not needed.
 * Use this configuration for general market news or sector-specific news.
 *
 * @example
 * ```tsx
 * <TopStories feedMode="all_symbols" /> // All market news
 * <TopStories feedMode="market" /> // Market sector news
 * ```
 */
type NonSymbolModeProps = BaseTopStoriesProps & {
  /** Feed mode for general or market news */
  readonly feedMode: Exclude<TopStoriesFeedMode, "symbol">;
  /** Symbol prop is not allowed for non-symbol feed modes */
  readonly symbol?: never;
};

/**
 * Union type for all possible TopStories prop combinations.
 * Ensures type safety for conditional symbol prop requirement.
 */
export type TopStoriesProps = SymbolModeProps | NonSymbolModeProps;

/**
 * TradingView TopStories widget for displaying financial news.
 *
 * Help your audience keep track of what's happening in the crypto and stock markets
 * with daily news briefs designed to be read in 20 seconds or less. The widget
 * provides curated financial news with multiple display modes and feed configurations.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/news/top-stories/
 *
 * @example
 * Basic usage - all market news:
 * ```tsx
 * <TopStories />
 * ```
 *
 * @example
 * Symbol-specific news:
 * ```tsx
 * <TopStories
 *   feedMode="symbol"
 *   symbol="NASDAQ:AAPL"
 *   displayMode="compact"
 *   colorTheme="dark"
 * />
 * ```
 *
 * @example
 * Custom styling and layout:
 * ```tsx
 * <TopStories
 *   feedMode="all_symbols"
 *   displayMode="regular"
 *   width={600}
 *   height={400}
 *   colorTheme="light"
 *   isTransparent={false}
 *   autosize={false}
 * />
 * ```
 */
export const TopStories = (props: TopStoriesProps) => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
      feedMode: "all_symbols" as TopStoriesFeedMode,
      displayMode: "adaptive" as TopStoriesDisplayMode,
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

    const widgetConfig: Record<string, string | number | boolean> = {
      width: fullWidth ? "100%" : _props.width,
      height: fullHeight ? "100%" : _props.height,
      locale: _props.locale,
      colorTheme: _props.colorTheme,
      feedMode: _props.feedMode,
      displayMode: _props.displayMode,
      isTransparent: _props.isTransparent,
    };

    if (_props.feedMode === "symbol") {
      widgetConfig.symbol = _props.symbol;
    }

    const downloadScript = async () => {
      const [error] = await tryCatch(
        loadScript(
          "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js",
          {
            textContent: JSON.stringify(widgetConfig),
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
