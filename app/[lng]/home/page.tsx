import { Suspense } from "react";
import { useTranslation } from "@/app/i18n";
import {
  CurrencySelect,
  BarChartSkeleton,
  BarChartComponent,
} from "./components";
import type {
  BaseLangPageProps,
  SearchParamsForBarChart,
} from "@/app/interfaces";

interface HomePageProps extends BaseLangPageProps {
  searchParams?: SearchParamsForBarChart;
}

const HomePage = async ({ searchParams, params: { lng } }: HomePageProps) => {
  const { t } = await useTranslation(lng, "home");

  const { currencyToTake = "usd" } = searchParams || {};

  const searchParamsForBarChart = {
    currencyToTake,
  };

  return (
    <>
      <h1 className="dark:text-white">{t("title")}</h1>
      <CurrencySelect />
      <Suspense key={currencyToTake} fallback={<BarChartSkeleton />}>
        <BarChartComponent searchParams={searchParamsForBarChart} />
      </Suspense>
    </>
  );
};

export default HomePage;
