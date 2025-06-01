import { loadScript } from "@dschz/load-script";
import { tryCatch } from "@dschz/try-catch";
import { createEffect, mergeProps, onCleanup } from "solid-js";

import type { ColorTheme, Locale, Size } from "../types";

/**
 * Props for the CompanyProfile component.
 */
export type CompanyProfileProps = {
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
 * TradingView CompanyProfile widget for displaying detailed company information.
 *
 * This widget provides comprehensive company information including business description,
 * sector classification, industry details, key statistics, and fundamental data.
 * Perfect for displaying essential company background information for publicly
 * traded companies in research interfaces, company pages, or financial dashboards.
 *
 * @see https://www.tradingview.com/widget-docs/widgets/symbol-details/company-profile/
 *
 * @example
 * Basic usage:
 * ```tsx
 * <CompanyProfile symbol="NASDAQ:AAPL" />
 * ```
 *
 * @example
 * Custom styling and dimensions:
 * ```tsx
 * <CompanyProfile
 *   symbol="NYSE:TSLA"
 *   width={600}
 *   height={400}
 *   colorTheme="dark"
 *   autosize={false}
 * />
 * ```
 *
 * @example
 * Financial services company:
 * ```tsx
 * <CompanyProfile
 *   symbol="NYSE:JPM"
 *   colorTheme="light"
 *   locale="en"
 *   isTransparent
 * />
 * ```
 *
 * @example
 * Technology company with custom locale:
 * ```tsx
 * <CompanyProfile
 *   symbol="NASDAQ:GOOGL"
 *   width={500}
 *   height={350}
 *   locale="es"
 *   colorTheme="dark"
 *   autosize={false}
 *   isTransparent={false}
 * />
 * ```
 */
export const CompanyProfile = (props: CompanyProfileProps) => {
  let container!: HTMLDivElement;

  const _props = mergeProps(
    {
      width: "full" as const,
      height: "full" as const,
      locale: "en" as Locale,
      colorTheme: "light" as ColorTheme,
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
          "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js",
          {
            textContent: JSON.stringify({
              symbol: _props.symbol,
              width: fullWidth ? "100%" : _props.width,
              height: fullHeight ? "100%" : _props.height,
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
