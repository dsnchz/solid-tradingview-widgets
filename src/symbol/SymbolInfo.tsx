import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, type JSX, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Props for the SymbolInfo component.
 */
export type SymbolInfoProps = {
  /**
   * The financial symbol to display information for (e.g., "NASDAQ:AAPL", "BINANCE:BTCUSDT").
   * This is the primary symbol for which detailed information will be shown.
   *
   * @example "NASDAQ:AAPL", "FOREX:EURUSD", "BINANCE:BTCUSDT", "NYSE:TSLA"
   */
  readonly symbol: string;

  /**
   * Widget width in pixels. The widget automatically adjusts its height.
   * @default "full"
   */
  readonly width?: Size;

  /**
   * Locale for widget interface and content language.
   * @default "en"
   */
  readonly locale?: Locale;

  /**
   * Color theme for the widget interface.
   * @default "light"
   */
  readonly colorTheme?: ColorTheme;

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
 * TradingView SymbolInfo widget for displaying detailed symbol information.
 *
 * This widget provides comprehensive information about a financial symbol including
 * current price, price change, volume, market cap, and other key metrics. It's
 * perfect for displaying essential symbol data in a compact, informative format
 * suitable for sidebars, dashboards, or detailed symbol pages.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/symbol-details/symbol-info/
 *
 * @example
 * Basic usage:
 * ```tsx
 * <SymbolInfo symbol="NASDAQ:AAPL" />
 * ```
 *
 * @example
 * Custom styling and theming:
 * ```tsx
 * <SymbolInfo
 *   symbol="NASDAQ:AAPL"
 *   width={350}
 *   colorTheme="dark"
 *   locale="es"
 * />
 * ```
 *
 * @example
 * Cryptocurrency information:
 * ```tsx
 * <SymbolInfo
 *   symbol="BINANCE:BTCUSDT"
 *   width={400}
 *   colorTheme="light"
 *   isTransparent
 * />
 * ```
 *
 * @example
 * Forex pair details:
 * ```tsx
 * <SymbolInfo
 *   symbol="FOREX:EURUSD"
 *   width={320}
 *   colorTheme="dark"
 *   locale="en"
 *   isTransparent={false}
 * />
 * ```
 */
export const SymbolInfo = (props: SymbolInfoProps): JSX.Element => {
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
          "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js",
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
