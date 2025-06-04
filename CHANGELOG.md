# @dschz/solid-tradingview-widgets

## 0.1.1

### Patch Changes

- adds explicit return types for jsr publishing

## 0.1.0

**🎉 Initial release of solid-tradingview-widgets** - A comprehensive collection of TradingView iframe widgets for SolidJS applications

### ✨ Features

- **🎯 Type-Safe Components**: Full TypeScript support with comprehensive prop validation and IntelliSense
- **⚡ SolidJS Reactive**: Built specifically for SolidJS with reactive prop updates and optimal performance
- **🎨 Extensive Customization**: Support for themes, colors, locales, and widget-specific configurations
- **📱 Responsive Design**: Mobile-friendly widgets with auto-sizing and container adaptation
- **🌍 Multi-Language Support**: Support for 30+ locales including English, Spanish, German, Japanese, and more
- **🔧 iframe Architecture**: Secure, sandboxed TradingView widgets with direct data from TradingView servers
- **📦 Tree-Shakable**: Import only the widgets you need for optimal bundle sizes
- **🚀 Performance Optimized**: Efficient loading, error handling, and memory management

### 📊 Implemented Widgets (12 Total)

#### 📈 Charts (3 widgets)

- **`AdvancedChart`**: Full-featured interactive trading chart with 100+ indicators, drawing tools, and multi-timeframes
- **`MiniChart`**: Compact price chart widget with customizable colors, date ranges, and trend visualization
- **`SymbolOverview`**: Symbol overview combining price information with mini chart display

#### 🏷️ Symbol Details (4 widgets)

- **`SymbolInfo`**: Real-time symbol data with price, change, volume, and market cap information
- **`TechnicalAnalysis`**: Technical indicator gauges showing RSI, MACD, moving averages analysis with buy/sell signals
- **`FundamentalData`**: Financial metrics display with P/E ratios, revenue, margins, and growth data
- **`CompanyProfile`**: Detailed company information with business description, sector classification, and key statistics

#### 🎯 Tickers (1 widget)

- **`SingleTicker`**: Individual symbol ticker with compact price display and real-time updates

#### 🔍 Screeners (2 widgets)

- **`Screener`**: Multi-market stock screener with advanced filtering by fundamentals and technicals
- **`CryptoMarket`**: Cryptocurrency market overview with USD/BTC pricing and market cap rankings

#### 📰 News & Events (2 widgets)

- **`TopStories`**: Financial news feed with market news, symbol-specific stories, and multiple display modes
- **`EconomicCalendar`**: Economic events calendar with GDP, inflation, central bank events, and 80+ country coverage

### 🎮 Interactive Playground

- **📱 Comprehensive Demo Platform**: Interactive playground showcasing all 12 widgets
- **⚙️ Live Configuration**: Real-time prop adjustment with instant visual feedback
- **🎨 Theme Testing**: Switch between light/dark modes and custom color schemes
- **📊 Feature Comparison**: Side-by-side widget comparisons and demonstrations
- **📱 Responsive Preview**: Test different container sizes and responsive behavior
- **📝 Implementation Examples**: Ready-to-copy code examples for each widget
- **🚀 Hot Reload Development**: Local development server with instant feedback

### 🎨 Theming & Styling Support

- **Color Formats**: Comprehensive support for Hex, RGB/RGBA, HSL, and OKLCH color formats
- **Theme Modes**: Light and dark theme support across all widgets
- **Custom Styling**: Extensive customization options for backgrounds, grids, and UI elements
- **Responsive Behavior**: Automatic container adaptation and mobile-friendly layouts

### 🌍 Internationalization

- **30+ Locales**: Full support for global markets including major languages and regions
- **Timezone Support**: Comprehensive timezone handling for global trading sessions
- **Currency Display**: Multi-currency support with proper formatting and symbols
- **Date/Time Formatting**: Locale-aware date and time display across all widgets

### 📚 Documentation & Developer Experience

- **📖 Comprehensive README**: Detailed usage examples, API reference, and best practices
- **🎯 TypeScript Definitions**: Complete type definitions with JSDoc documentation
- **💡 IntelliSense Support**: Rich IDE experience with prop suggestions and validation
- **🧪 Interactive Examples**: Live playground with real-world usage scenarios
- **📋 Widget Categories**: Organized documentation by widget type and use case

### 🔧 Technical Architecture

- **iframe Embedding**: Secure, sandboxed widget implementation using TradingView's official iframe approach
- **Reactive Props**: Full SolidJS reactivity with prop updates triggering widget refresh
- **Error Handling**: Comprehensive error handling with optional error callbacks
- **Performance**: Optimized loading strategies and memory management
- **Security**: Sandboxed execution environment with CSP compliance

### 📦 Package & Distribution

- **ES Modules**: Modern ESM build with tree-shaking support
- **TypeScript**: Full type definitions included in the package
- **Bundle Optimization**: Minimal bundle impact with efficient widget loading
- **Dependency Management**: Clean dependency tree with SolidJS as the only peer dependency

### 🚀 Development Tools

- **Local Playground**: Development server for local widget testing and exploration
- **Hot Reload**: Instant feedback during development and customization
- **Build System**: Modern build pipeline with TypeScript, bundling, and optimization
- **Testing Environment**: Interactive testing platform for all widget configurations
