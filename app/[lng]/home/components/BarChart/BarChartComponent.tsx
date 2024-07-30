import BarChart from "./BarChart";
import { getAllAccountsForBarChart } from "@/app/services/accounting/controller";
import type {
  AccountingsForBarChartProps,
  SearchParamsForBarChart,
} from "@/app/interfaces";

const BarChartComponent = async ({
  searchParams,
}: {
  searchParams: SearchParamsForBarChart;
}) => {
  const accountings = (await getAllAccountsForBarChart(
    searchParams
  )) as AccountingsForBarChartProps[];

  return <BarChart accountings={accountings} />;
};

export default BarChartComponent;
