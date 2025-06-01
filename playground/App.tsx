import { Route, Router } from "@solidjs/router";
import { ErrorBoundary, For, type JSX, type ParentProps } from "solid-js";

import { Navbar } from "./Navbar";
import { AdvancedChartTest } from "./pages/AdvancedChartTest";
import { CompanyProfileTest } from "./pages/CompanyProfileTest";
import { CryptoMarketTest } from "./pages/CryptoMarketTest";
import { EconomicCalendarTest } from "./pages/EconomicCalendarTest";
import { ErrorPage } from "./pages/Error";
import { FundamentalDataTest } from "./pages/FundamentalDataTest";
import { Home } from "./pages/Home";
import { MiniChartTest } from "./pages/MiniChartTest";
import { NotFound } from "./pages/NotFound";
import { ScreenerTest } from "./pages/ScreenerTest";
import { SingleTickerTest } from "./pages/SingleTickerTest";
import { SymbolInfoTest } from "./pages/SymbolInfoTest";
import { SymbolOverviewTest } from "./pages/SymbolOverviewTest";
import { TechnicalAnalysisTest } from "./pages/TechnicalAnalysisTest";
import { TopStoriesTest } from "./pages/TopStoriesTest";

type Page = {
  readonly path: string;
  readonly component: () => JSX.Element;
};

const PAGES: readonly Page[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/symbol-info",
    component: SymbolInfoTest,
  },
  {
    path: "/technical-analysis",
    component: TechnicalAnalysisTest,
  },
  {
    path: "/advanced-chart",
    component: AdvancedChartTest,
  },
  {
    path: "/mini-chart",
    component: MiniChartTest,
  },
  {
    path: "/symbol-overview",
    component: SymbolOverviewTest,
  },
  {
    path: "/single-ticker",
    component: SingleTickerTest,
  },
  {
    path: "/fundamental-data",
    component: FundamentalDataTest,
  },
  {
    path: "/company-profile",
    component: CompanyProfileTest,
  },
  {
    path: "/crypto-market",
    component: CryptoMarketTest,
  },
  {
    path: "/screener",
    component: ScreenerTest,
  },
  {
    path: "/top-stories",
    component: TopStoriesTest,
  },
  {
    path: "/economic-calendar",
    component: EconomicCalendarTest,
  },
  {
    path: "*",
    component: NotFound,
  },
];

const MainContent = (props: ParentProps) => {
  return <main class="flex-1 overflow-auto bg-white pt-16 md:pt-0">{props.children}</main>;
};

const RootLayout = (props: ParentProps) => (
  <div id="root-screen" class="h-screen w-screen flex">
    <Navbar />
    <MainContent>{props.children}</MainContent>
  </div>
);

export const App = () => {
  return (
    <ErrorBoundary fallback={(e, r) => <ErrorPage error={e} reset={r} />}>
      <Router root={RootLayout}>
        <For each={PAGES}>{(page) => <Route path={page.path} component={page.component} />}</For>
      </Router>
    </ErrorBoundary>
  );
};
